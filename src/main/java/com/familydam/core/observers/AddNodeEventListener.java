/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.observers;

import com.familydam.core.FamilyDAMCoreConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;

/**
 * Created by mnimer on 3/4/16.
 */
@Property(name = org.osgi.service.event.EventConstants.EVENT_TOPIC,
        value = SlingConstants.TOPIC_RESOURCE_ADDED)
@Component(immediate = true)
@Service(value = EventHandler.class)
public class AddNodeEventListener implements EventHandler
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

                    final Session session = adminResolver.adaptTo(Session.class);
                    // save the session, before changing props
                    session.save();

                    Node node = res.adaptTo(Node.class);
                    node.addMixin(NodeType.MIX_REFERENCEABLE);
                    node.addMixin(NodeType.MIX_LAST_MODIFIED);
                    node.addMixin(FamilyDAMCoreConstants.DAM_EXTENSIBLE);

                    final String mimeType = res.getResourceMetadata().getContentType();
                    //log.trace(propPath + " | mimetype=" + mimeType);

                    if (mimeType.startsWith("image")) {
                        node.addMixin(FamilyDAMCoreConstants.DAM_IMAGE);
                        node.addMixin(NodeType.MIX_VERSIONABLE);
                        //save mixin changes
                        session.save();
                    }

                }

            }catch(Exception ex){
                log.error(ex.getMessage(),ex);
            }




        }


    }

}
