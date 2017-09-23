/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        paths = {"/api/familydam/v1/dashboard/health"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.HealthCheck", propertyPrivate = false),
        @Property(name = "service.description", value = "Dashboard HealthCheck", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class HealthServlet extends SlingSafeMethodsServlet
{
    public final Logger log = LoggerFactory.getLogger(HealthServlet.class);

    private ObjectMapper objectMapper = new ObjectMapper();


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        log.info("IN PING SERVLET");

        Map status = new HashMap();
        status.put("status", "OK");

        response.setStatus(200);
        response.setContentType("application/json");

        String json = objectMapper.writeValueAsString(status);
        response.getOutputStream().write(json.getBytes());

    }
}
