package com.mikenimer.familydam.modules.core.config;

import com.mikenimer.familydam.modules.core.repositories.FamilyRepository;
import com.mikenimer.familydam.modules.core.repositories.UserRepository;
import org.neo4j.graphdb.GraphDatabaseService;
import org.springframework.context.annotation.Configuration;

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

}
