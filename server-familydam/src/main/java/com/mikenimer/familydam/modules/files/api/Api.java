package com.mikenimer.familydam.modules.files.api;

import com.mikenimer.familydam.modules.auth.config.security.AppUserDetails;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.files.models.File;
import com.mikenimer.familydam.modules.files.models.Folder;
import com.mikenimer.familydam.modules.files.models.FolderProj;
import com.mikenimer.familydam.modules.files.repositories.FileRepository;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@io.swagger.annotations.Api(value = "File API")
@RequestMapping(value = "/files/api")
public class Api {

    EntityLinks entityLinks;
    ApplicationRepository applicationRepository;
    FolderRepository folderRepository;
    FileRepository fileRepository;

    public Api(EntityLinks entityLinks, ApplicationRepository applicationRepository, FolderRepository folderRepository, FileRepository fileRepository) {
        this.entityLinks = entityLinks;
        this.applicationRepository = applicationRepository;
        this.folderRepository = folderRepository;
        this.fileRepository = fileRepository;
    }


    @GetMapping(path = { "/" })
    public CollectionModel<EntityModel> getRootFilesAndFolders(Principal principal) {
        try {
            User authUser = ((AppUserDetails) (((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

            Optional<Application> application = applicationRepository.findBySlug("files");
            if (!application.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application 'Files' not found");
            }

            //query
            var folders = decorateFolders(folderRepository.findRootFoldersByUserId(authUser.getId()));
            var files = decorateFiles(fileRepository.findRootFilesByUserId(authUser.getId()));

            List<EntityModel> results = new ArrayList<>();
            results.addAll(folders);
            results.addAll(files);


            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(Api.class).getRootFilesAndFolders(principal)).withSelfRel();
            return CollectionModel.of(results, selfLink);

        }catch (Exception ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }


    @GetMapping(path = { "/{folderId}" })
    public RepresentationModel getFilesAndFoldersInFolder(Principal principal, @PathVariable("folderId") String folderId) {
        try {
            User authUser = ((AppUserDetails) (((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

            Optional<Application> application = applicationRepository.findBySlug("files");
            if (!application.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application 'Files' not found");
            }


            //query
            Optional<FolderProj> folder = folderRepository.findById2(folderId);
            if( folder.isPresent() ) {
                List<EntityModel<FolderProj>> folders = decorateFolders(folderRepository.findByParentIdAndUserId(folderId, authUser.getId()));
                List<EntityModel<File>> files = decorateFiles(fileRepository.findByParentIdAndUserId(folderId, authUser.getId()));


                //add sorted folders first, then files (how we want them in the UI)
                RepresentationModel model = HalModelBuilder
                    .halModelOf(folder)
                    .link(Link.of("/files/api/").withSelfRel())
                    .embed(folders)
                    .embed(files)
                    .build();

                //folder.get().setEmbedded(results);
                return model;
            }else{
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }

        }catch (Exception ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }


    /**
     * Create new folder at the root or as a child of another folder
     * @param principal
     * @param folderId
     * @return
     */
    @PostMapping(path = { "/folders", "/folders/{folderId}" })
    public EntityModel<Folder> createFolder(Principal principal, @PathVariable("folderId") Optional<String> folderId, @RequestParam String name){

        try {
            User authUser = ((AppUserDetails) (((UsernamePasswordAuthenticationToken) principal).getPrincipal())).getUser();

            Optional<Application> application = applicationRepository.findBySlug("files");
            if (!application.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application 'Files' not found");
            }

            Family family = application.get().getFamily();

            Folder parent = null;
            if( folderId.isPresent() ){
                Optional<Folder> parentF = folderRepository.findById(folderId.get());
                if( !parentF.isPresent() ){
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder '" +folderId.get() +"' not found");
                }
                parent = parentF.get();
            }

            //Create as a root folder
            Folder f = Folder.builder()
                .withName(name)
                .withParent(parent)
                .withApplication(application.get())
                .withFamily(family)
                .withCreatedBy(authUser)
                .build();
            Folder newF = folderRepository.save(f);

            return decorateFolder(newF);

        }catch(Exception ex){
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        }
    }


    private List<EntityModel<FolderProj>> decorateFolders(List<FolderProj> folders) {
        return folders.stream().map((f)->{
            Link self = Link.of("/files/api/").withRel("self"); //todo
            return EntityModel.of(f, self);
        }).collect(Collectors.toList());
    }

    private EntityModel<FolderProj> decorateFolder(FolderProj folder) {
        Link self = Link.of("/files/api/").withRel("self"); //todo
        return EntityModel.of(folder, self);
    }

    private EntityModel<Folder> decorateFolder(Folder folder) {
        Link self = Link.of("/files/api/").withRel("self"); //todo
        return EntityModel.of(folder, self);
    }

    private EntityModel<File> decorateFile(File file) {
        Link self = Link.of("/files/api/").withRel("self"); //todo
        Link download = Link.of("/files/api/").withRel("download"); //todo
        return EntityModel.of(file, self, download);
    }

    private List<EntityModel<File>> decorateFiles(List<File> files) {
        return files.stream().map((f)->{
            Link self = Link.of("/files/api/").withRel("self"); //todo
            Link download = Link.of("/files/api/").withRel("download"); //todo
            return EntityModel.of(f, self, download);
        }).collect(Collectors.toList());
    }


}
