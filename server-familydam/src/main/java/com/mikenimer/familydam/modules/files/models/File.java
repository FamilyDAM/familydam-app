package com.mikenimer.familydam.modules.files.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mikenimer.familydam.modules.auth.models.Application;
import com.mikenimer.familydam.modules.auth.models.Family;
import com.mikenimer.familydam.modules.auth.models.User;
import lombok.*;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.DateString;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.Date;

@Node("File")
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(setterPrefix = "with")
public class File {
    private static String LABEL = "File";

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
    public String contentType = "application/octet-stream";

    @JsonIgnore
    @Relationship(type = "IS_CHILD", direction = Relationship.Direction.INCOMING)
    public Folder parent;


    @JsonIgnore
    @Relationship(type = "CREATED_BY", direction = Relationship.Direction.OUTGOING)
    public User createdBy;

    //Metadata
    @JsonIgnore
    @Relationship(type = "CREATED_BY_APP", direction = Relationship.Direction.OUTGOING)
    public Application application;

    @JsonIgnore
    @Relationship(type = "CREATED_BY_FAMILY", direction = Relationship.Direction.OUTGOING)
    public Family family;

    public static class FileBuilder {
        private String name;
        private String slug;
        private Date createdDate = new Date();
        private Date lastModifiedDate = new Date();
        private String contentType = "application/octet-stream";

        public File.FileBuilder withName(String name) {
            this.name = name;
            this.slug = name.trim().toLowerCase().replaceAll("[^a-z0-9-]+", "_");
            return this;
        }
    }
}
