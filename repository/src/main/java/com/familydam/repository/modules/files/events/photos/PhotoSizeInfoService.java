package com.familydam.repository.modules.files.events.photos;

import com.familydam.repository.Constants;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.services.IEventService;
import com.familydam.repository.modules.files.services.FsReadFileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class PhotoSizeInfoService implements IEventService, EventListener
{
    Logger log = LoggerFactory.getLogger(PhotoSizeInfoService.class);


    public Repository repository;
    public AdminUser adminUser;
    FsReadFileService readFileService;

    public PhotoSizeInfoService(AdminUser adminUser, Repository repository, FsReadFileService readFileService) {
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
                    log.info("[EVENT] PhotoSizeInfo - ADDED " + node.getPath() + " | " + Thread.currentThread().getId());

                    Map size = getImageSize(session, node);
                    node.addMixin(Constants.DAM_IMAGE);
                    node.setProperty("width", (Integer) size.get("width"));
                    node.setProperty("height", (Integer) size.get("height"));
                    session.save();
                }
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }


    private Map getImageSize(Session session, Node node) {
        Map imgMap = new HashMap();
        try {
            InputStream is = readFileService.readFile(node);
            ImageInputStream iis = ImageIO.createImageInputStream(is);

            String mimeType = node.getNode("jcr:content").getProperty("jcr:mimeType").getString();
            Iterator<ImageReader> readers = ImageIO.getImageReadersByMIMEType(mimeType);

            if (readers.hasNext()) {
                try {
                    ImageReader ir = readers.next();
                    ir.setInput(iis, true);

                    imgMap.put("width", ir.getWidth(0));
                    imgMap.put("height", ir.getHeight(0));
                    imgMap.put("aspectRatio", ir.getAspectRatio(0));
                    imgMap.put("formatName", ir.getFormatName());
                    return imgMap;
                } catch (Exception ex) {
                    ex.printStackTrace();
                } finally {
                    is.close();
                    iis.close();
                }
            }

        } catch (IOException ex) {
            log.error(ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }


        //def stream = ImageIO.createImageInputStream(new ByteArrayInputStream(inputStream))
        //def reader = ImageIO.getImageReader(getReaderByFormat(format))
        //reader.setInput(stream, true)
        //println "width:reader.getWidth(0) -> height: reader.getHeight(0)"

        imgMap.put("width", 250);
        imgMap.put("height", 250);
        return imgMap;
    }
}
