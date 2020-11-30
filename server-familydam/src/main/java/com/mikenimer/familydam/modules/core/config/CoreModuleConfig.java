package com.mikenimer.familydam.modules.core.config;

import com.mikenimer.familydam.modules.core.models.Family;
import com.mikenimer.familydam.modules.core.models.User;
import com.mikenimer.familydam.modules.core.repositories.FamilyRepository;
import com.mikenimer.familydam.modules.core.repositories.UserRepository;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.UUID;

@Configuration
public class CoreModuleConfig {

    private static final System.Logger log = System.getLogger(CoreModuleConfig.class.getName());

    GraphDatabaseService graphDatabaseService;
    FamilyRepository familyRepository;
    UserRepository userRepository;

    public CoreModuleConfig(GraphDatabaseService graphDatabaseService, FamilyRepository familyRepository, UserRepository userRepository) {
        this.graphDatabaseService = graphDatabaseService;
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initializeNodes(){
        Boolean isInitialized = false;
        try( Transaction tx = graphDatabaseService.beginTx()) {
            Result result = tx.execute("MATCH(f:Family) return f");
            isInitialized = result.hasNext();
        }

        if( !isInitialized ) {
            log.log(System.Logger.Level.INFO, "Create Core Nodes");

            Family family = new Family();
            family.setId(UUID.randomUUID().toString());
            family.setName("Family");
            familyRepository.save(family);

            //todo:remove
            User u1 = new User();
            u1.setName("Mike");
            u1.setFamily(family);
            userRepository.save(u1);

            //todo:remove
            User u2 = new User();
            u2.setName("Angie");
            u2.setFamily(family);
            userRepository.save(u2);
//
//            try (Transaction tx = graphDatabaseService.beginTx()) {
//                Node f = tx.createNode(Label.label("Family"));
//                f.setProperty("name", "Nimer Family");
//
//                    Node u1 = tx.createNode(Label.label("User"));
//                    u1.setProperty("id", UUID.randomUUID().toString());
//                    u1.setProperty("name", "Mike");
//                    u1.setProperty("roles", new String[]{"family/parent","family/admin"});
//                    f.createRelationshipTo(u1, RelationshipType.withName("IN_FAMILY"));
//
//                    Node u2 = tx.createNode(Label.label("User"));
//                    u2.setProperty("id", UUID.randomUUID().toString());
//                    u2.setProperty("name", "Angie");
//                    u2.setProperty("roles", new String[]{"family/parent","family/admin"});
//                    f.createRelationshipTo(u2, RelationshipType.withName("IN_FAMILY"));
//
//                    Node u3 = tx.createNode(Label.label("User"));
//                    u3.setProperty("id", UUID.randomUUID().toString());
//                    u3.setProperty("name", "Kayden");
//                    u3.setProperty("roles", new String[]{"family/child"});
//                    f.createRelationshipTo(u3, RelationshipType.withName("IN_FAMILY"));
//
//                    Node u4 = tx.createNode(Label.label("User"));
//                    u4.setProperty("id", UUID.randomUUID().toString());
//                    u4.setProperty("name", "Kayden");
//                    u3.setProperty("roles", new String[]{"family/child"});
//                    f.createRelationshipTo(u4, RelationshipType.withName("IN_FAMILY"));
//
//                tx.commit();
//            }
        }
    }
}
