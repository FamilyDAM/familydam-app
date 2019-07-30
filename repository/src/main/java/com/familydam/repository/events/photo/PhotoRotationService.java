package com.familydam.repository.events.photo;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.jpeg.JpegDirectory;
import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.IEventService;
import com.familydam.repository.services.fs.FsReadFileService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.im4java.core.ConvertCmd;
import org.im4java.core.IdentifyCmd;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * Image rotation service used to correct image orientation.
 *
 * A lot of images, especially mobile, are technically saved in any orientation with metadata to tell us how to flip it to
 * what humans would expect to see.
 */
@Service
public class PhotoRotationService implements IEventService, EventListener
{
    Logger log = LoggerFactory.getLogger(PhotoRotationService.class);

    public Repository repository;
    public AdminUser adminUser;
    FsReadFileService readFileService;

    private ConvertCmd convertCommand;
    private IdentifyCmd identifyCmd;

    private String resizeLibrary = "scalr";
    private String imageMagickPath = "/";


    public PhotoRotationService(AdminUser adminUser, Repository repository, FsReadFileService readFileService) {
        this.adminUser = adminUser;
        this.repository = repository;
        this.readFileService = readFileService;
    }


    @PostConstruct
    public void activate() throws RepositoryException {
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        ObservationManager om = session.getWorkspace().getObservationManager();
        om.addEventListener(this, Event.NODE_ADDED, "/content/files", true, null, null, false);
        session.save();
    }

    @Override
    public void onEvent(EventIterator events)
    {
        while(events.hasNext()) {
            Event event = events.nextEvent();
            if( Event.NODE_ADDED == event.getType() ) {
                try {
                    if( "nt:file".equals(event.getInfo().get("jcr:primaryType")) ) {
                        log.info("[EVENT] PhotoRotation - ADDED " + event.getPath() + " | " + Thread.currentThread().getId());
                        process(event.getPath());
                    }
                }catch (RepositoryException ex){
                    log.error(ex.getMessage(), ex);
                }
            }
        }
    }

    public void process(String path){
        try {
            Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            Node node = session.getNode(path);

            if( node.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
                String mimeType = node.getNode("jcr:content").getProperty("jcr:mimeType").getString();
                if( mimeType.startsWith("image") ) {
                    //rotate
                    BufferedImage image = rotateImage(node);
                    //rewrite rotated image
                    ByteArrayOutputStream os = new ByteArrayOutputStream();
                    ImageIO.write(image, mimeType.split("/")[1], os);
                    InputStream is = new ByteArrayInputStream(os.toByteArray());
                    //save image
                    JcrUtils.putFile(node, node.getName(), mimeType, is);
                    session.save();
                }
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }


    public BufferedImage rotateImage(Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException {

        InputStream metadataIS = JcrUtils.readFile(node);
        InputStream originalImageIS = JcrUtils.readFile(node);
        BufferedImage originalImage = ImageIO.read(originalImageIS);

        if (metadataIS == null) return originalImage;

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);
        return rotateImage(originalImage, metadata);
    }


    public BufferedImage rotateImage(File file) throws IOException, ImageProcessingException, MetadataException {
        InputStream metadataIS = new FileInputStream(file);
        BufferedImage originalImage = ImageIO.read(file);

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);
        return rotateImage(originalImage, metadata);
    }


    public BufferedImage rotateImage(BufferedImage image, Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException {
        InputStream metadataIS = JcrUtils.readFile(node);
        if (metadataIS == null) return image;

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);
        return rotateImage(image, metadata);
    }


    private BufferedImage rotateImage(BufferedImage originalImage, Metadata metadata) throws MetadataException, IOException {
        ExifIFD0Directory exifIFD0Directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
        JpegDirectory jpegDirectory = metadata.getFirstDirectoryOfType(JpegDirectory.class);

        int orientation = 1;
        if (exifIFD0Directory != null && exifIFD0Directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION)) {
            try {
                orientation = exifIFD0Directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } else {
            return originalImage;
        }


        if (jpegDirectory != null) {
            int width = jpegDirectory.getImageWidth();
            int height = jpegDirectory.getImageHeight();

            AffineTransform affineTransform = new AffineTransform();

            /*
             1) transform="";;
             2) transform="-flip horizontal";;
             3) transform="-rotate 180";;
             4) transform="-flip vertical";;
             5) transform="-transpose";;
             6) transform="-rotate 90";;
             7) transform="-transverse";;
             8) transform="-rotate 270";;
             http://jpegclub.org/exif_orientation.html
             */

            BufferedImage img;
            switch (orientation) {
                case 1:
                    return originalImage;
                case 2: // Flip X
                    img = Scalr.rotate(originalImage, Scalr.Rotation.FLIP_HORZ);
                    //ImageIO.write(img, "JPG", new File("./test/rotated-2.jpg"));
                    return img;
                case 3: // PI rotation
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_180);
                    //ImageIO.write(img, "JPG", new File("./test/rotated-3.jpg"));
                    return img;
                case 4: // Flip Y
                    img = Scalr.rotate(originalImage, Scalr.Rotation.FLIP_VERT);
                    //ImageIO.write(img, "JPG", new File("./test/rotated-4.jpg"));
                    return img;
                case 5: // - PI/2 and Flip X
                    //todo, rotate 90 and flip vert
                    affineTransform.rotate(-Math.PI / 2);
                    affineTransform.scale(-1.0, 1.0);
                    break;
                case 6: // -PI/2 and -width
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_90);
                    //ImageIO.write(img, "JPG", new File("./test/rotated-6.jpg"));
                    return img;
                case 7: // PI/2 and Flip
                    //todo, rotate 270 and flip vert
                    affineTransform.scale(-1.0, 1.0);
                    affineTransform.translate(-height, 0);
                    affineTransform.translate(0, width);
                    affineTransform.rotate(3 * Math.PI / 2);
                    break;
                case 8: // PI / 2
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_270);
                    //ImageIO.write(img, "JPG", new File("./test/rotated-8.jpg"));
                    return img;
                default:
                    return originalImage;
            }

            AffineTransformOp affineTransformOp = new AffineTransformOp(affineTransform, AffineTransformOp.TYPE_BILINEAR);
            BufferedImage destinationImage = new BufferedImage(originalImage.getHeight(), originalImage.getWidth(), originalImage.getTransparency() == 1 ? 1 : 2);
            destinationImage = affineTransformOp.filter(originalImage, destinationImage);

            //debug
            //ImageIO.write(destinationImage, "JPG", new File("./testp/rotated-" +orientation +".jpg"));

            return destinationImage;
        }
        return originalImage;
    }
}
