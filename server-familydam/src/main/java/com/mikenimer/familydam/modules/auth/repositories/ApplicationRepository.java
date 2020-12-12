package com.mikenimer.familydam.modules.auth.repositories;

import com.mikenimer.familydam.modules.auth.models.Application;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface ApplicationRepository extends Neo4jRepository<Application, String> {
    //
}
