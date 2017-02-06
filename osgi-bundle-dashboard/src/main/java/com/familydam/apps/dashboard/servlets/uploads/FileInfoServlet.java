/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets.uploads;

import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.security.AccessControlException;
import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by mnimer on 3/16/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/upload/info"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.FileInfoServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "FileInfoServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
public class FileInfoServlet extends SlingAllMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        String resourcePath = request.getRequestPathInfo().getResourcePath();

        try {
            String path = request.getParameter("path");

            if (path == null) {
                response.setStatus(404);
                return;
            }

            File _f = new File(path);

            Map info = new HashMap();
            info.put("path", path);
            info.put("visible", _f.exists());
            info.put("isDirectory", _f.isDirectory());
            // pass back any extra properties that were sent
            for (Object s : request.getParameterMap().keySet()) {
                info.put(s, request.getParameter(s.toString()));
            }


            response.setStatus(200);
            response.setContentType("application/text");
            response.getOutputStream().write(new JSONObject(info).toString().getBytes());

        }
        catch ( Exception ex) {
            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }
    }
}
