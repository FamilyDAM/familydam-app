/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets.filemanager;

import com.familydam.apps.dashboard.helpers.NodeMapper;
import com.familydam.apps.dashboard.models.INode;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by mnimer on 3/11/16.

@SlingServlet(
        paths = {"/familydam/api/v1/filemanager"}
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.filemanager.GetFileListServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CreateUserServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
 */
public class GetFileListServlet extends SlingAllMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    protected void doGet(
            SlingHttpServletRequest request,
            SlingHttpServletResponse response,
            String path
    ) throws ServletException, IOException
    {
        Session session = null;
        try {
            session = request.getResourceResolver().adaptTo(Session.class);

            Node contentRoot = session.getNode(path);


            Iterable<Node> _childNodes = JcrUtils.getChildNodes(contentRoot);
            List<INode> childNodes = new ArrayList<>();

            for (Node node : _childNodes) {
                if( node.getPrimaryNodeType().getName().equals(JcrConstants.NT_FOLDER)
                        || node.getPrimaryNodeType().getName().equals(JcrConstants.NT_FILE) ) {
                    childNodes.add(NodeMapper.map(node));
                }
            }

            Collections.sort(childNodes, new Comparator<INode>()
            {
                public int compare(INode o1, INode o2)
                {
                    if( o1.getOrder() < o2.getOrder()){
                        return -1;
                    }else if( o1.getOrder() > o2.getOrder()){
                        return 1;
                    }else{
                        return ( o1.getName().toString().compareToIgnoreCase( o2.getName().toString() ));
                    }
                }
            });


            response.getOutputStream().write(new JSONArray(childNodes).getJSONArray(0).toString().getBytes());
            response.setStatus(200);
        }
        catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }
        finally {
            if (session != null) {
                session.logout();
            }
        }
    }
}
