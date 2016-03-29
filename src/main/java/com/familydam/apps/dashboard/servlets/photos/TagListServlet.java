/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets.photos;

import com.familydam.apps.dashboard.daos.TreeDao;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONArray;

import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        selectors = "tags",
        extensions = "json",
        methods = "GET")
public class TagListServlet extends SlingSafeMethodsServlet
{
    @Reference
    private TreeDao treeDao;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        String[] selectors = request.getRequestPathInfo().getSelectors();
        String extension = request.getRequestPathInfo().getExtension();
        String resourcePath = request.getRequestPathInfo().getResourcePath();

        Session session = null;
        try {

            session = request.getResourceResolver().adaptTo(Session.class);

            List<Map> tree = treeDao.tagList(session, resourcePath);

            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(new JSONArray(tree).toString().getBytes());
        }
        catch (Exception ae) {
            ae.printStackTrace();
            response.setStatus(500);
            response.setContentType("application/json");
        }
        finally {
            if (session != null) {
                session.logout();
            }
        }
    }
}
