package com.mikenimer.familydam.modules.core.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.Date;


@Node("User")
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class User {
    public static String LABEL = "User";

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
    public String lastName;
    @Property
    public String email;
    @Property
    public String password;


    @JsonIgnore
    @Relationship(type = "IN_FAMILY", direction = Relationship.Direction.INCOMING)
    public Family family;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        String shaHex = password;//new DigestUtils("SHA-256").digestAsHex(originalString);
        this.password = shaHex;
    }
}
