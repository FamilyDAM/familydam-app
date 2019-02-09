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
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.commons.IOUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolverFactory;
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
@Component(metatype = true, immediate = true)
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
public class ImageResizeService implements IImageResizeService {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    private ConvertCmd convertCommand;
    private IdentifyCmd identifyCmd;

    private String resizeLibrary = "scalr";
    private String imageMagickPath = "/";

    @Reference
    private ImageRotationService rotationService;


    public ImageResizeService() {
    }


    public ImageResizeService(String resizeLibrary, String imageMagickPath) {
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


    public File resizeImage(Resource resource, String uri, String mimeTypeExt, InputStream is, int longSize) throws Exception {
        try {
            if (this.resizeLibrary.equalsIgnoreCase("image-magick")) {

                log.debug("{scaleWithImageMagik} long size:" + longSize + " | path=" + resource.getPath());
                File tempImage = scaleWithImageMagik(resource, is, longSize);
                return tempImage;

            } else {

                BufferedImage bufImage = scaleWithScalr(resource, is, longSize);

                File tempFile = File.createTempFile(uri.substring(uri.lastIndexOf("/") + 1), mimeTypeExt);
                ImageIO.write(bufImage, mimeTypeExt, tempFile);

                return tempFile;
            }
        } catch (Throwable ex) {
            //ex.printStackTrace();
            log.error(ex.getMessage(), ex);
            throw ex;
        }
    }


    /**
     * Simple java only image resizing library
     *
     * @param is
     * @param longSize
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    public BufferedImage scaleWithScalr(Resource resource, InputStream is, int longSize) throws Exception {
        BufferedImage newImage = ScaleWithScalr(resource, is, longSize, Scalr.Method.AUTOMATIC);
        return newImage;
    }


    private BufferedImage ScaleWithScalr(Resource resource, InputStream is, int longSize, Scalr.Method quality) throws Exception {
        try {
            BufferedImage bufferedImage = ImageIO.read(is);
            BufferedImage _rotatedFile = rotationService.rotateImage(bufferedImage, resource);
            BufferedImage scaledImage = Scalr.resize(_rotatedFile, quality, longSize);

            //ImageIO.write(bufferedImage, "JPG", new File("/Users/mike/Desktop/orig.jpg"));
            //ImageIO.write(scaledImage, "JPG", new File("/Users/mike/Desktop/scaled.jpg"));
            //ImageIO.write(_rotatedFile, "JPG", new File("/Users/mike/Desktop/rotated.jpg"));

            return scaledImage;
        } catch (Throwable ex) {
            //ex.printStackTrace();
            log.error(ex.getMessage(), ex);
            throw ex;
        }
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
    public File scaleWithImageMagik(Resource resource_, InputStream is_, int longSize_) throws Exception {
        File _tmpNodeFile = null;
        File _tmpResizedFile = null;


        try {
            String[] nameParts = resource_.getName().split("\\.");
            _tmpNodeFile = File.createTempFile(nameParts[0], "." + nameParts[1]);
            _tmpResizedFile = File.createTempFile(nameParts[0] + "x" + longSize_, "." + nameParts[1]);
            _tmpNodeFile.deleteOnExit();
            _tmpResizedFile.deleteOnExit();
            // write the inputStream to a FileOutputStream
            IOUtils.copy(is_, new FileOutputStream(_tmpNodeFile));


            // create command
            if (convertCommand == null) {
                //ProcessStarter.setGlobalSearchPath(imageToolsPath);
                convertCommand = new ConvertCmd();
                identifyCmd = new IdentifyCmd();
                convertCommand.setSearchPath(imageMagickPath);
            }


            // create the operation, add images and operators/options
            IMOperation op = new IMOperation();
            op.addImage(_tmpNodeFile.getAbsolutePath());
            op.resize(longSize_);
            op.autoOrient();
            op.colorspace("RGB");
            //op.orient();
            op.addImage(_tmpResizedFile.getAbsolutePath());

            // execute the operation
            convertCommand.run(op);

            log.trace("    Scale Image with ImageMagick x" + longSize_ + " | " + resource_.getPath());
            String newImagePath = _tmpResizedFile.getAbsolutePath();

            File tmpFile = new File(newImagePath);
            BufferedImage _rotatedFile = rotationService.rotateImage(tmpFile);
            if (_rotatedFile != null) {
                ImageIO.write(_rotatedFile, nameParts[1], tmpFile);
            }
            return tmpFile;
        } catch (Exception ex) {
            //ex.printStackTrace();
            log.error(ex.getMessage(), ex);
            return null;
        } finally {
            if (_tmpNodeFile.exists()) _tmpNodeFile.delete();
        }
    }

}
