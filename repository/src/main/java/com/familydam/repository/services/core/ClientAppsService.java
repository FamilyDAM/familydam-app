package com.familydam.repository.services.core;

import com.familydam.repository.config.apps.IClientApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ClientAppsService {

    private String sample = "{\"apps\":{\"secondary\":[{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":1,\"slug\":\"user_manager\",\"label\":\"User Manager\",\"path\":\"://usermanager/index.html\",\"roles\":[]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":10,\"slug\":\"repository_browser\",\"label\":\"Repository Browser\",\"path\":\"://bin/browser.html\",\"roles\":[\"family_admin_group\"]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":11,\"slug\":\"system_console\",\"label\":\"System Console\",\"path\":\"://system/console\",\"roles\":[\"family_admin_group\"]}],\"primary\":[{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":0,\"slug\":\"home\",\"label\":\"Home\",\"path\":\"://index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":1,\"slug\":\"files\",\"label\":\"File Browser\",\"path\":\"://files/index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":2,\"slug\":\"photos\",\"label\":\"Photo Gallery\",\"path\":\"://photos/index.html\",\"roles\":[]}]}}";


    @Autowired
    List<IClientApp> clientApps;


    public Map getClientApps(){
        List<IClientApp> primaryApps = clientApps.stream().filter((app) -> app.getPrimary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());
        List<IClientApp> secondaryApps = clientApps.stream().filter((app) -> app.getSecondary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());


        Map info = new HashMap();
        Map apps = new HashMap();
        apps.put("primary", primaryApps);
        apps.put("secondary", secondaryApps);
        info.put("apps", apps);

        return info;
    }
}
