package com.familydam.repository.modules.auth.services;

import com.familydam.repository.modules.auth.models.User;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.List;

@Service
public class GetUserService implements IRestService
{

    @Autowired
    UserListService userListService;



    public User getUser(Session session, String userId) throws RepositoryException  {
        JackrabbitSession jackrabbitSession = (JackrabbitSession)session;

        //Session adminSession = session.impersonate(new SimpleCredentials("admin", "admin".toCharArray()));
        Authorizable authorizable = jackrabbitSession.getUserManager().getAuthorizable(session.getUserID());

        List<User> users = userListService.listUsers(session, true);
        for (User user : users) {
            if( user.getId().equals(userId)){
                return user;
            }
        }

        return null;
    }
}
