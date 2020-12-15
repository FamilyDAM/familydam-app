package com.mikenimer.familydam.modules.auth.api;

import com.mikenimer.familydam.exceptions.ForbiddenException;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.repositories.FamilyRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.neo4j.driver.Driver;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@Api(value = "Family API",  description = "Management of Family and Members")
@RequestMapping(value = "/core/api", produces = "application/hal+json")
public class FamilyApi {

    private static final System.Logger LOGGER = System.getLogger(FamilyApi.class.getName());


    private final Driver driver;
    FamilyRepository familyRepository;

    public FamilyApi(Driver driver, FamilyRepository familyRepository) {
        this.driver = driver;
        this.familyRepository = familyRepository;
    }


    @ApiOperation(value = "List all Families", response = Family.class, nickname = "families")
    @GetMapping(path = "/families")
    public CollectionModel<EntityModel<Family>> getFamilies(Principal principal) {
        if( principal == null) throw new ForbiddenException("Not logged in");
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilies(principal)).withSelfRel();

        List<Family> families = familyRepository.findAll();

        List<EntityModel<Family>> familyEntities = families.stream().map(family -> {
            Link userSelfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyById(family.getId(), principal)).withSelfRel();
            Link membersLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyMembers(family.getId(), principal)).withRel("members");
            return EntityModel.of(family, userSelfLink, membersLink);
        }).collect(Collectors.toList());


        return CollectionModel.of(familyEntities, selfLink);
    }


    @PreAuthorize("hasRole('FAMILY_MEMBER')")
    @ApiOperation(value = "Get family by id", response = Family.class, nickname = "family by id")
    @GetMapping(path = "/families/{id}")
    public EntityModel<Family> getFamilyById(@RequestParam String id, Principal principal){
        if( principal == null) throw new ForbiddenException("Not logged in");
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyById(id, principal)).withSelfRel();
        Link membersLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyMembers(id, principal)).withRel("members");

        Optional<Family> family = familyRepository.findById(id);
        if( family.isPresent() ) return EntityModel.of(family.get(), selfLink, membersLink);

        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }
    //todo: Add POST to update family settings



    @PreAuthorize("hasRole('FAMILY_MEMBER')")
    @ApiOperation(value = "Get all users in family", response = Family.class, nickname = "members")
    @GetMapping(path = "/families/{id}/members", produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<Family> getFamilyMembers(@RequestParam  String id, Principal principal){
        if( principal == null) throw new ForbiddenException("Not logged in");
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyById(id, principal)).withSelfRel();
        Link membersLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FamilyApi.class).getFamilyById(id, principal)).withRel("members");

        Optional<Family> family = familyRepository.findById(id);
        if( family.isPresent() ) return EntityModel.of(family.get(), selfLink, membersLink);

        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }
    //todo: Add POST to create user in family
}
