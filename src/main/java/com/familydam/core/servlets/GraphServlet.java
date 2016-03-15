/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.servlets;

import com.familydam.core.helpers.TreeWalker;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceNotFoundException;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.OsgiUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;

import static com.familydam.core.FamilyDAMCoreConstants.HATEAOS_CONTENTTYPE;
import static com.familydam.core.FamilyDAMCoreConstants.HATEAOS_EMBEDDED;
import static com.familydam.core.FamilyDAMCoreConstants.HATEAOS_LINKS;

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
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    String[] defaultTypes = "nt:folder,nt:file".split(",");
    String[] defaultSuffix = "name,path,index,parent,jcr:primaryType,jcr:created".split(",");


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


    private Map<String, Servlet> rendererMap = new HashMap<String, Servlet>();



    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.enableJson = OsgiUtil.toBoolean(props.get(JSON_RENDERER_PROPERTY), DEFAULT_RENDERER_PROPERTY);
        this.enableXml = OsgiUtil.toBoolean(props.get(XML_RENDERER_PROPERTY), DEFAULT_RENDERER_PROPERTY);
        this.limitResults = OsgiUtil.toInteger(props.get(LIMIT_RESULTS), DEFAULT_LIMIT_RESULTS);
    }



    @Override
    public void init() throws ServletException
    {
        super.init();

    }


        @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        String[] selectors = request.getRequestPathInfo().getSelectors();
        String resourcePath = request.getRequestPathInfo().getResourcePath();
        String extension = request.getRequestPathInfo().getExtension();


        String[] suffixTypes = defaultTypes;
        String[] suffixProps = defaultSuffix;
        if( request.getRequestPathInfo().getSuffix() != null ) {
            String[] suffixSegments = request.getRequestPathInfo().getSuffix().substring(1).split("/");
            if (suffixSegments[0].trim().length() > 0) {
                suffixTypes = suffixSegments[0].split(",");
            }
            if (suffixSegments.length > 1 && suffixSegments[1].trim().length() > 0) {
                suffixProps = suffixSegments[1].split(",");
            }
        }


        Resource resource = request.getResource();
        int _depth = Integer.MAX_VALUE;
        if( selectors.length > 1 ){
            for (String selector : selectors) {
                try{
                    _depth = new Integer(selector);
                    if( _depth == -1 ){
                        _depth = Integer.MAX_VALUE;
                    }
                    break;
                }catch(Exception ex){}
            }

        }
        int offset = request.getParameter("offset")!=null?new Integer(request.getParameter("offset")):0;
        int limit = request.getParameter("limit")!=null?new Integer(request.getParameter("limit")):this.limitResults;


        // cannot handle the request for missing resources
        if (ResourceUtil.isNonExistingResource(request.getResource())) {
            throw new ResourceNotFoundException(
                    request.getResource().getPath(), "No resource found");
        }


        TreeWalker treeWalker = new TreeWalker( resource, _depth, suffixTypes, suffixProps );
        Map _modifiedNode = treeWalker.walkTree();



        // Build the HATEAOS response
        HashMap rootLinks = new HashMap();
        HashMap _selfLink = new HashMap();
        _selfLink.put("href", request.getRequestPathInfo().getResourcePath());
        rootLinks.put("self", _selfLink);

        HashMap results = new HashMap();
        results.put(HATEAOS_LINKS, rootLinks);
        results.put(HATEAOS_EMBEDDED, _modifiedNode);



        // Serialize the response
        response.setStatus(200);
        response.setContentType(HATEAOS_CONTENTTYPE);

        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder = gsonBuilder.setPrettyPrinting();
        Gson gson = gsonBuilder.create();
        String jsonOutput = gson.toJson(results);
        response.getOutputStream().write(jsonOutput.getBytes());

    }




    @Override
    public void destroy() {

        for (Servlet servlet : rendererMap.values()) {
            try {
                servlet.destroy();
            } catch (Throwable t) {
                log.error("Error while destroying servlet " + servlet, t);
            }
        }

        rendererMap.clear();

        super.destroy();
    }

}
