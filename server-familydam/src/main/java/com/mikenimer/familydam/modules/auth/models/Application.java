package com.mikenimer.familydam.modules.auth.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.*;
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
    public String slug; // internal name
    @Property
    public String name; // localized name
    @Property
    public int appOrder = 0;
    @Property
    public Boolean isPrimaryApp = true;
    @Property
    public String homeUrl = "";
    @Property
    public String apiUrl = "";

    @JsonIgnore
    @Relationship(type = "IN_FAMILY", direction = Relationship.Direction.OUTGOING)
    public Family family;

}
