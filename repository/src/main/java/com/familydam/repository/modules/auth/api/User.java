package com.familydam.repository.modules.auth.api;

import com.familydam.repository.modules.auth.config.security.JcrAuthToken;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.services.CreateUserService;
import com.familydam.repository.modules.auth.services.GetUserService;
import com.familydam.repository.modules.auth.services.UpdateUserService;
import com.familydam.repository.modules.auth.services.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@RestController
public class User {

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


    @CrossOrigin
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


    /**
     * Create New User
     * @param principal
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping(value={"/api/v1/auth/user", "/api/v1/auth/user/{username}"})
    public ResponseEntity createUser(Principal principal, HttpServletRequest request, @PathVariable(required = false) String username) throws Exception
    {
        Session session;
        Session adminSession;
        if( principal != null ){
            //Check permission of user, needs to be family admin
            session = repository.login(((JcrAuthToken)principal).getCredentials());
            //For the first user we'll use the admin session, for all future users a admin family member has to create the account.
            adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            if(userListService.listUsers(adminSession, true).size() == 0) {
                session = adminSession;
            }
        }else {
            //First User
            adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            if(userListService.listUsers(adminSession, true).size() == 0) {
                session = adminSession;
            }else {
                throw new AccessDeniedException("Invalid Principle");
            }
        }

        Map newParams = new HashMap();
        Map params = request.getParameterMap();
        for (Object key : params.keySet()) {
            if( key.equals("id") ) {
                newParams.put(key, UUID.randomUUID().toString());
            }else{
                newParams.put(key, request.getParameter((String) key));
            }
        }

        Map user;
        try {
            if (username == null) {
                //todo,  give admin user admin permissions so we can use the logged in user instead of system permission
                session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
                user = createUserService.createUser(session, newParams);
            } else {
                user = updateUserService.updateUser(session, username, newParams);
            }
            return ResponseEntity.created(URI.create("/api/v1/auth/user/me")).build();
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }

}