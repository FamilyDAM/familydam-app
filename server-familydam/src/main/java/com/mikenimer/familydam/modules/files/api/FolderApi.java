package com.mikenimer.familydam.modules.files.api;

import com.mikenimer.familydam.modules.auth.config.security.AppUserDetails;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import com.mikenimer.familydam.modules.files.models.CreateFolderRequest;
import com.mikenimer.familydam.modules.files.models.Folder;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import io.swagger.annotations.Api;
import org.neo4j.driver.Driver;
import org.neo4j.driver.types.MapAccessor;
import org.neo4j.driver.types.TypeSystem;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.PreparedQuery;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

@RestController
@Api(value = "Folder API")
@RequestMapping(value = "/files/api", produces = "application/hal+json")
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

        Folder folder = new Folder();
        folder.setName( body.getName() );
        folder.setCreatedBy( user.get() );
        folder.setApplication(application.get());
        if( parentfolder.isPresent() ){
            folder.setParent(parentfolder.get());
        }

        Folder f = folderyRepository.save(folder);
        return EntityModel.of(f);
    }


    /**
     * Get list of all Root level folders (no parents)
     * @param principal
     * @return
     */
    @GetMapping(path="/folders", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<Folder>> getRootFolders(Principal principal){
        try {
            User authUser = ((AppUserDetails) (((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();


            //root folders
            PreparedQuery<Folder> query = PreparedQuery.queryFor(Folder.class)
                .withCypherQuery("MATCH (a:Application)-[:IN_APP]->(f:Folder)-[:CREATED_BY]->(u:User) where a.slug = 'files' and u.id=$userId return f ORDER BY f.name")
                .withParameters(Map.of("userId", authUser.getId()))
                .usingMappingFunction(new FolderMapper())
                .build();
            List<Folder> folders = neo4jTemplate.toExecutableQuery(query).getResults();

            //decorate
            List<EntityModel<Folder>> folderEntities = folders.stream().map(f -> {
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

        //child folders
        Optional<Folder> folders = neo4jTemplate.toExecutableQuery(
            PreparedQuery.queryFor(Folder.class)
                .withCypherQuery("match (f{id:$folderId}) return f ORDER BY f.name")
                .withParameters(Map.of("folderId", folderId))
                .usingMappingFunction(new FolderMapper())
                .build()
        ).getSingleResult();

        if( !folders.isPresent() ){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found");
        }

        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(folderId, principal)).withSelfRel();
        Link childrenLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolderChildren( folders.get().getId(), principal)).withRel("children");
        return EntityModel.of(folders.get(), selfLink, childrenLink);
    }


    /**
     * Get all Child Folders under this folder.
     * @param folderId
     * @param principal
     * @return
     */
    @GetMapping(path="/folders/{folderId}/children", produces = MediaType.APPLICATION_JSON_VALUE)
    public CollectionModel<EntityModel<Folder>> getFolderChildren(@PathVariable("folderId") String folderId, Principal principal){
        User authUser = ((AppUserDetails)(((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

        //child folders
        List<Folder> folders = neo4jTemplate.toExecutableQuery(
            PreparedQuery.queryFor(Folder.class)
                .withCypherQuery("MATCH (fParent{id:$folderId})-[:IS_CHILD]->(f:Folder)-[:CREATED_BY]->(u:User) where u.id=$userId return f ORDER BY f.name")
                .withParameters(Map.of("folderId", folderId, "userId", authUser.getId()))
                .usingMappingFunction(new FolderMapper())
                .build()
        ).getResults();


        //decorate
        List<EntityModel<Folder>> folderEntities = folders.stream().map(f -> {
            Link sLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(f.getId(), principal)).withSelfRel();
            return EntityModel.of(f, sLink);
        }).collect(Collectors.toList());

        //Hateoas links
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FolderApi.class).getFolder(folderId, principal)).withSelfRel();
        return CollectionModel.of(folderEntities, selfLink);
    }


    /**
     * Map Neo4J node into a Folder
     */
    private class FolderMapper implements BiFunction<TypeSystem, MapAccessor, Folder>{
        @Override
        public Folder apply(TypeSystem typeSystem, MapAccessor mapAccessor) {
            Date createdDate = null;
            Date modifiedDate = null;
            try {
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                createdDate = df.parse(mapAccessor.get("f").get("createdDate").asString());
                modifiedDate = df.parse(mapAccessor.get("f").get("lastModifiedDate").asString());
            }catch(ParseException ex){
                Log.log(System.Logger.Level.WARNING, "Unable to parse '{}' or '{}'", mapAccessor.get("f").get("createdDate").asString(), mapAccessor.get("f").get("lastModifiedDate").asString());
            }

            return Folder.builder()
                .id(mapAccessor.get("f").get("id").asString())
                .name(mapAccessor.get("f").get("name").asString())
                .slug(mapAccessor.get("f").get("slug").asString())
                .createdDate(createdDate)
                .lastModifiedDate(modifiedDate)
                .build();
        }
    }

}
