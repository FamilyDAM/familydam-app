package com.mikenimer.familydam.modules.files.repositories;

import com.mikenimer.familydam.modules.files.models.Folder;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface FolderRepository extends Neo4jRepository<Folder, String> {

    //@Query(value = "match(f:Folder) <- [:IN_APPLICATION] - (a:Application) where a.slug = 'files'  return f")
    //List<Folder> findAllRootFolders();

    @Query(value = "match(f:Folder) <- [:IN_APP] - (a:Application) where a.slug = 'files' and f.parent = :parent return f")
    List<Folder> findChildren(@Param("parent") String parent);

}
