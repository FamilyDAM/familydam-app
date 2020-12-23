package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Node("Folder")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Builder
public class Folder {
    private static String LABEL = "Folder";

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


    public Folder(@NotNull String name, @NotNull Application app, Folder parent, @NotNull User createdBy) {
        this.name = name;
        this.slug = name.trim().toLowerCase().replaceAll("[^a-z0-9]+", "_");
        this.application = app;
        this.parent = parent;
        this.createdBy = createdBy;
    }

    public void setName(String name) {
        this.name = name;
        this.slug = name.trim().toLowerCase().replaceAll("[^a-z0-9- ]+", "_");
    }
}
