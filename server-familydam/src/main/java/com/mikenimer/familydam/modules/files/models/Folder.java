package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Node("Folder")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
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

    @JsonIgnore
    @Relationship(type = "IS_CHILD", direction = Relationship.Direction.INCOMING)
    public Folder parent;

    //Metadata
    @JsonIgnore
    @Relationship(type = "CREATED_BY_APP", direction = Relationship.Direction.INCOMING)
    public Application application;

    @JsonIgnore
    @Relationship(type = "IS_OWNER", direction = Relationship.Direction.INCOMING)
    public User owner;


    public Folder(String name, @NotNull Application app, Folder parent, @NotNull User owner) {
        this.name = name;
        this.application = app;
        this.parent = parent;
        this.owner = owner;
    }
}
