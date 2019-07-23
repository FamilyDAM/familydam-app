package com.familydam.repository.api.v1.auth;

import com.familydam.repository.config.security.JcrAuthToken;
import com.familydam.repository.services.auth.CreateUserService;
import com.familydam.repository.services.auth.GetUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class User {

    private String sample = "{\"lastName\":\"nimer\",\"firstName\":\"mike\",\"isFamilyAdmin\":\"true\",\"_isAdmin\":false,\"_isDisabled\":false,\"email\":\"mnimer@gmail.com\",\"username\":\"admin\"}";

    @Autowired
    Repository repository;

    @Autowired
    CreateUserService createUserService;

    @Autowired
    GetUserService getUserService;


    @PostMapping(value={"/api/v1/auth/user"})
    public Map createUser(Principal principal, HttpServletRequest request) throws Exception
    {
        if( principal == null ){
            throw new AccessDeniedException("NULL Principal");
        }

        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        Map newParams = new HashMap();
        Map params = request.getParameterMap();
        for (Object key : params.keySet()) {
            newParams.put(key, request.getParameter((String)key));
        }

        return createUserService.createUser(session, newParams);
    }



    @GetMapping(value = {"/api/v1/auth/user/me"})
    @ResponseBody
    public Map authenticatedUser(Principal principal, HttpServletRequest request) throws Exception
    {
        if( principal == null ){
            throw new AccessDeniedException("NULL Principal");
        }

        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        return getUserService.getUser(session, (String)((JcrAuthToken) principal).getPrincipal() );
    }


}