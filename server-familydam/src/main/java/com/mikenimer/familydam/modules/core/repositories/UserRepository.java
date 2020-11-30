package com.mikenimer.familydam.modules.core.repositories;

import com.mikenimer.familydam.modules.core.models.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface UserRepository extends Neo4jRepository<User, String> {
    //
    Optional<User> findByName(String name);

}
