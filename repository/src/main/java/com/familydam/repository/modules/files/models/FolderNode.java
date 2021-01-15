package com.familydam.repository.modules.files.models;

import com.familydam.repository.models.ContentNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.server.core.Relation;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
    String createdBy;
    Date dateCreated;
    String[] mixins;


    public Map toJcrMap(){
        HashMap m = new HashMap();
        m.put("path", this.getPath());
        m.put("name", this.getName());
        m.put("index", this.getIndex());
        m.put("jcr:primaryType", this.getPrimaryType());
        m.put("jcr:mixinTypes", this.getMixins());
        m.put("jcr:createdBy", this.getCreatedBy());
        m.put("jcr:created", this.getDateCreated());

        //skipping jcr:content properties. these area automatically set when binary file is modified

        return m;
    }

    public static class FolderNodeBuilder{
        String primaryType;
        Integer index = 1;
        String path;
        String name;
        Date dateCreated;

        public FolderNodeBuilder withNode(Node node) throws RepositoryException {
            primaryType = node.getPrimaryNodeType().getName();
            index = node.getIndex();
            path = node.getPath();
            name = node.getName();
            createdBy = node.getProperty("jcr:createdBy").getString();
            dateCreated = node.getProperty("jcr:created").getDate().getTime();
            return this;
        }
    }
}
