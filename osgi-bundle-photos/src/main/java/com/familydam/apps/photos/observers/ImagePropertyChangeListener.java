package com.familydam.apps.photos.observers;

import com.familydam.apps.photos.FamilyDAMConstants;
import com.familydam.apps.photos.services.PeopleIndexGenerator;
import com.familydam.apps.photos.services.TagIndexGenerator;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.observation.ResourceChange;
import org.apache.sling.api.resource.observation.ResourceChangeListener;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by mike on 11/14/16.
 */
@Component(immediate = true, metatype = true)
@Service(value = {ResourceChangeListener.class, ImagePropertyChangeListener.class})
@Properties({
    @Property(name = ResourceChangeListener.CHANGES, value = {"ADDED", "CHANGED", "REMOVED"}),
    @Property(name = ResourceChangeListener.PATHS, value = {"/content"})
})
public class ImagePropertyChangeListener implements ResourceChangeListener {
    /**
     * Logger.
     */
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * Service registration for the event handler.
     */
    private volatile ServiceRegistration listenerRegistration;

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private JobManager jobManager;


    private PeopleIndexGenerator peopleIndexGenerator;
    private TagIndexGenerator tagIndexGenerator;

    @Activate
    protected void activate(BundleContext bundleContext) {
        peopleIndexGenerator = new PeopleIndexGenerator();
        tagIndexGenerator = new TagIndexGenerator();

    }

    /**
     * Deactivate this component.
     * Unregister the event handler.
     */
    @Deactivate
    protected void deactivate() {
        if (this.listenerRegistration != null) {
            this.listenerRegistration.unregister();
            this.listenerRegistration = null;
        }
    }


    @Override
    public void onChange(List<ResourceChange> changes) {

        try {
            //wait for file bundle listener to run - poor man locking
            Thread.sleep(500);

            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);


            for (ResourceChange change : changes) {

                //Resource res = adminResolver.getResource(change.getPath());
                try {
                    Node node = JcrUtils.getNodeIfExists(change.getPath(), session);
                    Resource resource = adminResolver.getResource(node.getPath());
                    String mimeType = resource.getResourceMetadata().getContentType();


                    if (resource.isResourceType("nt:file") && !change.getPath().endsWith("/content")) {
                        if (change.getType().equals(ResourceChange.ChangeType.ADDED)) {

                            session.refresh(true);
                            checkMixins(session, node);

                            if (mimeType.startsWith("image")) {
                                getImageInfo(session, node, adminResolver, resource);
                                startImageJobs(session, node, change.getUserId());
                            }

                        } else {

                            if (change.getAddedPropertyNames() != null) {
                                for (String key : change.getAddedPropertyNames()) {

                                    if (key.equalsIgnoreCase("dam:people")) {

                                        javax.jcr.Property prop = node.getProperty(key);
                                        Value[] values = prop.getValues();

                                        for (Value value : values) {
                                            peopleIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                        }

                                    } else if (key.equalsIgnoreCase("dam:tags")) {

                                        javax.jcr.Property prop = node.getProperty(key);
                                        Value[] values = prop.getValues();

                                        for (Value value : values) {
                                            tagIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                        }

                                    }
                                }
                            }


                            if (change.getChangedPropertyNames() != null) {
                                for (String key : change.getChangedPropertyNames()) {

                                    if (key.equalsIgnoreCase("dam:people")) {

                                        javax.jcr.Property prop = node.getProperty(key);
                                        Value[] values = prop.getValues();

                                        for (Value value : values) {
                                            peopleIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                        }

                                    } else if (key.equalsIgnoreCase("dam:tags")) {

                                        javax.jcr.Property prop = node.getProperty(key);
                                        Value[] values = prop.getValues();

                                        for (Value value : values) {
                                            tagIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                        }

                                    }
                                }
                            }
                        }
                    }

                } catch (RepositoryException le) {
                    log.error(le.getMessage(), le);
                }

            }

            adminResolver.close();
        }catch(LoginException|InterruptedException le){
            log.error(le.getMessage(), le);
        }

    }


    private void checkMixins(Session session, Node node) {
        try {
            if (node.canAddMixin(FamilyDAMConstants.DAM_IMAGE)) {
                node.addMixin(FamilyDAMConstants.DAM_IMAGE);
            }
            if (node.canAddMixin(FamilyDAMConstants.DAM_EXTENSIBLE)) {
                node.addMixin(FamilyDAMConstants.DAM_EXTENSIBLE);
            }
            session.save();
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }


    private void getImageInfo(Session session, Node node, ResourceResolver adminResolver, Resource res) {
        try {
            Map size = getImageSize(adminResolver, res);
            node.setProperty("width", (Integer) size.get("width"));
            node.setProperty("height", (Integer) size.get("height"));
            session.save();
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }


    private void startImageJobs(Session session, Node node, String userId) {
        try {
            // create JOB payload
            final Map<String, Object> payload = new HashMap<String, Object>();
            payload.put("resourcePath", node.getPath());
            payload.put("resourceType", node.getPrimaryNodeType());
            payload.put("eventUserId", userId);


            // start jobs
            Job rotateJob = this.jobManager.addJob(FamilyDAMConstants.ROTATE_JOB_TOPIC, payload);
            Job phashJob = this.jobManager.addJob(FamilyDAMConstants.PHASH_JOB_TOPIC, payload);
            Job thumbJob = this.jobManager.addJob(FamilyDAMConstants.THUMBNAIL_JOB_TOPIC, payload);
            Job exifJob = this.jobManager.addJob(FamilyDAMConstants.EXIF_JOB_TOPIC, payload);

            log.debug("The FamilyDAM IMAGE jobs have been created for: {}", node.getPath());

        } catch (RepositoryException le) {
            log.error(le.getMessage(), le);
        }

    }


    private Map getImageSize(ResourceResolver adminResolver, Resource res) {
        Map imgMap = new HashMap();
        try {
            InputStream is = res.adaptTo(InputStream.class);
            ImageInputStream iis = ImageIO.createImageInputStream(is);

            String mimeType = res.getResourceMetadata().getContentType();
            Iterator<ImageReader> readers = ImageIO.getImageReadersByMIMEType(mimeType);

            if (readers.hasNext()) {
                try {
                    ImageReader ir = readers.next();
                    ir.setInput(iis, true);
                    ;
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
            //todo log node and swallow
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

