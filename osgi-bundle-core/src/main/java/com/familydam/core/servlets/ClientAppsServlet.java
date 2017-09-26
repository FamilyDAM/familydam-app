package com.familydam.core.servlets;


import com.familydam.core.registry.IClientApp;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@SlingServlet(
        paths = {"/api/familydam/v1/core/clientapps"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.files.HealthCheck", propertyPrivate = false),
        @Property(name = "service.description", value = "Apps File HealthCheck", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class ClientAppsServlet extends SlingSafeMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    ComponentContext context;
    BundleContext bundleContext;

    @Reference(cardinality= ReferenceCardinality.OPTIONAL_MULTIPLE, bind="bind", unbind="unbind", referenceInterface = IClientApp.class, policy = ReferencePolicy.DYNAMIC)
    List<IClientApp> clientApps = new ArrayList<>();

    protected void bind(IClientApp filter){
        if(clientApps == null){
            clientApps = new ArrayList<>();
        }
        clientApps.add(filter);
    }

    protected void unbind(IClientApp filter){
        clientApps.remove(filter);
    }

    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
        this.bundleContext = context.getBundleContext();
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        try {
            List<IClientApp> primaryApps = clientApps.stream().filter((app)->app.getPrimary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());
            List<IClientApp> secondaryApps = clientApps.stream().filter((app)->app.getSecondary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());


            Map info = new HashMap();
            Map apps = new HashMap();
            apps.put("primary", primaryApps);
            apps.put("secondary", secondaryApps);
            info.put("apps", apps);

            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(new ObjectMapper().writeValueAsBytes(info));
        }
        catch ( Exception ex) {
            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }
    }


}
