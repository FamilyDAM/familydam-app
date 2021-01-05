package com.mikenimer.familydam.modules.files.repositories;

import com.mikenimer.familydam.modules.files.models.Folder;
import com.mikenimer.familydam.modules.files.models.FolderProj;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends Neo4jRepository<Folder, String> {


    /**
     * Get all ROOT folders (folders with no parent folder)
     * @param userId
     * @return
     */
    @Query("MATCH (a:Application)<-[:CREATED_BY_APP]-(f:Folder)-[:CREATED_BY]->(u:User) WHERE NOT (f)<-[:IS_CHILD]-() AND a.slug = 'files' AND u.id=$userId RETURN f ORDER BY f.name desc")
    List<FolderProj> findRootFoldersByUserId(String userId);


    /**
     * Get list of folders that are children of another folder
     * @param parentId
     * @param userId
     * @return
     */
    @Transactional
    @Query("MATCH (fParent{id:$parentId})-[:IS_CHILD]->(f:Folder)-[:CREATED_BY]->(u:User) where u.id=$userId return f ORDER BY f.name desc")
    List<FolderProj> findByParentIdAndUserId(String parentId, String userId);

    /**
     * Get Single folder, by id
     * @param id
     * @param userId
     * @return
     */
    @Query("MATCH (f{id:$id})<-[:CREATED_BY]-(u:User) WHERE u.id=$userId RETURN f ORDER BY f.name desc")
    Optional<Folder> findByIdAndUserId(String id, String userId);



    /**
     * Get Single folder, by id
     * @param id
     * @return
     */
    @Query("MATCH (f:Folder{id:$id}) RETURN f ORDER BY f.name desc")
    Optional<Folder> findById(String id);

    @Query("MATCH (f:Folder{id:$id}) RETURN f ORDER BY f.name desc")
    Optional<FolderProj> findById2(String id);




}
