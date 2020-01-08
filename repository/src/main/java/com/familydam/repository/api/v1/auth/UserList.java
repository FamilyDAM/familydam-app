package com.familydam.repository.api.v1.auth;

import com.familydam.repository.models.AdminUser;
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

    @Autowired
    Repository repository;

    @Autowired
    UserListService userListService;

    @Autowired
    AdminUser adminUser;

    @GetMapping(value = {"/api/v1/auth/users"})
    @ResponseBody
    public List listUsers(HttpServletRequest request) throws Exception {
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

        List<Map> users = userListService.listUsers(session, true);
        System.out.println("Users: " +users.size());
        return users;
    }
}
