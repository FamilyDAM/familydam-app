package com.mikenimer.familydam.config;

import org.neo4j.configuration.ExternalSettings;
import org.neo4j.configuration.GraphDatabaseSettings;
import org.neo4j.configuration.connectors.BoltConnector;
import org.neo4j.configuration.helpers.SocketAddress;
import org.neo4j.dbms.api.DatabaseManagementService;
import org.neo4j.dbms.api.DatabaseManagementServiceBuilder;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
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
            .setConfig( ExternalSettings.windows_service_name, "FamilyD.A.M." )
            .setConfig( GraphDatabaseSettings.default_database, dbName )
            .setConfig( GraphDatabaseSettings.mode, GraphDatabaseSettings.Mode.SINGLE )
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



}
