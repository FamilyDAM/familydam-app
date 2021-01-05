package com.mikenimer.familydam.modules.files.api;

import com.mikenimer.familydam.modules.auth.config.security.AppUserDetails;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import com.mikenimer.familydam.modules.files.models.Folder;
import com.mikenimer.familydam.modules.files.models.FolderProj;
import com.mikenimer.familydam.modules.files.models.requests.CreateFolderRequest;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import org.neo4j.driver.Driver;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//@RestController
//@Api(value = "Folder API")
//@RequestMapping(value = "/files/api", produces = "application/hal+json")
public class FolderApi {

    private static final System.Logger Log = System.getLogger(FolderApi.class.getName());

    private final Driver driver;
    FolderRepository folderyRepository;
    UserRepository userRepository;
    ApplicationRepository applicationRepository;
    Neo4jTemplate neo4jTemplate;


    public FolderApi(Driver driver, Neo4jTemplate neo4jTemplate, UserRepository userRepository, FolderRepository folderyRepository, ApplicationRepository applicationRepository) {
        this.driver = driver;
        this.neo4jTemplate = neo4jTemplate;
        this.userRepository = userRepository;
        this.folderyRepository = folderyRepository;
        this.applicationRepository = applicationRepository;
    }


    /**
     * Create new Folder
     * @param principal
     * @param body
     */
    @PostMapping(path="/folders", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<Folder> createFolder(Principal principal, @RequestBody CreateFolderRequest body){

        User authUser = ((AppUserDetails)(((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();
        Optional<User> user = userRepository.findById(authUser.getId());
        Family family = user.get().getFamily();

        Optional<Application> application = applicationRepository.findBySlug("files");
        if( !application.isPresent() ){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }

        Optional<Folder> parentfolder = Optional.empty();
        if( body.getParentId() != null ){
            parentfolder = folderyRepository.findById(body.getParentId());
        }

        Folder folder = Folder.builder()
            .withName(body.getName())
            .withCreatedBy(user.get())
            .withApplication(application.get())
            .withParent(parentfolder.isPresent()?parentfolder.get():null)
            .build();

        Folder f = folderyRepository.save(folder);
        return EntityModel.of(f);
    }




    /**
     * Get list of all Root level folders (no parents)
     * @param principal
     * @return
     */
    @GetMapping(path="/folders", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<FolderProj>> getRootFolders(Principal principal){
        try {
            User authUser = ((AppUserDetails) (((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

            //query
            List<FolderProj> folders = folderyRepository.findRootFoldersByUserId(authUser.getId());

            //decorate entries
            List<EntityModel<FolderProj>> folderEntities = folders.stream().map(f -> {
                Link sLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(f.getId(), principal)).withSelfRel();
                Link childrenLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolderChildren(f.getId(), principal)).withRel("children");
                return EntityModel.of(f, sLink, childrenLink);
            }).collect(Collectors.toList());


            //Hateoas links
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getRootFolders(principal)).withSelfRel();
            return CollectionModel.of(folderEntities, selfLink);
        }catch (Exception ex){
            ex.printStackTrace();
        }

        return null;
    }




    /**
     * Get single folder
     * @param folderId
     * @param principal
     * @return
     */
    @GetMapping(path="/folders/{folderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EntityModel<Folder> getFolder(@PathVariable("folderId") String folderId, Principal principal){
        User authUser = ((AppUserDetails)(((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

        Optional<Folder> folder = folderyRepository.findByIdAndUserId(folderId, authUser.getId());

        if( !folder.isPresent() ){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found");
        }

        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(folderId, principal)).withSelfRel();
        Link childrenLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolderChildren( folder.get().getId(), principal)).withRel("children");
        return EntityModel.of(folder.get(), selfLink, childrenLink);
    }


    /**
     * Get all Child Folders under this folder.
     * @param folderId
     * @param principal
     * @return
     */
    @GetMapping(path="/folders/{folderId}/children", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<FolderProj>> getFolderChildren(@PathVariable("folderId") String folderId, Principal principal){
        User authUser = ((AppUserDetails)(((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

        //child folders
        List<FolderProj> folders = folderyRepository.findByParentIdAndUserId(folderId, authUser.getId());

        //decorate
        List<EntityModel<FolderProj>> folderEntities = folders.stream().map(f -> {
            Link sLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(f.getId(), principal)).withSelfRel();
            Link childrenLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolderChildren( f.getId(), principal)).withRel("children");
            return EntityModel.of(f, sLink, childrenLink);
        }).collect(Collectors.toList());

        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(folderId, principal)).withSelfRel();
        return CollectionModel.of(folderEntities, selfLink);
    }


}
