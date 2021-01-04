package com.mikenimer.familydam.modules.auth.api;

import com.mikenimer.familydam.exceptions.ForbiddenException;
import com.mikenimer.familydam.modules.auth.config.security.AppUserDetails;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.FamilyRepository;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import org.neo4j.driver.Driver;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/core/api/", produces = "application/hal+json")
public class UserApi {

    private static final System.Logger Log = System.getLogger(UserApi.class.getName());


    private final Driver driver;
    FamilyRepository familyRepository;
    UserRepository userRepository;

    public UserApi(Driver driver, UserRepository userRepository, FamilyRepository familyRepository) {
        this.driver = driver;
        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
    }


    @GetMapping(path = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<User>> getUsers(Principal principal) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUsers(principal)).withSelfRel();

        List<User> users = userRepository.findAll();

        List<EntityModel<User>> userEntities = users.stream().map(u -> {
            Link userSelfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserById(u.getId(), principal)).withSelfRel();
            return EntityModel.of(u, userSelfLink);
        }).collect(Collectors.toList());

        return CollectionModel.of(userEntities, selfLink);
    }


    @CrossOrigin
    //@PreAuthorize("hasRole('FAMILY_MEMBER')")
    @GetMapping(path = "/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<User> getUserById(@PathVariable("id") String id, Principal principal) {
        if( principal == null) throw new ForbiddenException("Not logged in");
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserById(id, principal)).withSelfRel();
        Link allUsers = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUsers(principal)).withRel("users");

        User authUser = ((AppUserDetails)(((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();
        Optional<User> user;
        if( id.equalsIgnoreCase("me") ){
            user = userRepository.findById(authUser.getId());
        } else if( id == null || id.equalsIgnoreCase("null") ){
            user = userRepository.findById(authUser.getId());
        } else {
            user = userRepository.findById(id);
        }

        if (user.isPresent()) return EntityModel.of(user.get(), selfLink, allUsers);
        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }

}
