package com.mikenimer.familydam.modules.core.api;

import com.mikenimer.familydam.modules.core.models.User;
import com.mikenimer.familydam.modules.core.repositories.UserRepository;
import org.neo4j.driver.Driver;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/core/api/", produces = "application/hal+json")
public class UserApi {

    private static final System.Logger LOGGER = System.getLogger(UserApi.class.getName());


    private final Driver driver;
    UserRepository userRepository;

    public UserApi(Driver driver, UserRepository userRepository) {
        this.driver = driver;
        this.userRepository = userRepository;
    }


    @GetMapping(path = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<User>> getUsers(@AuthenticationPrincipal Principal principal) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUsers(principal)).withSelfRel();

        List<User> users = userRepository.findAll();

        List<EntityModel<User>> userEntities = users.stream().map(u -> {
            Link userSelfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserById(u.getId(), principal)).withSelfRel();
            return EntityModel.of(u, userSelfLink);
        }).collect(Collectors.toList());

        return CollectionModel.of(userEntities, selfLink);
    }

    @GetMapping(path = "/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<User> getUserById(@PathVariable("id") String id, @AuthenticationPrincipal Principal principal) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserById(id, principal)).withSelfRel();
        Link allUsers = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUsers(principal)).withRel("users");

        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) return EntityModel.of(user.get(), selfLink, allUsers);
        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }


//    @PostMapping(path = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
//    public String createUser() {
//
//        try (Session session = driver.session()) {
//            try(Transaction tx = session.beginTransaction() ) {
//                tx.run()
//            }
//        }
//    }
}
