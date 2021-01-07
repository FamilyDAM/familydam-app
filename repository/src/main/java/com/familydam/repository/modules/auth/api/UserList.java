package com.familydam.repository.modules.auth.api;

import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.models.User;
import com.familydam.repository.modules.auth.services.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin
@RestController
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

        List<User> users = userListService.listUsers(session, true);
        //System.out.println("Users: " +users.size());
        return users;
    }
}
