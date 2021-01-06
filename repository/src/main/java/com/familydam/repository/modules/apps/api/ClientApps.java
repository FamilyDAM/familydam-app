package com.familydam.repository.modules.apps.api;

import com.familydam.repository.modules.apps.services.ClientAppsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class ClientApps {

    Logger log = LoggerFactory.getLogger(ClientApps.class);

    @Autowired
    ClientAppsService clientAppsService;

    @GetMapping(value = {"/api/v1/core/clientapps"})
    @ResponseBody
    public Map listPath(HttpServletRequest request) throws Exception {
        return clientAppsService.getClientApps();
    }

}
