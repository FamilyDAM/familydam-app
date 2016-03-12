/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.familydam.apps.photos.servlets;

import com.familydam.apps.photos.daos.TreeDao;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Map;

/**
 * Hello World Servlet registered by path
 * 
 * Annotations below are short version of:
 * 
 * @Component
 * @Service(Servlet.class)
 * @Properties({
 *     @Property(name="service.description", value="Hello World Path Servlet"),
 *     @Property(name="service.vendor", value="The Apache Software Foundation"),
 *     @Property(name="sling.servlet.paths", value="/hello-world-servlet")
 * })
 */
@SlingServlet(paths="/api/dam:image/list/dates")
@Properties({
    @Property(name="service.description", value="Hello World Path Servlet"),
    @Property(name="service.vendor", value="The Apache Software Foundation")
})
@SuppressWarnings("serial")
public class ListDatesServlet extends SlingSafeMethodsServlet {
    
    private final Logger log = LoggerFactory.getLogger(ListDatesServlet.class);



    @Override
    protected void doGet(SlingHttpServletRequest request,
            SlingHttpServletResponse response) throws ServletException,
            IOException
    {
        Session session = request.getResourceResolver().adaptTo(Session.class);

        try {
            TreeDao treeDao = new TreeDao();
            Map dateTree = treeDao.dateTree(session);



            JSONObject jsonResponse = new JSONObject();
            for (Object key : dateTree.keySet()) {
                jsonResponse.put(key.toString(), dateTree.get(key));
            }

            String results = jsonResponse.toString(2);//JSONObject.valueToString(dateTree);
            response.setContentType("application/json");
            //response.getOutputStream().write(results.getBytes());
            response.getWriter().write(results);

        }catch(RepositoryException|JSONException re){
            log.error(re.getMessage(), re);
            response.setStatus(500);
        }
    }

}

