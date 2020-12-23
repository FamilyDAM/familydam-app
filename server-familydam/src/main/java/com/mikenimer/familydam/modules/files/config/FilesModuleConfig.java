package com.mikenimer.familydam.modules.files.config;

import com.mikenimer.familydam.modules.IApplicationConfig;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.auth.repositories.FamilyRepository;
import com.mikenimer.familydam.modules.files.repositories.FileRepository;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import org.neo4j.graphdb.GraphDatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.Optional;

@Configuration
public class FilesModuleConfig implements IApplicationConfig {

    private static final System.Logger log = System.getLogger(FilesModuleConfig.class.getName());

    GraphDatabaseService graphDatabaseService;
    ApplicationRepository applicationRepository;
    FamilyRepository familyRepository;
    FolderRepository folderRepository;
    FileRepository fileRepository;

    @Autowired
    public FilesModuleConfig(GraphDatabaseService graphDatabaseService, ApplicationRepository applicationRepository, FamilyRepository familyRepository, FolderRepository folderRepository, FileRepository fileRepository) {
        this.graphDatabaseService = graphDatabaseService;
        this.applicationRepository = applicationRepository;
        this.familyRepository = familyRepository;
        this.folderRepository = folderRepository;
        this.fileRepository = fileRepository;
    }

    @PostConstruct
    public void initializeNodes() {
        Optional<Application> fileApp = applicationRepository.findBySlug("files");

        if( fileApp.isPresent() ) {
            Application defaultApp = getAppNode();
            Application app = fileApp.get();
            //update props, in case new properties have been added since it was created
            app.setSlug(defaultApp.getSlug());
            app.setName(defaultApp.getName());
            app.setIsPrimaryApp(defaultApp.isPrimaryApp);
            app.setAppOrder(defaultApp.getAppOrder());
            app.setApiUrl(defaultApp.getApiUrl());
            app.setHomeUrl(defaultApp.getHomeUrl());
            applicationRepository.save(app);
        }
    }

    public Application getAppNode(){
        Application app = new Application();
        app.setSlug("files");
        app.setName("Files");
        app.setIsPrimaryApp(true);
        app.setAppOrder(0);
        app.setApiUrl("/files/api/");
        app.setHomeUrl("/files/index.html");
        return app;
    }

}

