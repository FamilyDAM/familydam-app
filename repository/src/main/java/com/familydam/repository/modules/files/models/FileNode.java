package com.familydam.repository.modules.files.models;

import com.familydam.repository.models.ContentNode;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.server.core.Relation;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
@Relation(collectionRelation = "nodes", itemRelation = "node")
public class FileNode implements ContentNode {

    String primaryType;
    Integer index;
    String path;
    String name;
    String mimeType;
    String createdBy;
    String modifiedBy;
    String description;
    Date dateCreated;
    Date dateModified;
    Double rating;
    String[] tags;
    String[] mixins;


    public Map toJcrMap(){
        HashMap m = new HashMap();
        m.put("path", this.getPath());
        m.put("name", this.getName());
        m.put("index", this.getIndex());
        m.put("jcr:primaryType", this.getPrimaryType());
        m.put("jcr:mixinTypes", this.getMixins());
        m.put("jcr:createdBy", this.getCreatedBy());
        m.put("dam:date.created", this.getDateCreated());
        m.put("dam:date.modified", this.getDateModified());
        m.put("dam:description", this.getDescription());
        m.put("dam:tags", this.getTags());
        m.put("dam:rating", this.getRating());

        //skipping jcr:content properties. these area automatically set when binary file is modified

        return m;
    }

    public static class FileNodeBuilder{
        String primaryType;
        Integer index = 1;
        String path;
        String name;
        Long size;
        String mimeType;
        String createdBy;
        String modifiedBy;
        String description;
        Date dateCreated;
        Date dateModified;
        Double rating;
        String[] tags;
        String[] mixins;

        public FileNodeBuilder withNode(Node node) throws RepositoryException {
            primaryType = node.getPrimaryNodeType().getName();
            index = Integer.valueOf(node.getIndex());
            path = node.getPath();
            name = node.getName();
            index = node.getIndex();
            createdBy = node.getProperty("jcr:createdBy").getString();
            dateCreated = node.getProperty("jcr:created").getDate().getTime();
            tags = new String[0];
            //app specific

            if( node.hasProperty("dam:description") ) description = node.getProperty("dam:description").getString();
            if( node.hasProperty("dam:rating") ) rating = node.getProperty("dam:rating").getDouble();
            if( node.hasProperty("dam:date.created") ) dateCreated = node.getProperty("dam:date.created").getDate().getTime();
            if( node.hasProperty("dam:date.modified") ) dateModified = node.getProperty("dam:date.modified").getDate().getTime();
            if( node.hasProperty("dam:tags") ){
                Value[] tagValues = node.getProperty("dam:tags").getValues();
                tags = Arrays.stream(tagValues).map(v->{
                    try{
                        return v.getString();
                    }catch(Exception ex){
                        return null;
                    }
                }).toArray(String[]::new);
            }

            //mixins
            Value[] values = node.getProperty("jcr:mixinTypes").getValues();
            mixins = Arrays.stream(values).map(v->{
                try{
                    return v.getString();
                }catch(Exception ex){
                    return null;
                }
            }).toArray(String[]::new);

            //nested
            if( node.hasNode("jcr:content")) {
                mimeType = node.getNode("jcr:content").getProperty("jcr:mimeType").getString();
                modifiedBy = node.getNode("jcr:content").getProperty("jcr:lastModifiedBy").getString();
                size = node.getNode("jcr:content").getProperty("jcr:data").getLength();
            }
            //Value[] mixins = node.getProperty("jcr:mixinTypes").getValues()
            //jcr:createdBy = mike, dam:date.modified = 2005-03-20T03:36:20.000-06:00, dam:date.created = 2005-03-20T03:36:20.000-06:00, jcr:created = 2021-01-10T17:00:20.470-06:00
            //in jcr:content - jcr:lastModifiedBy = mike, jcr:mimeType = image/jpeg, jcr:lastModified = 2021-01-10T17:14:07.071-06:00

            return this;
        }
    }
}
