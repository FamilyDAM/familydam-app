package com.mikenimer.familydam.modules.auth.repositories;

import com.mikenimer.familydam.modules.auth.models.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends Neo4jRepository<User, String> {

}
