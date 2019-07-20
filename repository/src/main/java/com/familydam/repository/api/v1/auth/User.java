package com.familydam.repository.api.v1.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class User {

    private String sample = "{\"lastName\":\"nimer\",\"firstName\":\"mike\",\"isFamilyAdmin\":\"true\",\"_isAdmin\":false,\"_isDisabled\":false,\"email\":\"mnimer@gmail.com\",\"username\":\"mike\"}";

    @GetMapping(value = {"/api/v1/auth/{username}"})
    @ResponseBody
    public Map listUssers(HttpServletRequest request, @PathVariable String username) throws Exception {
        Map m = new ObjectMapper().readValue(sample, Map.class);
        return m;
    }
}