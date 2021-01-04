package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.Date;
import java.util.List;

@Node("Folder")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(setterPrefix = "with")
public class Folder {
    private static String LABEL = "Folder";

    List embedded;

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    public String id;
    @Property @DateString
    public Date createdDate = new Date();//ZonedDateTime.now();
    @Property @DateString
    public Date lastModifiedDate = new Date();//ZonedDateTime.now();



    @Property
    public String name;
    @Property
    public String slug;

    @Property
    public String contentType = "application/folder";

    @JsonIgnore
    @Relationship(type = "IS_CHILD", direction = Relationship.Direction.INCOMING)
    public Folder parent;

    //Metadata
    @JsonIgnore
    @Relationship(type = "IN_APP", direction = Relationship.Direction.INCOMING)
    public Application application;

    @JsonIgnore
    @Relationship(type = "CREATED_BY", direction = Relationship.Direction.OUTGOING)
    public User createdBy;

    @JsonIgnore
    @Relationship(type = "IN_FAMILY", direction = Relationship.Direction.OUTGOING)
    public Family family;


    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("_embedded")
    public List getEmbedded() {
        return embedded;
    }
    public void setEmbedded(List resources) {
        embedded = resources;
    }


    public static class FolderBuilder {
        private String name;
        private String slug;
        private Date createdDate = new Date();
        private Date lastModifiedDate = new Date();
        private String contentType = "application/folder";

        public FolderBuilder withName(String name) {
            this.name = name;
            this.slug = name.trim().toLowerCase().replaceAll("[^a-z0-9-]+", "_");
            return this;
        }
    }
 }


