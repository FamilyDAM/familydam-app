package com.familydam.repository.modules.auth;

import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.services.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

import javax.jcr.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@CrossOrigin
@Controller
public class AuthAppController {

    UserListService userListService;
    Repository repository;
    AdminUser adminUser;


    @Autowired
    public AuthAppController(Repository repository, AdminUser adminUser, UserListService userListService) {
        this.repository = repository;
        this.adminUser = adminUser;
        this.userListService = userListService;
    }


    private String getBackgroundImageUrl(){
        return "https://picsum.photos/1024/1024";
    }


    @GetMapping(path = "/index.html")
    public ModelAndView loginHomePage(Principal principal) {


        ModelAndView mv = new ModelAndView();
        try {
            Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

            List<Map> users = userListService.listUsers(session, true);

            mv.addObject("users", users);
            mv.addObject("backgroundImage", getBackgroundImageUrl());
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

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//        //first create a new family
//        Family family = new Family();
//        family.setName(lastName);
//        family = familyRepository.save(family);
//
//        //second, add the first user
//        User user = new User();
//        user.setName(name);
//        user.setLastName(lastName);
//        user.setRoles(AuthConstants.ROLE_FAMILY_ADMIN + "," + AuthConstants.ROLE_FAMILY_MEMBER);
//        user.setPassword(encoder.encode(password)); //link to family
//        user.setFamily(family);
//        userRepository.save(user);
//
//
//        //Create nodes for installed applications
//        for (IApplicationConfig config : applicationConfigs) {
//            Application a = config.getAppNode();
//            a.setFamily(family);
//            applicationRepository.save(a);
//        }


        ModelAndView mv = new ModelAndView("redirect:/index.html");
        mv.addObject("backgroundImage", "https://picsum.photos/1024/1024");
        return mv;
    }

}
