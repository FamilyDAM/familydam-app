package com.familydam.repository.services.auth;

import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.List;
import java.util.Map;

@Service
public class GetUserService {

    @Autowired
    UserListService userListService;



    public Map getUser(Session session, String userId) throws RepositoryException  {
        JackrabbitSession jackrabbitSession = (JackrabbitSession)session;

        //Session adminSession = session.impersonate(new SimpleCredentials("admin", "admin".toCharArray()));
        Authorizable authorizable = jackrabbitSession.getUserManager().getAuthorizable(session.getUserID());

        List<Map> users = userListService.listUsers(session, true);
        for (Map user : users) {
            if( user.get("id").equals(userId)){
                return user;
            }
        }

        return null;
    }
}
