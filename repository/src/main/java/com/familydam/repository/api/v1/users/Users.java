package com.familydam.repository.api.v1.users;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Controller
public class Users {

    private String sample = "[{\"lastName\":\"nimer\",\"firstName\":\"mike\",\"isFamilyAdmin\":\"true\",\"_isAdmin\":false,\"_isDisabled\":false,\"email\":\"mnimer@gmail.com\",\"username\":\"mike\"}]";

    @GetMapping(value = {"/api/v1/core/users"})
    @ResponseBody
    public List listUssers(HttpServletRequest request) throws Exception {
        ArrayList m = new ObjectMapper().readValue(sample, ArrayList.class);
        return m;
    }
}