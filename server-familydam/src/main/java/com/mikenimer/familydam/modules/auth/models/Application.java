package com.mikenimer.familydam.modules.auth.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.Date;
import java.util.UUID;


@Node("Application")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class Application {
    public static String LABEL = "Application";

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    public String id = UUID.randomUUID().toString();
    @Property @DateString
    public Date createdDate = new Date();//ZonedDateTime.now();
    @Property @DateString
    public Date lastModifiedDate = new Date();//ZonedDateTime.now();

    @Property
    public String name;

}
