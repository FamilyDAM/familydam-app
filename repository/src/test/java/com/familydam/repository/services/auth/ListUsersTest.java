package com.familydam.repository.services.auth;


import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ListUsersTest {

    @Autowired
    @Qualifier("testRepo")
    Repository repository;

    @Autowired
    UserListService userListService;

    @Test
    public void listUsers() throws Exception
    {
        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        List<Map> users = userListService.listUsers(session, false);
        Assert.assertEquals(1, users.size());
        Assert.assertEquals("admin", users.get(0).get("id"));
        Assert.assertEquals(true, users.get(0).get("_isAdmin"));

    }
}
