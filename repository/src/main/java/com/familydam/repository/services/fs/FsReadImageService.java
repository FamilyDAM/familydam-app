package com.familydam.repository.services.fs;

import com.familydam.repository.events.photo.PhotoRotationService;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.commons.IOUtils;
import org.im4java.core.ConvertCmd;
import org.im4java.core.IMOperation;
import org.im4java.core.IdentifyCmd;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * While reading a file, resize the longest edge, and cache it (will return cache if exists)
 */
@Service
public class FsReadImageService implements IRestService {
    Logger log = LoggerFactory.getLogger(FsListService.class);


    PhotoRotationService photoRotationService;

    @Value("familydam.image.imagemagick-path.linux")
    private String imageMagickPathLinux;
    @Value("familydam.image.imagemagick-path.win")
    private String imageMagickPathWin;
    @Value("familydam.image.imagemagick-path.mac")
    private String imageMagickPathMac;


    ScalrService scalrService;
    ImageMagickService imageMagickService;

    public FsReadImageService(PhotoRotationService photoRotationService) {
        this.photoRotationService = photoRotationService;

        scalrService = new ScalrService(photoRotationService);
        imageMagickService = new ImageMagickService(photoRotationService, imageMagickPathLinux, imageMagickPathWin, imageMagickPathMac);
    }


    public InputStream readFile(Node node, HttpServletRequest request) throws RepositoryException {
        try {
            if (request.getParameter("size") != null) {
                return readFile(node, request.getParameter("size"));
            }
            return JcrUtils.readFile(node);
        } catch (Exception ex) {
            return JcrUtils.readFile(node);
        }
    }


    public InputStream readFile(Node node, String size) throws RepositoryException {
        try {
            Integer _size = new Integer(size);
            return resize(node, _size);
        } catch (Exception ex) {
            return JcrUtils.readFile(node);
        }
    }


    public InputStream resize(Node node, Integer longSize) throws Exception {

        String mimeType = node.getNode("jcr:content").getProperty("jcr:mimeType").getString();
        InputStream is = JcrUtils.readFile(node);

        BufferedImage bufImage;
        if (imageMagickService.installed()) {
            bufImage = imageMagickService.scale(node, is, longSize);
        } else {
            bufImage = scalrService.scale(node, is, longSize);
        }

        File tempFile = File.createTempFile("image_", "tmp");
        ImageIO.write(bufImage, mimeType.split("/")[1], tempFile);

        return new FileInputStream(tempFile);
    }
}



class ScalrService {

    Logger log = LoggerFactory.getLogger(ScalrService.class);

    PhotoRotationService rotationService;

    public ScalrService(PhotoRotationService rotationService) {
        this.rotationService = rotationService;
    }

    // Simple java only image resizing library
    public BufferedImage scale(Node node, InputStream is, int longSize) throws Exception {
        BufferedImage newImage = scale(node, is, longSize, Scalr.Method.AUTOMATIC);
        return newImage;
    }


    private BufferedImage scale(Node node, InputStream is, int longSize, Scalr.Method quality) throws Exception {
        try {
            BufferedImage bufferedImage = ImageIO.read(is);
            BufferedImage _rotatedFile = rotationService.rotateImage(bufferedImage, node);
            BufferedImage scaledImage = Scalr.resize(_rotatedFile, quality, longSize);

            //ImageIO.write(bufferedImage, "JPG", new File("./orig.jpg"));
            //ImageIO.write(scaledImage, "JPG", new File("./scaled.jpg"));
            //ImageIO.write(_rotatedFile, "JPG", new File("./rotated.jpg"));

            return scaledImage;
        } catch (Throwable ex) {
            //ex.printStackTrace();
            throw new Exception(ex);
        }
    }
}


class ImageMagickService {

    Logger log = LoggerFactory.getLogger(ImageMagickService.class);


    private ConvertCmd convertCommand;
    private IdentifyCmd identifyCmd;

    PhotoRotationService rotationService;

    String imageMagickPathLinux;
    String imageMagickPathWin;
    String imageMagickPathMac;

    private static String OS = System.getProperty("os.name").toLowerCase();

    public ImageMagickService(PhotoRotationService rotationService, String imageMagickPathLinux, String imageMagickPathWin, String imageMagickPathMac) {
        this.rotationService = rotationService;
        this.imageMagickPathLinux = imageMagickPathLinux;
        this.imageMagickPathWin = imageMagickPathWin;
        this.imageMagickPathMac = imageMagickPathMac;


        // create command
        if (convertCommand == null) {
            //ProcessStarter.setGlobalSearchPath(imageToolsPath);
            convertCommand = new ConvertCmd();
            identifyCmd = new IdentifyCmd();
            if (OS.indexOf("win") >= 0) {
                convertCommand.setSearchPath(imageMagickPathWin);
            } else if (OS.indexOf("mac") >= 0) {
                convertCommand.setSearchPath(imageMagickPathMac);
            } else {
                convertCommand.setSearchPath(imageMagickPathLinux);
            }
        }
    }


    public Boolean installed() {
        return false;
        //todo: use the path to check if it exists
    }

    /**
     * If it's installed we'll use the more powerful Image Magik Library
     */
    public BufferedImage scale(Node node_, InputStream is_, int longSize_) throws Exception {
        File _tmpNodeFile = null;
        File _tmpResizedFile = null;


        try {
            String[] nameParts = node_.getName().split("\\.");
            _tmpNodeFile = File.createTempFile(nameParts[0], "." + nameParts[1]);
            _tmpResizedFile = File.createTempFile(nameParts[0] + "x" + longSize_, "." + nameParts[1]);
            _tmpNodeFile.deleteOnExit();
            _tmpResizedFile.deleteOnExit();
            // write the inputStream to a FileOutputStream
            IOUtils.copy(is_, new FileOutputStream(_tmpNodeFile));


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

            log.trace("Scaled Image with ImageMagick x" + longSize_ + " | " + node_.getPath());
            String newImagePath = _tmpResizedFile.getAbsolutePath();

            File tmpFile = new File(newImagePath);
            BufferedImage _rotatedFile = rotationService.rotateImage(tmpFile);
            return _rotatedFile;
        } catch (Exception ex) {
            //ex.printStackTrace();
            log.error(ex.getMessage(), ex);
            return null;
        } finally {
            if (_tmpNodeFile.exists()) _tmpNodeFile.delete();
        }
    }


}