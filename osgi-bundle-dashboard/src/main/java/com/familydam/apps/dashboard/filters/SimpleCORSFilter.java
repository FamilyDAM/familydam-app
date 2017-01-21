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
package com.familydam.apps.dashboard.filters;


import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingFilter;
import org.apache.felix.scr.annotations.sling.SlingFilterScope;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;
import java.util.Dictionary;

/**
 *Request scoped filter to allow cross origin requests from configured domains by adding appropriate response
 *headers.
 */
@SlingFilter(label = "CORS Request Filter",
        description="CORS Request Filter for allowing cross origin requests from external applications from different domain",
        metatype = true, scope = SlingFilterScope.REQUEST, order = 1000)
public class SimpleCORSFilter implements Filter {

    /** default log. */
    private final Logger LOG = LoggerFactory.getLogger(getClass());


    /** Configuration property to enable CORS requests */
    @Property(boolValue = true,label="Enable CORS?", description="Please check for enabling CORS for the following domains")
    private static final String CORS_ENABLED = "cors.enabled";

    /** Configuration to allow requests from specific domains */
    //@Property(label="Allowed Origins (cross domains)",value = "*", description="Please Enter http://:",unbounded = PropertyUnbounded.ARRAY)
    //private static final String CORS_ALOOWED_ORIGINS = "cors.allowed.origins";

    /* (non-Javadoc)
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.debug("SimpleCORSFilter init() complete");
    }

    /* (non-Javadoc)
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        if (request instanceof SlingHttpServletRequest && response instanceof SlingHttpServletResponse) {

            final SlingHttpServletRequest slingRequest = (SlingHttpServletRequest) request;
            final SlingHttpServletResponse slingResponse = (SlingHttpServletResponse) response;
            String origin = slingRequest.getHeader("Origin");

            if( origin != null && origin.contains("localhost")) {
                slingResponse.setHeader("Access-Control-Allow-Origin", origin);
            }else{
                slingResponse.setHeader("Access-Control-Allow-Origin", "*");
            }
            slingResponse.setHeader("Access-Control-Allow-Credentials", "true");
            slingResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            slingResponse.addHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,X-PINGOTHER,Origin,X-Requested-With");
            //LOG.debug("Set response header for origin {} and flowing through filter chain",origin);

        }

        chain.doFilter(request, response);


    }
    /**
     * Component Activation.
     * @param context component context
     */
    @Activate
    protected void activate(final ComponentContext context) {
        LOG.info("Activating Class {} ", getClass().getName());

        final Dictionary props = context.getProperties();
        //final Object corsenabledProp = props.get(CORS_ENABLED);
        //final String[] corsallowedoriginsProp = PropertiesUtil.toStringArray(props.get(CORS_ALOOWED_ORIGINS));

    }

    /* (non-Javadoc)
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
        LOG.debug("Destroy invoked for class {}", this.getClass().getName());
    }


}
