package com.mikenimer.familydam.modules.core.repositories;

import com.mikenimer.familydam.modules.core.models.Application;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = true)
public interface ApplicationRepository extends Neo4jRepository<Application, String> {
    //
}
