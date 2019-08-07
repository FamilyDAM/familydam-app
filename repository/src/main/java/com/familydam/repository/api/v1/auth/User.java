package com.familydam.repository.api.v1.auth;

import com.familydam.repository.Constants;
import com.familydam.repository.config.security.JcrAuthToken;
import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.auth.CreateUserService;
import com.familydam.repository.services.auth.GetUserService;
import com.familydam.repository.services.auth.UpdateUserService;
import com.familydam.repository.services.auth.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
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

    @Autowired
    UpdateUserService updateUserService;

    @Autowired
    UserListService userListService;

    @Autowired
    AdminUser adminUser;


    @PostMapping(value={"/api/v1/auth/user"})
    public ResponseEntity createUser(Principal principal, HttpServletRequest request) throws Exception
    {
        Session session;
        if( principal == null ){
            //For the first user we'll use the admin session, for all future users a admin family member has to create the account.
            Session adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            if(userListService.listUsers(adminSession, true).size() == 0) {
                session = adminSession;
            }else {
                throw new AccessDeniedException("Invalid Principle");
            }
        }else {
            session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        }

        Map newParams = new HashMap();
        Map params = request.getParameterMap();
        for (Object key : params.keySet()) {
            newParams.put(key, request.getParameter((String)key));
        }

        Map user = createUserService.createUser(session, newParams);
        return ResponseEntity.created(URI.create("/api/v1/auth/user/me")).build();
    }



    @PostMapping(value = {"/api/v1/auth/user/{username}"})
    @ResponseBody
    public ResponseEntity updateUser(Principal principal, HttpServletRequest request, @PathVariable String username) throws Exception
    {
        if( principal == null ){
            return ResponseEntity.status(401).build();
        }

        Map user = new HashMap();
        user.put(Constants.FIRST_NAME, request.getParameter("firstName"));
        user.put(Constants.LAST_NAME, request.getParameter("lastName"));
        user.put(Constants.EMAIL, request.getParameter("email"));
        user.put(Constants.IS_FAMILY_ADMIN, true);

        //todo add logic to use user permission
        //Session session = repository.login( ((JcrAuthToken)principal).getCredentials() );
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        user = updateUserService.updateUser(session, username, user);
        if( user == null ){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }


    @GetMapping(value = {"/api/v1/auth/user/me"})
    @ResponseBody
    public ResponseEntity authenticatedUser(Principal principal) throws Exception
    {
        if( principal == null ){
            return ResponseEntity.status(401).build();
        }

        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        Map user = getUserService.getUser(session, (String)((JcrAuthToken) principal).getPrincipal() );
        if( user == null ){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }



    @GetMapping(value = {"/api/v1/auth/user/{username}"})
    @ResponseBody
    public ResponseEntity authenticatedUser(Principal principal, @PathVariable String username) throws Exception
    {
        if( principal == null ){
            return ResponseEntity.status(401).build();
        }

        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        Map user = getUserService.getUser(session,  username );
        if( user == null ){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }


}