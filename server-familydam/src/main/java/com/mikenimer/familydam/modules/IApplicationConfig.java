package com.mikenimer.familydam.modules;

import com.mikenimer.familydam.modules.auth.models.Application;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface IApplicationConfig {
    public Application getAppNode();
}
