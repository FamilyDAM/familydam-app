/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.servlets.photos;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import com.familydam.apps.photos.daos.TreeDao;
import com.familydam.apps.photos.services.DateCreatedIndexGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.commons.json.sling.ResourceTraversor;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.security.AccessControlException;
import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/images/dates"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.DateTreeServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "DateTreeServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class DateTreeServlet extends SlingSafeMethodsServlet
{
    @Reference
    private TreeDao treeDao;

    private DateCreatedIndexGenerator dateIndexGenerator = new DateCreatedIndexGenerator();

    private ObjectMapper objectMapper = new ObjectMapper();


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        //String[] selectors = request.getRequestPathInfo().getSelectors();
        //String extension = request.getRequestPathInfo().getExtension();
        //String resourcePath = request.getRequestPathInfo().getResourcePath();

        Session session = null;
        try {

            session = request.getResourceResolver().adaptTo(Session.class);

            Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);

            Node indexNode;
            if( cacheNode.hasNode(FamilyDAMDashboardConstants.INDEXES) ) {
                 indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
            }else{
                cacheNode.addNode(FamilyDAMDashboardConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
                indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
            }

            Node dateNode;
            if(  indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_DATES)  ) {
                dateNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);
            } else {
                dateIndexGenerator.rebuild(session);

                dateNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);
            }


            ResourceTraversor traversor = null;
            try {

                Resource dateResource = request.getResourceResolver().getResource(dateNode.getPath());
                traversor = new ResourceTraversor(3, Long.MAX_VALUE, dateResource, false);
                traversor.collectResources();
                JSONObject jsonObject = traversor.getJSONObject();

                response.setStatus(200);
                response.setContentType("application/json");
                response.getOutputStream().write(jsonObject.toString().getBytes());

            } catch (final JSONException e) {
                log(e.getMessage(), e);
                response.setStatus(500);
                response.setContentType("text/plain");
                response.getOutputStream().write(e.getMessage().getBytes());
            }


        }
        catch (AccessControlException ex){
            response.setStatus(403);
            return;
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
