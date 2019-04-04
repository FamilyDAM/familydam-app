/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.processors;

import com.familydam.apps.photos.services.ImageRotationService;
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

import javax.imageio.ImageIO;
import javax.jcr.Node;
import javax.jcr.Session;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Dictionary;


/**
 * Created by mnimer on 3/5/16.
 */
@Component(immediate = true, metatype = true)
@Service(value=JobConsumer.class)
@Property(name="job.topics", value="familydam.image.rotate.job")
public class RotateJobProcessor implements JobConsumer
{
    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    private ImageRotationService rotationService;

    public RotateJobProcessor() {
        System.out.println("here");
    }

    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();
    }

    protected void deactivate(ComponentContext context)
    {
        // TODO: Do something on deactivation
        context.toString();
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

            //todo: replace admin session logic
            final Session session = adminResolver.adaptTo(Session.class);


            Node node = session.getNode(resourcePath);
            BufferedImage image = rotationService.rotateImage(session, node);

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, mimeType.split("/")[1], os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());

            //save image
            JcrUtils.putFile(node, resourceName, mimeType, is);

            session.save();

            log.trace("Rotation has been generated for the file {}", resourceName);
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
