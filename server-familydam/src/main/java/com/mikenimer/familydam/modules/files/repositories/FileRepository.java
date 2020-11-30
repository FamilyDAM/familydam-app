package com.mikenimer.familydam.modules.files.repositories;

import com.mikenimer.familydam.modules.files.models.File;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface FileRepository extends Neo4jRepository<File, String> {

}
