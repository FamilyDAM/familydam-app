package com.familydam.repository.modules.auth.api;

import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.models.User;
import com.familydam.repository.modules.auth.services.UserListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity listUsers(Principal principal) throws Exception {
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

        List<User> users = userListService.listUsers(session, true);

        List<EntityModel<User>> userNodes = users.stream().map((u)->{
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserByName(principal, u.getName())).withSelfRel();
            return EntityModel.of(u, selfLink);
        }).collect(Collectors.toList());


        RepresentationModel model = HalModelBuilder
            .emptyHalModel()
            .embed(userNodes)
            .link(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserList.class).listUsers(principal)).withSelfRel())
            .build();
        return ResponseEntity.ok(model);
    }
}
