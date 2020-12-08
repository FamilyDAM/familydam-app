package com.mikenimer.familydam.modules.core.repositories;

import com.mikenimer.familydam.modules.core.models.Family;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface FamilyRepository extends Neo4jRepository<Family, String> {
    //
}
