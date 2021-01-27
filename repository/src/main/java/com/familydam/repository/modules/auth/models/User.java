package com.familydam.repository.modules.auth.models;

import com.familydam.repository.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.springframework.hateoas.server.core.Relation;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

@Data
@Builder
@Relation(collectionRelation = "users", itemRelation = "user")
public class User {

    public String id;
    public String name;
    public String firstName;
    public String lastName;
    public Boolean isFamilyAdmin;
    public Boolean isSystemAdmin;
    public Boolean isDisabled;

    @JsonIgnore
    public String password;



    public static class UserBuilder{
        String id;
        String name;
        String firstName;
        String lastName;
        String password;
        public Boolean isFamilyAdmin = false;
        public Boolean isSystemAdmin = false;
        public Boolean isDisabled = false;

        String path;
        Date created;

        public UserBuilder withMap(Map userMap){
            this.id = (String)userMap.get(Constants.JCR_ID); //jcr:uuid
            this.firstName = (String)userMap.get(Constants.FIRST_NAME);
            this.lastName = (String)userMap.get(Constants.LAST_NAME);
            //this.password = (String)userMap.get(Constants.PASSWORD);

            if(userMap.containsKey(Constants.JCR_NAME)) this.name = (String)userMap.get(Constants.JCR_NAME);
            if(userMap.containsKey(Constants.NAME)) this.name = (String)userMap.get(Constants.NAME);

            if( userMap.containsKey(Constants.IS_FAMILY_ADMIN) ) this.isFamilyAdmin = (Boolean) userMap.get(Constants.IS_FAMILY_ADMIN);
            if( userMap.containsKey(Constants.IS_SYSTEM_ADMIN) ) this.isSystemAdmin = (Boolean) userMap.get(Constants.IS_SYSTEM_ADMIN);

            if(userMap.containsKey(Constants.IS_DISABLED)) this.isDisabled = (Boolean) userMap.get(Constants.IS_DISABLED);

            if( userMap.containsKey(Constants.JCR_CREATED) ) created = ((Calendar)userMap.get(Constants.JCR_CREATED)).getTime(); //jcr:created
            return this;
        }
    }
}
