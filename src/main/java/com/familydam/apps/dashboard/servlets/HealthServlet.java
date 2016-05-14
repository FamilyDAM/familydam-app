/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets;

import com.familydam.apps.dashboard.daos.TreeDao;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/health"}, metatype = true
)
public class HealthServlet extends SlingSafeMethodsServlet
{
    @Reference
    private TreeDao treeDao;
    private ObjectMapper objectMapper = new ObjectMapper();


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        Map status = new HashMap();
        status.put("status", "OK");

        response.setStatus(200);
        response.setContentType("application/json");

        String json = objectMapper.writeValueAsString(status);
        response.getOutputStream().write(json.getBytes());

    }
}
