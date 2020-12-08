package com.mikenimer.familydam.modules.files.config;

import com.mikenimer.familydam.modules.core.repositories.ApplicationRepository;
import com.mikenimer.familydam.modules.core.repositories.UserRepository;
import com.mikenimer.familydam.modules.files.repositories.FileRepository;
import com.mikenimer.familydam.modules.files.repositories.FolderRepository;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class FilesModuleConfig {

    private static final System.Logger log = System.getLogger(FilesModuleConfig.class.getName());

    GraphDatabaseService graphDatabaseService;
    ApplicationRepository applicationRepository;
    UserRepository userRepository;
    FolderRepository folderRepository;
    FileRepository fileRepository;

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

        /**
         if( !isInitialized ) {
         log.log(System.Logger.Level.INFO, "Create File Application");

         Application app = new Application();
         app.setId(UUID.randomUUID().toString());
         app.setName("Files");
         applicationRepository.save(app);


         //todo remove
         String[] UNames = new String[]{"Mike", "Angie"};
         String[] FNames = new String[]{"2020","2019","2018"};
         for (String folderName : FNames) {
         Optional<User> u1 = userRepository.findByName(UNames[0]);
         if( u1.isPresent() ) {
         User user1 = u1.get();
         Folder f1 = new Folder(folderName +"-level1 (" +user1.getFirstName() +")", app, null, user1);
         folderRepository.save(f1);
         Folder f1a = new Folder(folderName +"-level2a (" +user1.getFirstName() +")", app, f1, user1);
         folderRepository.save(f1a);
         fileRepository.save(new File("aaa.jpg", app, f1a, user1));
         fileRepository.save(new File("bbb.jpg", app, f1a, user1));
         Folder f1b = new Folder(folderName +"-level2a (" +user1.getFirstName() +")", app, f1, user1);
         folderRepository.save(f1b);
         fileRepository.save(new File("ccc.jpg", app, f1a, user1));
         fileRepository.save(new File("ddd.jpg", app, f1a, user1));
         }

         Optional<User> u2 = userRepository.findByName(UNames[1]);
         if( u2.isPresent() ) {
         User user2 = u2.get();
         Folder f2 = new Folder(folderName +"-level1 (" +user2.getFirstName() +")", app, null, user2);
         folderRepository.save(f2);
         Folder f2a = new Folder(folderName +"-level2a (" +user2.getFirstName() +")", app, f2, user2);
         folderRepository.save(f2a);
         fileRepository.save(new File("zzz.jpg", app, f2a, user2));
         fileRepository.save(new File("yyy.jpg", app, f2a, user2));
         Folder f2b = new Folder(folderName +"-level2a (" +user2.getFirstName() +")", app, f2, user2);
         folderRepository.save(f2b);
         fileRepository.save(new File("xxx.jpg", app, f2a, user2));
         fileRepository.save(new File("www.jpg", app, f2a, user2));
         }
         }**/

    }
}

