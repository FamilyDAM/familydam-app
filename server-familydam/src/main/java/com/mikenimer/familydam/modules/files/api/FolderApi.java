package com.mikenimer.familydam.modules.files.api;

import com.mikenimer.familydam.modules.auth.api.UserApi;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import com.mikenimer.familydam.modules.files.models.Folder;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import io.swagger.annotations.Api;
import org.neo4j.driver.Driver;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@Api(value = "Folder API")
@RequestMapping(value = "/files/api", produces = "application/hal+json")
public class FolderApi {

    private static final System.Logger LOGGER = System.getLogger(FolderApi.class.getName());

    private final Driver driver;
    FolderRepository folderyRepository;
    UserRepository userRepository;

    public FolderApi(Driver driver, UserRepository userRepository, FolderRepository folderyRepository) {
        this.driver = driver;
        this.userRepository = userRepository;
        this.folderyRepository = folderyRepository;
    }

    @PostMapping(path="/folders")
    public void saveFolder(@AuthenticationPrincipal Principal principal, @RequestBody Map body){
        //User user = userRepository.findById()
        //Folder f = new Folder( (String)body.get("name"), (String)body.get("parent"), user )
    }

    @GetMapping(path = "/folders/{id}")
    public EntityModel<Folder> getFolderById(@PathVariable("id") String id, Principal principal) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserById(id, principal)).withSelfRel();

        Optional<Folder> folder = folderyRepository.findById(id);
        if (folder.isPresent()) return EntityModel.of(folder.get(), selfLink);
        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }


}
