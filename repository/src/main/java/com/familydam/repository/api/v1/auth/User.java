package com.familydam.repository.api.v1.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.Map;

@Controller
public class User {

    private String sample = "{\"lastName\":\"nimer\",\"firstName\":\"mike\",\"isFamilyAdmin\":\"true\",\"_isAdmin\":false,\"_isDisabled\":false,\"email\":\"mnimer@gmail.com\",\"username\":\"admin\"}";

    @GetMapping(value = {"/api/v1/auth/user/me"})
    @ResponseBody
    public Map authenticatedUser(Principal principal, HttpServletRequest request) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if( principal == null ){
            throw new AccessDeniedException("NULL Principal");
        }

            Map m = new ObjectMapper().readValue(sample, Map.class);
        return m;
    }

}