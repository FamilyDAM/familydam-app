/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.files.servlets;

import com.familydam.core.registry.IClientApp;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;

/**
 * Created by mnimer on 3/16/16.
 */
@SlingServlet(
        paths = {"/api/familydam/cloudfiles/v1/health"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.files.HealthCheck", propertyPrivate = false),
        @Property(name = "service.description", value = "Apps File HealthCheck", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class HealthCheckServlet extends SlingSafeMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    ComponentContext context;

    @Reference(referenceInterface = IClientApp.class)
    IClientApp clientApp;


    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }



    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        try {
            Map info = new HashMap();
            info.put("status", "ok");
            info.put("client.apps", Arrays.asList(clientApp));

            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(new ObjectMapper().writeValueAsBytes(info));
        }
        catch ( Exception ex) {
            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }
    }

}
