/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.servlets.photos;


import com.familydam.apps.photos.FamilyDAMConstants;
import com.familydam.apps.photos.daos.TreeDao;
import com.familydam.apps.photos.services.DateCreatedIndexGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.security.AccessControlException;
import javax.servlet.ServletException;
import java.io.IOException;

//import org.apache.sling.commons.json.sling.ResourceTraversor;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/images/dates"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.DateTreeServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "DateTreeServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
public class DateTreeServlet extends SlingSafeMethodsServlet
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Reference
    private TreeDao treeDao;

    private DateCreatedIndexGenerator dateIndexGenerator = new DateCreatedIndexGenerator();

    private ObjectMapper objectMapper = new ObjectMapper();



    @Activate
    protected void activate(ComponentContext componentContext) throws Exception {
        this.logger.info("DateTreeServlet");
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        //String[] selectors = request.getRequestPathInfo().getSelectors();
        //String extension = request.getRequestPathInfo().getExtension();
        //String resourcePath = request.getRequestPathInfo().getResourcePath();

        Session session = null;
        try {

            session = request.getResourceResolver().adaptTo(Session.class);

            Node cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);

            Node indexNode;
            if( cacheNode.hasNode(FamilyDAMConstants.INDEXES) ) {
                 indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
            }else{
                cacheNode.addNode(FamilyDAMConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
                indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
            }

            Node dateNode;
            if(  indexNode.hasNode(FamilyDAMConstants.PHOTO_DATES)  ) {
                dateNode = indexNode.getNode(FamilyDAMConstants.PHOTO_DATES);
            } else {
                dateIndexGenerator.rebuild(session);

                if( !indexNode.hasNode(FamilyDAMConstants.PHOTO_DATES) ){
                    indexNode.addNode(FamilyDAMConstants.PHOTO_DATES, JcrConstants.NT_UNSTRUCTURED);
                    session.save();
                }

                dateNode = indexNode.getNode(FamilyDAMConstants.PHOTO_DATES);
            }


            /**
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
             **/


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
