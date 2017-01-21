/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.observers;

import com.familydam.apps.photos.FamilyDAMConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by mnimer on 3/4/16.
 */
@Property(name = org.osgi.service.event.EventConstants.EVENT_TOPIC,
        value = org.apache.sling.api.SlingConstants.TOPIC_RESOURCE_ADDED)
@Component(immediate = true)
@Service(value = EventHandler.class)
public class ImageNodeEventListener implements EventHandler
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;


    @Reference
    private JobManager jobManager;


    @Override public void handleEvent(Event event)
    {
        final String propPath = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        final String propResType = (String) event.getProperty(SlingConstants.PROPERTY_RESOURCE_TYPE);
        final String userId = (String) event.getProperty(SlingConstants.PROPERTY_USERID);


        // a job is started if a file is added to /tmp/dropbox
        if (propPath.startsWith("/content") && "nt:file".equals(propResType)) {

            ResourceResolver adminResolver = null;

            try {
                adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
                final Resource res = adminResolver.getResource(propPath);

                if (res.isResourceType("nt:file")) {
                    final String mimeType = res.getResourceMetadata().getContentType();
                    //log.trace(propPath + " | mimetype=" + mimeType);

                    if (mimeType.startsWith("image")) {

                        //todo: replace admin session logic - http://stackoverflow.com/questions/31350548/resourceresolverfactory-getserviceresourceresolver-throws-exception-in-aem-6-1
                        final Session session = adminResolver.adaptTo(Session.class);
                        // save the session, before changing props
                        session.save();

                        Node node = res.adaptTo(Node.class);
                        node.addMixin(FamilyDAMConstants.DAM_IMAGE);
                        node.addMixin(FamilyDAMConstants.DAM_EXTENSIBLE);
                        //save mixin changes
                        session.save();


                        // create JOB payload
                        final Map<String, Object> payload = new HashMap<String, Object>();
                        payload.put("resourcePath", propPath);
                        payload.put("resourceType", propResType);
                        payload.put("eventUserId", userId);


                        // start jobs
                        Job exifJob = this.jobManager.addJob(FamilyDAMConstants.EXIF_JOB_TOPIC, payload);
                        Job phashJob = this.jobManager.addJob(FamilyDAMConstants.PHASH_JOB_TOPIC, payload);

                        log.debug("The FamilyDAM IMAGE jobs have been created for: {}", propPath);

                    }

                }

            }catch(Exception ex){
                log.error(ex.getMessage(),ex);
            }




        }


    }

}
