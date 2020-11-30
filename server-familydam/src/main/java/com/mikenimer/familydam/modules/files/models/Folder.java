package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mikenimer.familydam.modules.core.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

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
    public Object parent;

    @JsonIgnore
    @Relationship(type = "IS_OWNER", direction = Relationship.Direction.INCOMING)
    public User owner;


    public Folder(String name, Object parent, User owner) {
        this.name = name;
        this.parent = parent;
        this.owner = owner;
    }
}
