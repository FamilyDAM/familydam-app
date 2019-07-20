package com.familydam.repository.api.v1.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jcr.Repository;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class ClientApps {

    Logger log = LoggerFactory.getLogger(ClientApps.class);


    @Autowired
    Repository repo;


    private String sample = "{\"apps\":{\"secondary\":[{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":1,\"slug\":\"user_manager\",\"label\":\"User Manager\",\"path\":\"://app-usermanager/index.html\",\"roles\":[]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":10,\"slug\":\"repository_browser\",\"label\":\"Repository Browser\",\"path\":\"://bin/browser.html\",\"roles\":[\"family_admin_group\"]},{\"primary\":false,\"secondary\":true,\"embedded\":false,\"order\":11,\"slug\":\"system_console\",\"label\":\"System Console\",\"path\":\"://system/console\",\"roles\":[\"family_admin_group\"]}],\"primary\":[{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":0,\"slug\":\"home\",\"label\":\"Home\",\"path\":\"://index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":1,\"slug\":\"files\",\"label\":\"File Browser\",\"path\":\"://app-files/index.html\",\"roles\":[]},{\"primary\":true,\"secondary\":false,\"embedded\":false,\"order\":2,\"slug\":\"photos\",\"label\":\"Photo Gallery\",\"path\":\"://app-photos/index.html\",\"roles\":[]}]}}";


    @GetMapping(value = {"/api/v1/core/clientapps"})
    @ResponseBody
    public Map listPath(HttpServletRequest request) throws Exception {

        Map m = new ObjectMapper().readValue(sample, Map.class);
        return m;


//        List<IClientApp> primaryApps = clientApps.stream().filter((app) -> app.getPrimary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());
//        List<IClientApp> secondaryApps = clientApps.stream().filter((app) -> app.getSecondary()).sorted((o1, o2) -> o1.getOrder().compareTo(o2.getOrder())).collect(Collectors.toList());
//
//
//        Map info = new HashMap();
//        Map apps = new HashMap();
//        apps.put("primary", primaryApps);
//        apps.put("secondary", secondaryApps);
//        info.put("apps", apps);
//
//        return info;
    }


}
