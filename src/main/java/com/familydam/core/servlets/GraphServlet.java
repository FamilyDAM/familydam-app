/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.servlets;

import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.OsgiUtil;
import org.osgi.service.component.ComponentContext;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Dictionary;

/**
 * Created by mnimer on 3/12/16.
 */
@SlingServlet(
        metatype = true,
        resourceTypes = {"sling/servlet/default"},
        methods = {"GET"},
        selectors={"graph"},
        extensions={"json"}
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.core.servlets.GraphServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "Default Graph Servlet Description (todo)", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
public class GraphServlet extends SlingAllMethodsServlet
{
    private static final boolean DEFAULT_RENDERER_PROPERTY = true;
    /** Default value for the maximum amount of results that should be returned by the jsonResourceWriter */
    public static final int DEFAULT_LIMIT_RESULTS = 200;


    @Property(intValue=DEFAULT_LIMIT_RESULTS)
    public static final String LIMIT_RESULTS = "json.limitresults";

    private int limitResults;



    @Property(boolValue=DEFAULT_RENDERER_PROPERTY)
    private static final String JSON_RENDERER_PROPERTY = "enable.json";

    private boolean enableJson;



    @Property(boolValue=DEFAULT_RENDERER_PROPERTY)
    private static final String XML_RENDERER_PROPERTY = "enable.xml";

    private boolean enableXml;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.enableJson = OsgiUtil.toBoolean(props.get(JSON_RENDERER_PROPERTY), DEFAULT_RENDERER_PROPERTY);
        this.enableXml = OsgiUtil.toBoolean(props.get(XML_RENDERER_PROPERTY), DEFAULT_RENDERER_PROPERTY);
        this.limitResults = OsgiUtil.toInteger(props.get(LIMIT_RESULTS), DEFAULT_LIMIT_RESULTS);
    }


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        String[] selectors = request.getRequestPathInfo().getSelectors();
        String resourcePath = request.getRequestPathInfo().getResourcePath();
        String extension = request.getRequestPathInfo().getExtension();
        String[] suffix = request.getRequestPathInfo().getSuffix().substring(1).split(",");

        Resource resource = request.getResource();
        int offset = request.getParameter("offset")!=null?new Integer(request.getParameter("offset")):0;
        int limit = request.getParameter("limit")!=null?new Integer(request.getParameter("limit")):this.limitResults;




    }
}
