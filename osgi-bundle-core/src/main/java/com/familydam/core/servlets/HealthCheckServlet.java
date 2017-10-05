/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.servlets;

import com.familydam.core.apps.IClientApp;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mnimer on 3/16/16.
 */
@SlingServlet(
        paths = {"/api/familydam/v1/core/health"}, metatype = true
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
    BundleContext bundleContext;

    //@Reference(referenceInterface = IClientApp.class)
    //IClientApp[] filesClientApp;


    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
        this.bundleContext = context.getBundleContext();
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }


    @Reference(cardinality= ReferenceCardinality.OPTIONAL_MULTIPLE, bind="bind", unbind="unbind", referenceInterface = IClientApp.class, policy = ReferencePolicy.DYNAMIC)
    List<IClientApp> clientApps = new ArrayList<IClientApp>();

    protected void bind(IClientApp filter){
        if(clientApps == null){
            clientApps = new ArrayList<IClientApp>();
        }
        clientApps.add(filter);
    }

    protected void unbind(IClientApp filter){
        clientApps.remove(filter);
    }


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        try {
            Map info = new HashMap();
            info.put("status", "ok");
            info.put("client.apps", clientApps);

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
