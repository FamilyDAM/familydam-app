package com.familydam.repository.modules.auth;

import com.familydam.repository.Constants;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.models.User;
import com.familydam.repository.modules.auth.services.CreateUserService;
import com.familydam.repository.modules.auth.services.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

import javax.jcr.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin
@Controller
public class AuthAppController {

    UserListService userListService;
    CreateUserService createUserService;
    Repository repository;
    AdminUser adminUser;


    @Autowired
    public AuthAppController(Repository repository, AdminUser adminUser, UserListService userListService, CreateUserService createUserService) {
        this.repository = repository;
        this.adminUser = adminUser;
        this.userListService = userListService;
        this.createUserService = createUserService;
    }


    private String getBackgroundImageUrl(){
        return "https://picsum.photos/1024/1024";
    }


    @GetMapping(path = "/index.html")
    public ModelAndView loginHomePage(Principal principal) {


        ModelAndView mv = new ModelAndView();
        mv.addObject("backgroundImage", getBackgroundImageUrl());

        try {
            Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

            List<User> users = userListService.listUsers(session, true);

            if( users.size() == 0 ){
                mv.setViewName("auth/init");
                return mv;
            }

            mv.addObject("users", users);
            mv.setViewName("auth/index");
            return mv;

        }catch(LoginException ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ex.getMessage());
        }catch(RepositoryException ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }


    @PostMapping(path = "/init.html")
    public ModelAndView initHandler(
        @RequestParam("name") String name,
        @RequestParam("lastName") String lastName,
        @RequestParam("password") String password
    ) {

        //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Session session;
        Session adminSession;

        try {
            //First User
            adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            if (userListService.listUsers(adminSession, true).size() == 0) {
                session = adminSession;
            } else {
                //redirect back to home page /login
                ModelAndView mv = new ModelAndView("redirect:/index.html");
                return mv;
            }



            Map newParams = new HashMap();
            newParams.put(Constants.ID, UUID.randomUUID().toString());
            newParams.put(Constants.NAME, name.trim().toLowerCase());
            newParams.put(Constants.FIRST_NAME, name.trim());
            newParams.put(Constants.LAST_NAME, lastName.trim());
            newParams.put(Constants.PASSWORD, password.trim());//encoder.encode(password));
            newParams.put(Constants.IS_FAMILY_ADMIN, true);

            //todo,  give admin user admin permissions so we can use the logged in user instead of system permission
            createUserService.createUser(session, newParams);

            //redirect back to home page /login
            ModelAndView mv = new ModelAndView("redirect:/index.html");
            return mv;

        }catch (Exception ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }

    }

}
