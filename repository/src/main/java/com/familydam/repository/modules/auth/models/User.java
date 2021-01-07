package com.familydam.repository.modules.auth.models;

import com.familydam.repository.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.springframework.hateoas.server.core.Relation;

import java.util.Map;

@Data
@Builder
@Relation(collectionRelation = "users", itemRelation = "user")
public class User {

    public String id;
    public String name;
    public String firstName;
    public String lastName;

    @JsonIgnore
    public String password;



    public static class UserBuilder{
        String id;
        String name;
        String firstName;
        String lastName;
        String password;

        public UserBuilder withMap(Map userMap){
            this.id = (String)userMap.get(Constants.ID);
            this.name = (String)userMap.get(Constants.NAME);
            this.firstName = (String)userMap.get(Constants.FIRST_NAME);
            this.lastName = (String)userMap.get(Constants.LAST_NAME);
            this.password = (String)userMap.get(Constants.PASSWORD);
            return this;
        }
    }
}
