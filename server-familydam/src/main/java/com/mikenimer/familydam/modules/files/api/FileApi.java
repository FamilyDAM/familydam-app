package com.mikenimer.familydam.modules.files.api;

import com.mikenimer.familydam.modules.files.models.File;
import com.mikenimer.familydam.modules.files.repositories.FileRepository;
import io.swagger.annotations.Api;
import org.apache.commons.lang3.NotImplementedException;
import org.neo4j.driver.Driver;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.ws.rs.QueryParam;
import java.util.List;
import java.util.Optional;

@RestController
@Api(value = "File API")
@RequestMapping(value = "/files/api", produces = "application/hal+json")
public class FileApi {

    private static final System.Logger LOGGER = System.getLogger(FileApi.class.getName());

    private final Driver driver;
    FileRepository fileRepository;
    Neo4jTemplate template;

    public FileApi(Driver driver, FileRepository fileRepository, Neo4jTemplate template) {
        this.driver = driver;
        this.fileRepository = fileRepository;
        this.template = template;
    }


    @GetMapping(path = "/")
    public CollectionModel<File> getFilesAndFoldersInFolder(@QueryParam("path") String path) {
        //template.toExecutableQuery(Prepar)
        return null;
    }




    @GetMapping(path = "/folder/{folderId}/files")
    public CollectionModel<File> getFilesInFolder(@PathVariable("folderId") String folderId) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FileApi.class).getFilesInFolder(folderId)).withSelfRel();

        //todo replace with custom match query - MATCH(x:File)-[:IS_CHILD]->(p) WHERE p.id = 'xx' return x
        List<File> files = fileRepository.findAll();

        //todo add hateoas links
        return CollectionModel.of(files, selfLink);
    }



    @PostMapping(path = "/files")
    public void saveFile(RequestBody body) {
        //todo create File and write file to storage locations
        throw new NotImplementedException("Not Implemented Exception");
    }

    @GetMapping(path = "/files/{id}")
    public EntityModel<File> getFolderById(@PathVariable("id") String id) {
        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FileApi.class).getFolderById(id)).withSelfRel();

        Optional<File> file = fileRepository.findById(id);
        if (file.isPresent()) return EntityModel.of(file.get(), selfLink);
        //Not found, 404
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
    }

}
