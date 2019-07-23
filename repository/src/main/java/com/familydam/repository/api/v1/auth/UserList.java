package com.familydam.repository.api.v1.auth;

import com.familydam.repository.services.auth.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
public class UserList {

    private String sample = "[{\"lastName\":\"nimer\",\"firstName\":\"mike\",\"isFamilyAdmin\":\"true\",\"_isAdmin\":false,\"_isDisabled\":false,\"email\":\"mnimer@gmail.com\",\"username\":\"admin\"}]";

    @Autowired
    Repository repository;

    @Autowired
    UserListService userListService;

    @GetMapping(value = {"/api/v1/auth/users"})
    @ResponseBody
    public List listUsers(HttpServletRequest request) throws Exception {

        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));

        List<Map> users = userListService.listUsers(session, false);
        return users;
    }
}