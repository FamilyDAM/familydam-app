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
package com.familydam.apps.dashboard.servlets.users;

import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Hello World Servlet registered by path
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(paths = {"/api/familydam/files/v1/auth/ping"}, metatype = true)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.CheckAuthServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CheckAuthServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
@SuppressWarnings("serial")
public class CheckAuthServlet extends SlingAllMethodsServlet
{

    private final Logger log = LoggerFactory.getLogger(CheckAuthServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        try {
            Session session = request.getResourceResolver().adaptTo(Session.class);
            ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session adminSession = (JackrabbitSession) adminResolver.adaptTo(Session.class);

            if ( session.getUserID().equalsIgnoreCase("anonymous") ) {
                response.setStatus(401);
            }
            response.getOutputStream().write(session.getUserID().getBytes());
        }catch(Exception ex){

        }
    }


}

