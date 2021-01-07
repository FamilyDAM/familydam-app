package com.familydam.repository.modules.files.models;

import com.familydam.repository.models.ContentNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.server.core.Relation;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@Relation(collectionRelation = "nodes", itemRelation = "node")
public class FolderNode implements ContentNode {
    String primaryType;
    Integer index;
    String path;
    String name;


    public static class FolderNodeBuilder{
        String primaryType;
        Integer index = 1;
        String path;
        String name;

        public FolderNodeBuilder withNode(Node node) throws RepositoryException {
            primaryType = node.getPrimaryNodeType().getName();
            index = node.getIndex();
            path = node.getPath();
            name = node.getName();
            return this;
        }
    }
}
