package com.mikenimer.familydam.modules.auth.repositories;

import com.mikenimer.familydam.modules.auth.models.Application;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends Neo4jRepository<Application, String> {
    //
    public Optional<Application> findBySlug(String slug);
}
