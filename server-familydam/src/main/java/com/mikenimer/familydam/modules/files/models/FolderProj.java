package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Date;
import java.util.List;


@Getter @Setter
public class FolderProj {

    List embedded;

    public String id;
    public Date createdDate = new Date();//ZonedDateTime.now();
    public Date lastModifiedDate = new Date();//ZonedDateTime.now();

    public String name;
    public String slug;
    public String contentType = "application/folder";
    @Relationship(type = "IS_CHILD", direction = Relationship.Direction.INCOMING)
    public Folder parent;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public List getEmbedded() {
        return embedded;
    }
    public void setEmbedded(List resources) {
        embedded = resources;
    }

 }


