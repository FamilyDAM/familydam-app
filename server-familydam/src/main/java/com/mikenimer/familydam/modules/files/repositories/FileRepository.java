package com.mikenimer.familydam.modules.files.repositories;

import com.mikenimer.familydam.modules.files.models.File;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends Neo4jRepository<File, String> {


    /**
     * Get all ROOT files (files not in a folder)
     * @param userId
     * @return
     */
    @Query("MATCH (a:Application)-[:IN_APP]->(f:File)-[:CREATED_BY]->(u:User) WHERE NOT (f)<-[:IS_CHILD]-() AND a.slug = 'files' AND u.id=$userId RETURN f ORDER BY f.name")
    List<File> findRootFilesByUserId(String userId);


    @Query("MATCH (:Folder{id:$parentId})-[:IS_CHILD]->(f:File)-[:CREATED_BY]->(u:User) where u.id=$userId return f ORDER BY f.name")
    List<File> findByParentIdAndUserId(String parentId, String userId);

}
