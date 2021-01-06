package com.familydam.repository.services.auth;


import com.familydam.repository.modules.auth.services.UserListService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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
    Repository repository;

    @Autowired
    UserListService userListService;

    @Test
    public void listUsers() throws Exception
    {
        Session session = repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        List<Map> users = userListService.listUsers(session, false);
        Assert.assertTrue(users.size() >= 1);
    }
}
