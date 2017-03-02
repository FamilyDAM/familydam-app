/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.servlets.photos;

import com.familydam.apps.photos.daos.TreeDao;
import com.familydam.apps.photos.services.TagIndexGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.jcr.Session;
import javax.jcr.security.AccessControlException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by mnimer on 3/25/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/images/tags"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.TagListServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "TagListServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
public class TagListServlet extends SlingSafeMethodsServlet
{
    @Reference
    private TreeDao treeDao;

    private TagIndexGenerator tagIndexGenerator = new TagIndexGenerator();

    private ObjectMapper objectMapper = new ObjectMapper();


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        String[] selectors = request.getRequestPathInfo().getSelectors();
        String extension = request.getRequestPathInfo().getExtension();
        String resourcePath = request.getRequestPathInfo().getResourcePath();

        Session session = null;
        try {

            session = request.getResourceResolver().adaptTo(Session.class);

            if( !tagIndexGenerator.indexExists(session) )
            {
                tagIndexGenerator.rebuild(session);
            }


            List<Map> tree = treeDao.tagList(session, resourcePath);

            String json = objectMapper.writeValueAsString(tree);


            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(json.getBytes());
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
