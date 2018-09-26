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

    /**
     * Component Activation.
     * @param context component context
     */
    @Activate
    protected void activate(final ComponentContext context) {
        LOG.info("Activating Class {} ", getClass().getName());
    }

    /* (non-Javadoc)
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
        LOG.debug("Destroy invoked for class {}", this.getClass().getName());
    }


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

        final SlingHttpServletRequest slingRequest = (SlingHttpServletRequest) request;
        final SlingHttpServletResponse slingResponse = (SlingHttpServletResponse) response;

        String _origin = slingRequest.getHeader("Origin");
        slingResponse.addHeader("Access-Control-Allow-Origin", _origin);
        slingResponse.addHeader("Access-Control-Allow-Credentials", "true");
        slingResponse.addHeader("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (slingRequest.getHeader("Access-Control-Request-Method") != null && "OPTIONS".equals(slingRequest.getMethod()))
        {
            slingResponse.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
            slingResponse.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            slingResponse.addHeader("Access-Control-Max-Age", "3600");

        } else {
            chain.doFilter(request, response);
        }


    }

}
