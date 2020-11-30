package com.mikenimer.familydam.config;

import org.neo4j.configuration.GraphDatabaseSettings;
import org.neo4j.configuration.connectors.BoltConnector;
import org.neo4j.configuration.helpers.SocketAddress;
import org.neo4j.dbms.api.DatabaseManagementService;
import org.neo4j.dbms.api.DatabaseManagementServiceBuilder;
import org.neo4j.graphdb.*;
import org.neo4j.graphdb.event.LabelEntry;
import org.neo4j.graphdb.event.TransactionData;
import org.neo4j.graphdb.event.TransactionEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.UUID;

@Configuration
public class GraphDbLocalConfig {

    private static final System.Logger LOGGER = System.getLogger(GraphDbLocalConfig.class.getName());

    //@Value("${familydam.home}")
    String HOME = "familydam-store";
    String DbName = "familydam";

    @Autowired
    public GraphDbLocalConfig(@Value("${familydam.home}") String home) {
        this.HOME = home;
    }


    @Bean("defaultDatabase")
    @Profile("local")
    public String defaultLocalDatabaseName(){
        return DbName;
    }

    @Bean("defaultDatabase")
    @Profile("test")
    public String defaultTestDatabaseName(){
        return DbName +"-test";
    }


    /**
     * Create Embedded Database
     * @param dbName
     * @param transactionEventListener
     * @return
     * @throws IOException
     */
    @Bean(destroyMethod = "shutdown")
    public DatabaseManagementService managementService(@Qualifier("defaultDatabase") String dbName, TransactionEventListener transactionEventListener) throws IOException  {
        //val userHome = System.getProperty("user.home");
        Path homePath = FileSystems.getDefault().getPath(new File(HOME).getCanonicalPath());

        DatabaseManagementService managementService = new DatabaseManagementServiceBuilder( homePath )
            .setConfig( GraphDatabaseSettings.default_database, dbName )
            .setConfig( GraphDatabaseSettings.mode, GraphDatabaseSettings.Mode.SINGLE )
            //.setConfig( GraphDatabaseSettings.auth_enabled, true )
            .setConfig( BoltConnector.enabled, true )
            .setConfig( BoltConnector.listen_address, new SocketAddress( "localhost", 7687 ) )
            .build();

        managementService.registerTransactionEventListener(dbName, transactionEventListener);
        return managementService;
    }


    /**
     * Start embedded database
     * @param managementService
     * @return
     */
    @Bean
    public GraphDatabaseService graphDatabaseService(DatabaseManagementService managementService){
        GraphDatabaseService graphDb = managementService.database( DbName );
        return graphDb;
    }


    /**
     * Pre and Post commit handler
     * @return
     */
    @Bean
    public TransactionEventListener transactionEventListener(){
        return new TransactionEventListener<Void>() {
            @Override
            public Void beforeCommit(TransactionData data, Transaction transaction, GraphDatabaseService databaseService) throws Exception {
                System.out.println("Committing transaction");
                //todo, check properties for 'lastModifiedDate' and update
                return null;
            }

            @Override
            public void afterCommit(TransactionData data, Void state, GraphDatabaseService databaseService) {
                System.out.println("Committed transaction");
                for (LabelEntry l : data.assignedLabels()) {
                    LOGGER.log(System.Logger.Level.INFO, "COMMIT | Label=" + l.label().name() + " | id=" + l.node().getId() );
                }
            }

            @Override
            public void afterRollback(TransactionData data, Void state, GraphDatabaseService databaseService) {
                System.out.println("Transaction rolled back");
            }
        };
    }


    @Deprecated
    private void populateDefaultNodes(GraphDatabaseService graphDb) {

        Boolean isInitialized = false;
        try( Transaction tx = graphDb.beginTx()) {
            Result result = tx.execute("MATCH(f:Family) return f");
            isInitialized = result.hasNext();
        }

        if( !isInitialized ) {
            try (Transaction tx = graphDb.beginTx()) {
                Node f = tx.createNode(Label.label("Family"));
                f.setProperty("name", "Nimer Family");

                Node u1 = tx.createNode(Label.label("User"));
                u1.setProperty("id", UUID.randomUUID().toString());
                u1.setProperty("name", "Mike");
                u1.setProperty("roles", new String[]{"family/parent","family/admin"});
                f.createRelationshipTo(u1, RelationshipType.withName("IN_FAMILY"));

                Node u2 = tx.createNode(Label.label("User"));
                u2.setProperty("id", UUID.randomUUID().toString());
                u2.setProperty("name", "Angie");
                u2.setProperty("roles", new String[]{"family/parent","family/admin"});
                f.createRelationshipTo(u2, RelationshipType.withName("IN_FAMILY"));

                Node u3 = tx.createNode(Label.label("User"));
                u3.setProperty("id", UUID.randomUUID().toString());
                u3.setProperty("name", "Kayden");
                u3.setProperty("roles", new String[]{"family/child"});
                f.createRelationshipTo(u3, RelationshipType.withName("IN_FAMILY"));

                Node u4 = tx.createNode(Label.label("User"));
                u4.setProperty("id", UUID.randomUUID().toString());
                u4.setProperty("name", "Kayden");
                u3.setProperty("roles", new String[]{"family/child"});
                f.createRelationshipTo(u4, RelationshipType.withName("IN_FAMILY"));


                Node aFiles = tx.createNode(Label.label("Application"));
                aFiles.setProperty("id", UUID.randomUUID().toString());
                aFiles.setProperty("name", "files");
                aFiles.setProperty("label", "Files");
                f.createRelationshipTo(aFiles, RelationshipType.withName("HAS_APPLICATION"));

                    Node fold1 = tx.createNode(Label.label("Folder"));
                    fold1.setProperty("id", UUID.randomUUID().toString());
                    fold1.setProperty("name", "2020");
                    fold1.createRelationshipTo(u1, RelationshipType.withName("OWNER"));
                    aFiles.createRelationshipTo(fold1, RelationshipType.withName("CHILD"));

                        Node file1 = tx.createNode(Label.label("File"));
                        file1.setProperty("id", UUID.randomUUID().toString());
                        file1.setProperty("name", "aaa.jpg");
                        file1.createRelationshipTo(u1, RelationshipType.withName("OWNER"));
                        fold1.createRelationshipTo(file1, RelationshipType.withName("CHILD"));

                    Node fold2 = tx.createNode(Label.label("Folder"));
                    fold2.setProperty("id", UUID.randomUUID().toString());
                    fold2.setProperty("name", "2019");
                    fold2.createRelationshipTo(u1, RelationshipType.withName("OWNER"));
                    aFiles.createRelationshipTo(fold2, RelationshipType.withName("CHILD"));


                    Node fold3 = tx.createNode(Label.label("Folder"));
                    fold3.setProperty("id", UUID.randomUUID().toString());
                    fold3.setProperty("name", "2020");
                    fold3.createRelationshipTo(u2, RelationshipType.withName("OWNER"));
                    aFiles.createRelationshipTo(fold3, RelationshipType.withName("CHILD"));

                        Node file2 = tx.createNode(Label.label("File"));
                        file2.setProperty("id", UUID.randomUUID().toString());
                        file2.setProperty("name", "bbb.jpg");
                        file2.createRelationshipTo(u2, RelationshipType.withName("OWNER"));
                        fold1.createRelationshipTo(file2, RelationshipType.withName("CHILD"));

                    Node fold4 = tx.createNode(Label.label("Folder"));
                    fold4.setProperty("id", UUID.randomUUID().toString());
                    fold4.setProperty("name", "2019");
                    fold4.createRelationshipTo(u2, RelationshipType.withName("OWNER"));
                    aFiles.createRelationshipTo(fold4, RelationshipType.withName("CHILD"));



                Node aPhotos = tx.createNode(Label.label("Application"));
                aPhotos.setProperty("id", UUID.randomUUID().toString());
                aPhotos.setProperty("name", "photos");
                aPhotos.setProperty("label", "Photos");
                aPhotos.createRelationshipTo(u2, RelationshipType.withName("OWNER"));
                f.createRelationshipTo(aPhotos, RelationshipType.withName("HAS_APPLICATION"));

                    Node album1 = tx.createNode(Label.label("Album"));
                    album1.setProperty("id", UUID.randomUUID().toString());
                    album1.setProperty("name", "x-mas_2020");
                    album1.setProperty("label", "X-Mas 2020");
                    album1.createRelationshipTo(u1, RelationshipType.withName("OWNER"));
                    aPhotos.createRelationshipTo(album1, RelationshipType.withName("CHILD"));
                    //add images
                    album1.createRelationshipTo(file1, RelationshipType.withName("CHILD"));
                    album1.createRelationshipTo(file2, RelationshipType.withName("CHILD"));

                    Node album2 = tx.createNode(Label.label("Album"));
                    album2.setProperty("id", UUID.randomUUID().toString());
                    album2.setProperty("name", "kids_birthday");
                    album2.setProperty("label", "Kids Birthday");
                    album2.createRelationshipTo(u1, RelationshipType.withName("OWNER"));
                    aPhotos.createRelationshipTo(album2, RelationshipType.withName("CHILD"));

                Node aEmails = tx.createNode(Label.label("Application"));
                aEmails.setProperty("id", UUID.randomUUID().toString());
                aEmails.setProperty("name", "emails");
                aEmails.setProperty("label", "Emails");
                f.createRelationshipTo(aEmails, RelationshipType.withName("HAS_APPLICATION"));

                Node aWeb = tx.createNode(Label.label("Application"));
                aWeb.setProperty("id", UUID.randomUUID().toString());
                aWeb.setProperty("name", "web");
                aWeb.setProperty("label", "Web Archive");
                f.createRelationshipTo(aWeb, RelationshipType.withName("HAS_APPLICATION"));

                Node aGen = tx.createNode(Label.label("Application"));
                aGen.setProperty("id", UUID.randomUUID().toString());
                aGen.setProperty("name", "genealogy");
                aGen.setProperty("label", "Genealogy");
                f.createRelationshipTo(aGen, RelationshipType.withName("HAS_APPLICATION"));


                tx.commit();
            }
        }
    }

}
