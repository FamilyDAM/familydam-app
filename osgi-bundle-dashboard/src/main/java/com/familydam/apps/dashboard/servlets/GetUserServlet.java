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
package com.familydam.apps.dashboard.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;

/**
 * Hello World Servlet registered by path
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(paths = {"/api/familydam/v1/dashboard/user"}, metatype = true)
@Properties({
        @Property(name = "service.pid", value = "CreateUserServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CreateUserServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
@SuppressWarnings("serial")
public class GetUserServlet extends SlingAllMethodsServlet {

    private final Logger log = LoggerFactory.getLogger(GetUserServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;
    ComponentContext context;
    BundleContext bundleContext;


    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
        this.bundleContext = context.getBundleContext();
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }


    @Override
    protected void doOptions(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        super.doOptions(request, response);
    }


    /**
     * Local version of system call '/system/userManager/user.tidy.1.json'
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {

        try {
            Session session = request.getResourceResolver().adaptTo(Session.class);

            List<Map> users = getAllUsers(session, false);

            // a brute force path (todo: optimize this in the jcr query)
            boolean foundUser = false;
            for (Map user : users) {
                if( user.get("username").toString().equalsIgnoreCase(request.getParameter("username")) )
                {
                    foundUser = true;
                    response.setStatus(200);
                    response.setContentType("application/json");
                    response.getOutputStream().write(new ObjectMapper().writeValueAsString(user).getBytes());
                    break;
                }
            }

            if( !foundUser ) {
                response.setStatus(404);
            }
        }catch (RepositoryException re){
            log.error(re.getMessage(), re);
            response.setStatus(500);
        }
    }



    private List<Map> getAllUsers(Session session_, boolean returnDisabled) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
            public <T> void build(QueryBuilder<T> builder) {
                builder.setSelector(User.class);
            }
        });

        boolean isFirst = true;

        List<Map> _users = new ArrayList();
        while (users.hasNext()) {
            User u = (User) users.next();
            if (!u.getID().equalsIgnoreCase("admin") &&
                    !u.getID().equalsIgnoreCase("anonymous") &&
                    !u.getPath().startsWith("/home/users/system")) {

                if( !returnDisabled && u.isDisabled() ) continue;

                Map user = new HashMap();
                Iterator<String> names = u.getPropertyNames();
                while(names.hasNext()){
                    String prop = names.next();
                    user.put(prop, u.getProperty(prop)[0].getString());
                }

                user.put("username", u.getID());
                user.put("_isAdmin", u.isAdmin());
                user.put("_isDisabled", u.isDisabled());
                _users.add(user);
            }
        }

        return _users;
    }


}

