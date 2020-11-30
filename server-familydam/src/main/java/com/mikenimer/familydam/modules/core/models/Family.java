package com.mikenimer.familydam.modules.core.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Node("Family")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class Family {
    private static String LABEL = "Family";

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    public String id;
    @Property @DateString
    public Date createdDate = new Date();//ZonedDateTime.now();
    @Property @DateString
    public Date lastModifiedDate = new Date();//ZonedDateTime.now();


    @Property
    public String name;

    @Relationship(type = "IN_FAMILY", direction = Relationship.Direction.OUTGOING)
    public List<User> members = new ArrayList<>();

}
