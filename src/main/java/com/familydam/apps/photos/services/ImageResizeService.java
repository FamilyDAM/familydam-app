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
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Dictionary;


/**
 * Created by mnimer on 12/16/14.
 */


/**
@Component(metatype = true, immediate=true)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.photos.services.ImageResizeService"),
        @Property(name = "service.vendor", value = "The FamilyDAM Project"),
        @Property(name = "service.description", value = "Image resizing servlet used to generate and cache thumbnails and other image sizes."),
        @Property(name = "resize-library", label = "Resize Library", value = "scalr", description = "What resizing library should we use"
                , options = {
                @PropertyOption(name = "scalr", value = "scalr"),
                @PropertyOption(name = "image-magic", value = "image-magick")
        }),
        @Property(name = "image-magick-path", label = "Image Magic Path.", value = {""}, description = "Path to your local installation of Image Magick (ex: /opt/local/bin)")
})
**/
public class ImageResizeService implements IImageResizeService
{
    private Logger log = LoggerFactory.getLogger(this.getClass());

    private ConvertCmd convertCommand;
    private IdentifyCmd identifyCmd;

    private String resizeLibrary = "scalr";
    private String imageMagickPath = "/";


    public ImageResizeService(String resizeLibrary, String imageMagickPath)
    {
        this.resizeLibrary = resizeLibrary;
        this.imageMagickPath = imageMagickPath;
    }


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        String defaultLibrary = "scalr";
        String defaultImageMagickLocation = "/opt/local/bin";
        //todo, add OS check for windows and set win default instead of mac default

        this.resizeLibrary = PropertiesUtil.toString(props.get("resize-library"), defaultLibrary);
        this.imageMagickPath = PropertiesUtil.toString(props.get("image-magick-path"), defaultImageMagickLocation);
    }



    public File resizeImage(Resource resource, String uri, String mimeTypeExt, InputStream is, int longSize) throws RepositoryException, IOException
    {
        if( this.resizeLibrary.equalsIgnoreCase("image-magick") ) {

            File tempImage = scaleWithImageMagik(resource, is, longSize);
            return tempImage;

        }else{

            BufferedImage bufImage = scaleWithScalr(is, longSize);

            File tempFile = File.createTempFile(uri.substring(uri.lastIndexOf("/")+1), mimeTypeExt);
            ImageIO.write(bufImage, mimeTypeExt, tempFile);

            return tempFile;
        }
    }


    /**
     * Simple java only image resizing library
     * @param is
     * @param longSize
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    public BufferedImage scaleWithScalr(InputStream is, int longSize) throws RepositoryException, IOException
    {
        BufferedImage newImage = ScaleWithScalr(is, longSize, Scalr.Method.AUTOMATIC);
        return newImage;
    }


    /**
     * If it's installed we'll use the more powerful Image Magik Library
     *
     * @param resource_
     * @param is_
     * @param longSize_
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    public File scaleWithImageMagik(Resource resource_, InputStream is_, int longSize_) throws RepositoryException, IOException
    {
        File _tmpNodeFile = null;
        File _tmpResizedFile = null;


        try {
            String[] nameParts = resource_.getName().split("\\.");
            _tmpNodeFile = File.createTempFile(nameParts[0], "." +nameParts[1]);
            _tmpResizedFile = File.createTempFile(nameParts[0] +"x" +longSize_, "." +nameParts[1]);
            _tmpNodeFile.deleteOnExit();
            _tmpResizedFile.deleteOnExit();
            // write the inputStream to a FileOutputStream
            IOUtils.copy(is_, new FileOutputStream(_tmpNodeFile));


            // create command
            if( convertCommand == null ) {
                //ProcessStarter.setGlobalSearchPath(imageToolsPath);
                convertCommand = new ConvertCmd();
                identifyCmd = new IdentifyCmd();
                convertCommand.setSearchPath(imageMagickPath);
            }



            // create the operation, add images and operators/options
            IMOperation op = new IMOperation();
            op.addImage(_tmpNodeFile.getAbsolutePath());
            op.autoOrient();
            op.resize(longSize_);
            op.addImage(_tmpResizedFile.getAbsolutePath());

            // execute the operation
            convertCommand.run(op);

            log.trace("    Scale Image with ImageMagick x" +longSize_ +" | " +resource_.getPath());
            String newImagePath = _tmpResizedFile.getAbsolutePath();

            File tmpFile = new File(newImagePath);
            return tmpFile;

        }
        catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
        finally {
            if( _tmpNodeFile.exists() ) _tmpNodeFile.delete();
        }
    }



    /**
     * A lot of images, especially mobile, are technically saved in any orientation with metadata to tell us how to flip it to
     * what humans would expect to see.
     * @param session
     * @param node
     * @return
     * @throws RepositoryException
     * @throws IOException
     * @throws ImageProcessingException
     * @throws MetadataException
     */
    public BufferedImage rotateImage(Session session, Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException
    {

        InputStream metadataIS = JcrUtils.readFile(node);
        InputStream originalImageIS = JcrUtils.readFile(node);
        BufferedImage originalImage = ImageIO.read(originalImageIS);

        if( metadataIS == null ) return originalImage;

        Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);

        ExifIFD0Directory exifIFD0Directory = metadata.getDirectory(ExifIFD0Directory.class);
        JpegDirectory jpegDirectory = (JpegDirectory) metadata.getDirectory(JpegDirectory.class);

        int orientation = 1;
        if( exifIFD0Directory != null && exifIFD0Directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION) ) {
            try {
                orientation = exifIFD0Directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            }
            catch (Exception ex) {
                ex.printStackTrace();
            }
        }else{
            return originalImage;
        }

        if( jpegDirectory != null ) {
            int width = jpegDirectory.getImageWidth();
            int height = jpegDirectory.getImageHeight();

            AffineTransform affineTransform = new AffineTransform();

            switch (orientation) {
                case 1:
                    return originalImage;
                case 2: // Flip X
                    affineTransform.scale(-1.0, 1.0);
                    affineTransform.translate(-width, 0);
                    break;
                case 3: // PI rotation
                    affineTransform.translate(width, height);
                    affineTransform.rotate(Math.PI);
                    break;
                case 4: // Flip Y
                    affineTransform.scale(1.0, -1.0);
                    affineTransform.translate(0, -height);
                    break;
                case 5: // - PI/2 and Flip X
                    affineTransform.rotate(-Math.PI / 2);
                    affineTransform.scale(-1.0, 1.0);
                    break;
                case 6: // -PI/2 and -width
                    affineTransform.translate(height, 0);
                    affineTransform.rotate(Math.PI / 2);
                    break;
                case 7: // PI/2 and Flip
                    affineTransform.scale(-1.0, 1.0);
                    affineTransform.translate(-height, 0);
                    affineTransform.translate(0, width);
                    affineTransform.rotate(3 * Math.PI / 2);
                    break;
                case 8: // PI / 2
                    affineTransform.translate(0, width);
                    affineTransform.rotate(3 * Math.PI / 2);
                    break;
                default:
                    return originalImage;
            }

            AffineTransformOp affineTransformOp = new AffineTransformOp(affineTransform, AffineTransformOp.TYPE_BILINEAR);
            BufferedImage destinationImage = new BufferedImage(originalImage.getHeight(), originalImage.getWidth(), originalImage.getType());
            destinationImage = affineTransformOp.filter(originalImage, destinationImage);

            return destinationImage;
        }
        return originalImage;
    }



    /**
    protected void readProperties(Map<String, Object> properties)
    {
     this.scaleMethod = PropertiesUtil.toString(properties.get("simplefield"), "default");


        LOG.info(properties.toString());
        this.multiString = PropertiesUtil.toStringArray(properties.get("multifield"));
        LOG.info("Mutli String Size: " + this.multiString.length);
        this.simpleString = PropertiesUtil.toString(properties.get("simplefield"), "default");
        LOG.info("Simple String: " + this.simpleString);
    }
     **/



    private BufferedImage ScaleWithScalr(InputStream is, int longSize, Scalr.Method quality) throws RepositoryException, IOException
    {
        BufferedImage bufferedImage = ImageIO.read(is);

        BufferedImage scaledImage = Scalr.resize(bufferedImage, quality, longSize);

        return scaledImage;
    }


    /****
    private String ScaleWithImageMagik(Session session, Node node, int longSize, String format) throws RepositoryException, IOException
    {
        InputStream is = JcrUtils.readFile(node);
        String[] nameParts = node.getName().split("\\.");
        File _tmpFile = File.createTempFile(nameParts[0], "." +nameParts[1]);
        File _tmpSmallFile = File.createTempFile(nameParts[0] +"x" +longSize, "." +nameParts[1]);
        _tmpFile.deleteOnExit();
        _tmpSmallFile.deleteOnExit();
        // write the inputStream to a FileOutputStream
        IOUtils.copy(is, new FileOutputStream(_tmpFile));

        //File _tmpThumbnailFile = File.createTempFile(node.getName() + "_thumbnail", "");


        try {
            // create command
            if( convertCommand == null ) {
                //ProcessStarter.setGlobalSearchPath(imageToolsPath);
                convertCommand = new ConvertCmd();
                identifyCmd = new IdentifyCmd();
                convertCommand.setSearchPath(imageToolsPath);
            }



            // create the operation, add images and operators/options
            IMOperation op = new IMOperation();
            op.addImage(_tmpFile.getAbsolutePath());
            op.autoOrient();
            op.resize(longSize);
            op.addImage(_tmpSmallFile.getAbsolutePath());
            //op.addImage(_tmpThumbnailFile.getAbsolutePath());

            // execute the operation
            convertCommand.run(op);

            log.trace("    Scale Image with ImageMagick x" +longSize +" | " +node.getPath());
            String newImagePath = _tmpSmallFile.getAbsolutePath();


            // GET The image info for the thumbnail
            InputStream tmpImageIS = new FileInputStream(_tmpSmallFile);
            BufferedImage tmpBufferedImage = ImageIO.read(tmpImageIS);

            // Save Rendition
            log.trace("    Resize thumbnail w=" +tmpBufferedImage.getWidth() +" | h=" +tmpBufferedImage.getHeight() +" | " +node.getPath());
            FileInputStream fileInputStream = new FileInputStream(newImagePath);
            String newNodePath = this.saveRendition(session, node, "web." +longSize, tmpBufferedImage.getWidth(), tmpBufferedImage.getHeight(), fileInputStream, nameParts[1]);
            return newNodePath;

        }
        catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
        finally{
            if( _tmpFile.exists() ) _tmpFile.delete();
            if( _tmpSmallFile.exists() ) _tmpSmallFile.delete();
        }
    }
    ***/
}
