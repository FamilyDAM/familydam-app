package com.familydam.repository.services.auth;


import com.familydam.repository.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CreateUserTest {
    
    @Autowired
    Repository repository;

    @Autowired
    UserListService userListService;

    @Autowired
    UserCreateService userCreateService;

    @Test
    public void createUser() throws Exception
    {
        Map _user = new HashMap();
        _user.put(":name", "user-" + UUID.randomUUID().toString());
        _user.put("pwd", "admin");
        _user.put(Constants.FIRST_NAME, "Test");
        _user.put(Constants.LAST_NAME, "User");
        _user.put(Constants.EMAIL, "test@foo.com");
        _user.put(Constants.IS_FAMILY_ADMIN, true);


        //make sure we only have the admin user
        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        List<Map> users = userListService.listUsers(session, false);
        Assert.assertEquals(1, users.size());

        //create new user
        Map user = userCreateService.createUser(session, _user);
        Assert.assertNotNull(user);
        Assert.assertFalse(user.containsKey("rep:password"));
        Assert.assertFalse(user.containsKey("rep:authorizableId"));
        Assert.assertEquals(_user.get(Constants.FIRST_NAME), user.get(Constants.FIRST_NAME));
        Assert.assertEquals(_user.get(Constants.LAST_NAME), user.get(Constants.LAST_NAME));
        Assert.assertEquals(_user.get(Constants.EMAIL), user.get(Constants.EMAIL));
        Assert.assertEquals(_user.get(Constants.IS_FAMILY_ADMIN), user.get(Constants.IS_FAMILY_ADMIN));

        //check that we now have 2 users (admin & new user)
        users = userListService.listUsers(session, false);
        Assert.assertEquals(2, users.size());

    }
}
