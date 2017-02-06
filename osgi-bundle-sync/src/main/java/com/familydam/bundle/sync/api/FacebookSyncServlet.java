package com.familydam.bundle.sync.api;

import com.familydam.apps.dashboard.servlets.HealthServlet;
import com.familydam.bundle.sync.services.facebook.FacebookSyncService;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by mike on 2/5/17.
 */
/**
@SlingServlet(
        paths = {"/bin/familydam/api/v1/sync/facebook"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "Trigger Facebook Sync", propertyPrivate = false),
        @Property(name = "service.description", value = "Facebook Sync all user", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
**/
public class FacebookSyncServlet extends SlingSafeMethodsServlet
{
    public final Logger log = LoggerFactory.getLogger(HealthServlet.class);

    @Reference
    FacebookSyncService facebookSyncService;



    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();
    }


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        log.info("Facebook Sync");


        // Sync user posts
        facebookSyncService.syncUserPosts();
    }
}

