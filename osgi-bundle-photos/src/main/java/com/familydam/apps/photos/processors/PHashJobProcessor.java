/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.processors;

import com.familydam.apps.photos.FamilyDAMConstants;
import com.familydam.apps.photos.services.ImagePHash;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.impl.jobs.JobImpl;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Dictionary;

/**
 * Created by mnimer on 3/5/16.
 */
@Component(immediate = true, metatype = true)
@Service(value = JobConsumer.class)
@Property(name = "job.topics", value = FamilyDAMConstants.PHASH_JOB_TOPIC)
public class PHashJobProcessor implements JobConsumer
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Reference
    private ResourceResolverFactory resolverFactory;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();
    }

    @Override public JobResult process(Job job)
    {
        ResourceResolver adminResolver = null;
        final String resourcePath = (String) job.getProperty("resourcePath");

        try {
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);

            final String resourceName = resourcePath.substring(resourcePath.lastIndexOf("/") + 1);

            final Resource res = adminResolver.getResource(resourcePath);
            final String mimeType = res.getResourceMetadata().getContentType();
            log.trace(resourcePath + " | mimetype=" + mimeType);
            log.debug("{PHASH Image Observer} " + resourcePath);


            //todo: replace admin session logic
            final Session session = adminResolver.adaptTo(Session.class);


            Node _node = session.getNode(resourcePath);
            try {
                //InputStream is = res.adaptTo(InputStream.class);
                InputStream is = JcrUtils.readFile(_node);

                ImagePHash pHash = new ImagePHash();
                String hash = pHash.getHash(new BufferedInputStream(is));
                _node.setProperty("phash", hash);
            }finally {
                _node.setProperty("dam:phash.date", Calendar.getInstance());
            }

            session.save();


            log.trace("PHASH has been generated for the file {}", resourceName);
            return JobResult.OK;

        }
        catch (Exception ex) {
            //todo log node and swallow
            log.error(resourcePath +" | " +ex.getMessage());
            //log.error(ex.getMessage(), ex);
            if( job instanceof JobImpl ) {
                ((JobImpl) job).setProperty("error", ex.getMessage());
                ((JobImpl) job).setProperty("stacktrace", ex.getStackTrace());
            }
            return JobResult.FAILED;
        }
        finally {
            if (adminResolver != null) {
                adminResolver.close();
            }
        }
    }
}
