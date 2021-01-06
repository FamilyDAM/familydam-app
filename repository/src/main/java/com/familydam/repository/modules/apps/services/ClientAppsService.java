package com.familydam.repository.modules.apps.services;

import com.familydam.repository.modules.apps.ClientApp;
import com.familydam.repository.services.IRestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Get a list of all apps/modules registerd in the app
 */
@Service
public class ClientAppsService implements IRestService
{
    //private String sample = "{\"apps\":{\"secondary\":[{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":1,\"slug\":\"user_manager\",\"label\":\"User Manager\",\"path\":\"://usermanager/index.html\",\"roles\":[]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":10,\"slug\":\"repository_browser\",\"label\":\"Repository Browser\",\"path\":\"://bin/browser.html\",\"roles\":[\"family_admin_group\"]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":11,\"slug\":\"system_console\",\"label\":\"System Console\",\"path\":\"://system/console\",\"roles\":[\"family_admin_group\"]}],\"primary\":[{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":0,\"slug\":\"home\",\"label\":\"Home\",\"path\":\"://index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":1,\"slug\":\"files\",\"label\":\"File Browser\",\"path\":\"://files/index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":2,\"slug\":\"photos\",\"label\":\"Photo Gallery\",\"path\":\"://photos/index.html\",\"roles\":[]}]}}";

    List<ClientApp> clientApps = new ArrayList();

    public ClientAppsService() throws IOException {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        Resource[] resources = resolver.getResources("/static/**/*.config.json");
        for (Resource resource : resources) {
            ClientApp app = new ObjectMapper().readValue(resource.getInputStream(), ClientApp.class);
            clientApps.add(app);
        }
    }

    public Map getClientApps() {
        List<ClientApp> primaryApps = clientApps.stream().filter((app) -> app.getPrimary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());
        List<ClientApp> secondaryApps = clientApps.stream().filter((app) -> app.getSecondary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());


        Map info = new HashMap();
        Map apps = new HashMap();
        apps.put("primary", primaryApps);
        apps.put("secondary", secondaryApps);
        info.put("apps", apps);

        return info;
    }
}
