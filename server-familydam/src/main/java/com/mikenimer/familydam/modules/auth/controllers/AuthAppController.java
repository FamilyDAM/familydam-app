package com.mikenimer.familydam.modules.auth.controllers;

import com.mikenimer.familydam.modules.auth.AuthConstants;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.FamilyRepository;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AuthAppController {
    public AuthAppController() {
        System.out.println("Starting AuthAppController");
    }

    FamilyRepository familyRepository;
    UserRepository userRepository;

    @Autowired
    public AuthAppController(FamilyRepository familyRepository, UserRepository userRepository) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
    }

    private String getBackgroundImageUrl(){
        return "https://picsum.photos/1024/1024";
    }



    @GetMapping(path = "/index.html")
    public ModelAndView loginHomePage() {

        ModelAndView mv = new ModelAndView();

        List<Family> familyList = familyRepository.findAll();
        if (familyList.size() == 0) {
            mv.addObject("backgroundImage", getBackgroundImageUrl());
            mv.setViewName("auth/init");
            return mv;
        }


        List<User> users = userRepository.findAll();
        mv.addObject("users", users);
        mv.addObject("backgroundImage", getBackgroundImageUrl());
        mv.setViewName("auth/index");
        return mv;
    }


    @PostMapping(path = "/init.html")
    public ModelAndView initHandler(
        @RequestParam("name") String name,
        @RequestParam("lastName") String lastName,
        @RequestParam("password") String password
    ) {
        List<Family> familyList = familyRepository.findAll();
        if (familyList.size() > 0) {
            //throw new RuntimeException("Family has already been registered");
            ModelAndView mv = new ModelAndView("redirect:/index.html");
            //mv.addObject("backgroundImage", getBackgroundImageUrl());
            return mv;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


        //first create a new family
        Family family = new Family();
        family.setName(name);
        family = familyRepository.save(family);

        //second, add the first user
        User user = new User();
        user.setName(name);
        user.setLastName(lastName);
        user.setRoles(AuthConstants.ROLE_FAMILY_ADMIN + "," + AuthConstants.ROLE_FAMILY_MEMBER);
        user.setPassword(encoder.encode(password)); //link to family
        userRepository.save(user);


        ModelAndView mv = new ModelAndView("redirect:/index.html");
        mv.addObject("backgroundImage", "https://picsum.photos/1024/1024");
        return mv;
    }

}
