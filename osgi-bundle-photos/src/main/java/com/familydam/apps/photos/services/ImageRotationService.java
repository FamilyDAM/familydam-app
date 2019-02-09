/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.services;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.jpeg.JpegDirectory;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.PropertyOption;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.commons.IOUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.im4java.core.ConvertCmd;
import org.im4java.core.IMOperation;
import org.im4java.core.IdentifyCmd;
import org.imgscalr.Scalr;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Dictionary;


/**
 * Created by mnimer on 12/16/14.
 */

/**
 * /mnt/DroboFS/Shares/DroboApps/imagemagick/bin
 **/
@Component(metatype = false, immediate = true)
@Properties({
    @Property(name = "service.pid", value = "com.familydam.apps.photos.services.ImageRotationService"),
    @Property(name = "service.vendor", value = "The FamilyDAM Project"),
    @Property(name = "service.description", value = "Image rotation service used to correct image orientation.")
})
public class ImageRotationService implements IImageRotationService {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    private ConvertCmd convertCommand;
    private IdentifyCmd identifyCmd;

    private String resizeLibrary = "scalr";
    private String imageMagickPath = "/";


    public ImageRotationService() {
    }


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();
    }


    /**
     * A lot of images, especially mobile, are technically saved in any orientation with metadata to tell us how to flip it to
     * what humans would expect to see.
     *
     * @param session
     * @param node
     * @return
     * @throws RepositoryException
     * @throws IOException
     * @throws ImageProcessingException
     * @throws MetadataException
     */
    public BufferedImage rotateImage(Session session, Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException {

        InputStream metadataIS = JcrUtils.readFile(node);
        InputStream originalImageIS = JcrUtils.readFile(node);
        BufferedImage originalImage = ImageIO.read(originalImageIS);

        if (metadataIS == null) return originalImage;

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);

        return rotateImage(originalImage, metadata);
    }


    /**
     * A lot of images, especially mobile, are technically saved in any orientation with metadata to tell us how to flip it to
     * what humans would expect to see.
     *
     * @param file
     * @return
     * @throws RepositoryException
     * @throws IOException
     * @throws ImageProcessingException
     * @throws MetadataException
     */
    public BufferedImage rotateImage(File file) throws RepositoryException, IOException, ImageProcessingException, MetadataException {
        InputStream metadataIS = new FileInputStream(file);
        BufferedImage originalImage = ImageIO.read(file);

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);

        return rotateImage(originalImage, metadata);
    }


    /**
     * A lot of images, especially mobile, are technically saved in any orientation with metadata to tell us how to flip it to
     * what humans would expect to see.
     *
     * @param image
     * @param resource
     * @return
     * @throws RepositoryException
     * @throws IOException
     * @throws ImageProcessingException
     * @throws MetadataException
     */
    public BufferedImage rotateImage(BufferedImage image, Resource resource) throws RepositoryException, IOException, ImageProcessingException, MetadataException {
        Node imageNode = resource.adaptTo(Node.class);
        InputStream metadataIS = JcrUtils.readFile(imageNode);
        if (metadataIS == null) return image;

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);
        return rotateImage(image, metadata);
    }


    private BufferedImage rotateImage(BufferedImage originalImage, Metadata metadata) throws MetadataException, IOException {
        ExifIFD0Directory exifIFD0Directory = metadata.getDirectory(ExifIFD0Directory.class);
        JpegDirectory jpegDirectory = (JpegDirectory) metadata.getDirectory(JpegDirectory.class);

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

            /**
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
                    //ImageIO.write(img, "JPG", new File("/Users/mike/Desktop/rotated-2.jpg"));
                    return img;
                //affineTransform.scale(-1.0, 1.0);
                //affineTransform.translate(-width, 0);
                //break;
                case 3: // PI rotation
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_180);
                    //ImageIO.write(img, "JPG", new File("/Users/mike/Desktop/rotated-3.jpg"));
                    return img;
                //affineTransform.translate(width, height);
                //affineTransform.rotate(Math.PI);
                //break;
                case 4: // Flip Y
                    img = Scalr.rotate(originalImage, Scalr.Rotation.FLIP_VERT);
                    ImageIO.write(img, "JPG", new File("/Users/mike/Desktop/rotated-4.jpg"));
                    return img;
//                    affineTransform.scale(1.0, -1.0);
//                    affineTransform.translate(0, -height);
//                    break;
                case 5: // - PI/2 and Flip X
                    //todo, rotate 90 and flip vert
                    affineTransform.rotate(-Math.PI / 2);
                    affineTransform.scale(-1.0, 1.0);
                    break;
                case 6: // -PI/2 and -width
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_90);
                    //ImageIO.write(img, "JPG", new File("/Users/mike/Desktop/rotated-6.jpg"));
                    return img;
                //affineTransform.translate(height, 0);
                //affineTransform.rotate(Math.PI / 2);
                //break;
                case 7: // PI/2 and Flip
                    //todo, rotate 270 and flip vert
                    affineTransform.scale(-1.0, 1.0);
                    affineTransform.translate(-height, 0);
                    affineTransform.translate(0, width);
                    affineTransform.rotate(3 * Math.PI / 2);
                    break;
                case 8: // PI / 2
                    img = Scalr.rotate(originalImage, Scalr.Rotation.CW_270);
                    //ImageIO.write(img, "JPG", new File("/Users/mike/Desktop/rotated-8.jpg"));
                    return img;
                //affineTransform.translate(0, width);
                //affineTransform.rotate(3 * Math.PI / 2);
                //break;
                default:
                    return originalImage;
            }

            AffineTransformOp affineTransformOp = new AffineTransformOp(affineTransform, AffineTransformOp.TYPE_BILINEAR);
            BufferedImage destinationImage = new BufferedImage(originalImage.getHeight(), originalImage.getWidth(), originalImage.getTransparency() == 1 ? 1 : 2);
            destinationImage = affineTransformOp.filter(originalImage, destinationImage);

            //debug
            //ImageIO.write(destinationImage, "JPG", new File("/Users/mike/Desktop/rotated-" +orientation +".jpg"));

            return destinationImage;
        }
        return originalImage;
    }

}
