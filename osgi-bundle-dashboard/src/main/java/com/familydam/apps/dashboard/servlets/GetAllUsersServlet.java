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

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import com.familydam.core.FamilyDAMCoreConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.*;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.BooleanValue;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.security.AccessControlException;
import javax.jcr.security.Privilege;
import javax.servlet.ServletException;
import java.io.IOException;
import java.security.Principal;
import java.util.*;

/**
 * Hello World Servlet registered by path
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(paths = {"/api/familydam/v1/dashboard/users"}, metatype = true)
@Properties({
        @Property(name = "service.pid", value = "CreateUserServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CreateUserServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
@SuppressWarnings("serial")
public class GetAllUsersServlet extends SlingAllMethodsServlet {

    private final Logger log = LoggerFactory.getLogger(GetAllUsersServlet.class);

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

            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(new ObjectMapper().writeValueAsString(users).getBytes());
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

                _users.add(user);
            }
        }

        return _users;
    }


}

