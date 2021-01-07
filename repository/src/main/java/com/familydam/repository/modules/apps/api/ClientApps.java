package com.familydam.repository.modules.apps.api;

import com.familydam.repository.modules.apps.models.ClientApp;
import com.familydam.repository.modules.apps.services.ClientAppsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/apps")
public class ClientApps {

    Logger log = LoggerFactory.getLogger(ClientApps.class);

    @Autowired
    ClientAppsService clientAppsService;

    @GetMapping(value = {"/"})
    @ResponseBody
    public ResponseEntity listPath(Principal principal) throws Exception {

        List<ClientApp> apps = clientAppsService.getClientApps();

        //Build up HATEOAS response
        //CREATE 2 different objects types so the _embedded response will be split into 2 keys
        List<EntityModel<ClientApp>> entityApps = apps.stream().map((a)->{
            Link link = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ClientApps.class).getApp(principal, a.getSlug())).withSelfRel();
            return EntityModel.of(a, link);
        }).collect(Collectors.toList());

        //self link
        Link link = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ClientApps.class).listPath(principal)).withSelfRel();

        RepresentationModel result = HalModelBuilder
            .emptyHalModel()
            .embed(entityApps)
            .link(link)
            .build();

        return ResponseEntity.ok(result);
    }


    @ResponseBody
    @GetMapping(value = "/{slug}")
    public ClientApp getApp(Principal principal, @PathVariable String slug){
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not implemented yet");
    }
}
