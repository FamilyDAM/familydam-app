package com.familydam.repository.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.hateoas.server.core.Relation;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@Data
@AllArgsConstructor
@Builder(setterPrefix = "with")
@Relation(collectionRelation = "nodes", itemRelation = "node")
public class UnstructuredNode implements ContentNode {

    String primaryType;
    Integer index;
    String path;
    String name;

    public static class UnstructuredNodeBuilder{
        String primaryType;
        Integer index = 1;
        String path;
        String name;

        public UnstructuredNodeBuilder withNode(Node node) throws RepositoryException {
            primaryType = node.getPrimaryNodeType().getName();
            index = node.getIndex();
            path = node.getPath();
            name = node.getName();
            return this;
        }
    }
}
