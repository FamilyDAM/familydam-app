package com.mikenimer.familydam.modules.files.config;

import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import com.mikenimer.familydam.modules.files.repositories.FileRepository;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.UUID;

@Configuration
public class FilesModuleConfig {

    private static final System.Logger log = System.getLogger(FilesModuleConfig.class.getName());

    GraphDatabaseService graphDatabaseService;
    ApplicationRepository applicationRepository;
    UserRepository userRepository;
    FolderRepository folderRepository;
    FileRepository fileRepository;

    @Autowired
    public FilesModuleConfig(GraphDatabaseService graphDatabaseService, ApplicationRepository applicationRepository, UserRepository userRepository, FolderRepository folderRepository, FileRepository fileRepository) {
        this.graphDatabaseService = graphDatabaseService;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
        this.fileRepository = fileRepository;
    }

    @PostConstruct
    public void initializeNodes() {
        Boolean isInitialized = false;
        try (Transaction tx = graphDatabaseService.beginTx()) {
            Result result = tx.execute("MATCH(a:Application) where a.name = 'Files' return a");
            isInitialized = result.hasNext();
        }


        if (!isInitialized) {
            log.log(System.Logger.Level.INFO, "Create File Application");

            Application app = new Application();
            app.setId(UUID.randomUUID().toString());
            app.setName("Files");
            applicationRepository.save(app);

        }

    }
}

