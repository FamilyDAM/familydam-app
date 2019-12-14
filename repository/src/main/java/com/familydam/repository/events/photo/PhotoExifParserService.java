package com.familydam.repository.events.photo;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.familydam.repository.Constants;
import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.IEventService;
import com.familydam.repository.services.fs.FsReadFileService;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

@Service
public class PhotoExifParserService implements EventListener, IEventService {
    Logger log = LoggerFactory.getLogger(PhotoSizeInfoService.class);

    public Repository repository;
    public AdminUser adminUser;
    FsReadFileService readFileService;

    public PhotoExifParserService(AdminUser adminUser, Repository repository, FsReadFileService readFileService) {
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
    public void onEvent(EventIterator events) {
        while (events.hasNext()) {
            Event event = events.nextEvent();
            if (Event.NODE_ADDED == event.getType()) {
                try {
                    process(event.getPath());
                } catch (RepositoryException ex) {
                    log.error(ex.getMessage(), ex);
                }
            }
        }
    }


    @Override
    public void process(String path) {
        try {
            Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            Node node = session.getNode(path);

            if (node.getPrimaryNodeType().isNodeType(NodeType.NT_FILE)) {
                String mimeType = node.getNode("jcr:content").getProperty("jcr:mimeType").getString();
                if (mimeType.startsWith("image")) {
                    log.info("[EVENT] PhotoExifParse - ADDED " + node.getPath() + " | " + Thread.currentThread().getId());
                    parseExif(node);
                    node.setProperty("dam:date.exif", Calendar.getInstance());
                    session.save();
                }
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }



    public void parseExif(Node node) throws RepositoryException, ImageProcessingException, IOException
    {
        try {
            Node metadataNode = JcrUtils.getOrAddNode(node, Constants.METADATA, "nt:unstructured");

            InputStream is = readFileService.readFile(node);
            Metadata metadata = ImageMetadataReader.readMetadata(is);

            Iterable<Directory> directories = metadata.getDirectories();

            for (Directory directory : directories) {
                String _name = directory.getName();

                Node tagNode = JcrUtils.getOrAddNode(metadataNode, _name, JcrConstants.NT_UNSTRUCTURED);

                Collection<Tag> tags = directory.getTags();
                for (Tag tag : tags) {
                    int tagType = tag.getTagType();
                    String tagName = tag.getTagName().replace(" ", "_").replace("/", "_");
                    String desc = tag.getDescription();
                    tagNode.setProperty(tagName, desc);

                    /**
                     String tagTypeHex = tag.getTagTypeHex();
                     String tagName = tag.getTagName();
                     String nodeName = tagName.replace(" ", "_").replace("/", "_");
                     String desc = tag.getDescription();

                     Node prop = JcrUtils.getOrAddNode(dir, nodeName, JcrConstants.NT_UNSTRUCTURED);
                     prop.setProperty("name", tagName);
                     prop.setProperty("description", desc);
                     prop.setProperty("type", tagType);
                     prop.setProperty("typeHex", tagTypeHex);
                     **/
                }
            }


            // Extract Image Date Stamp, and save to root
            if (metadata.getFirstDirectoryOfType(ExifIFD0Directory.class) != null) {
                Date metadataDate = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class).getDate(306);
                if (metadataDate != null) {
                    Calendar dateCreatedCal = Calendar.getInstance();
                    dateCreatedCal.setTime(metadataDate);
                    node.setProperty(Constants.DAM_DATECREATED, dateCreatedCal);
                }
            }


            //new DateCreatedIndexGenerator(resolverFactory).addToIndex(null, new Calendar[]{dateCreatedCal});
        }catch(Exception ex){
            log.warn("[" +node.getPath() +"] " +ex.getMessage());
        }
    }

}

