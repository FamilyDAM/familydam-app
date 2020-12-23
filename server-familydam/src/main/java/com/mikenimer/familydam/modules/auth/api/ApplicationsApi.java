package com.mikenimer.familydam.modules.auth.api;

import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import org.neo4j.driver.Driver;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/core/api/", produces = "application/hal+json")
public class ApplicationsApi {

    private static final System.Logger Log = System.getLogger(ApplicationsApi.class.getName());


    private final Driver driver;
    ApplicationRepository applicationRepository;

    public ApplicationsApi(Driver driver, ApplicationRepository applicationRepository) {
        this.driver = driver;
        this.applicationRepository = applicationRepository;
    }


    @CrossOrigin
    @GetMapping(path = "/apps", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<Application>> getApplications(Principal principal) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ApplicationsApi.class).getApplications(principal)).withSelfRel();

        List<Application> apps = applicationRepository.findAll();

        List<EntityModel<Application>> appEntities = apps.stream().map(u -> {
            Link appSelfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ApplicationsApi.class).getApplicationById(u.getId(), principal)).withSelfRel();
            return EntityModel.of(u, appSelfLink);
        }).collect(Collectors.toList());

        return CollectionModel.of(appEntities, selfLink);
    }


    @CrossOrigin
    @GetMapping(path = "/apps/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<Application> getApplicationById(@PathVariable String id, Principal principal){
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ApplicationsApi.class).getApplicationById(id, principal)).withSelfRel();

        Optional<Application> application = applicationRepository.findById(id);
        if( application.isPresent() ) {
            return EntityModel.of(application.get(), selfLink);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "application not found");
    }

}
