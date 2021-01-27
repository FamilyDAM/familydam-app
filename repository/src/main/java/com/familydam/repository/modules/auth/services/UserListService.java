package com.familydam.repository.modules.auth.services;

import com.familydam.repository.Constants;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.springframework.stereotype.Service;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;


/**
 * return a list of all users, excluding the system accounts, including the 'admin' account
 */
@Service
public class UserListService implements IRestService
{
    public List<com.familydam.repository.modules.auth.models.User> listUsers(Session session_, Boolean excludeAdmin_) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
            public <T> void build(QueryBuilder<T> builder) {
                builder.setSelector(User.class);
            }
        });

        boolean isFirst = true;

        List<com.familydam.repository.modules.auth.models.User> _users = new ArrayList();
        while (users.hasNext()) {
            User u = (User) users.next();

            if (u.isDisabled()) continue;
            if (excludeAdmin_ && u.getID().equalsIgnoreCase("admin")) continue;
            if (u.getID().equalsIgnoreCase("anonymous")) continue;
            //if (!u.getPath().startsWith("/home/users/system")) continue;

            Map user = new HashMap();
            Iterator<String> names = u.getPropertyNames();
            while (names.hasNext()) {
                String prop = names.next();
                user.put(prop, u.getProperty(prop)[0].getString());
            }

            user.put(Constants.JCR_ID, u.getID());
            user.put(Constants.JCR_NAME, u.getID());
            user.put(Constants.IS_FAMILY_ADMIN, false);
            user.put(Constants.IS_SYSTEM_ADMIN, false);

            if( u.hasProperty(Constants.IS_FAMILY_ADMIN) ) {
                user.put(Constants.IS_FAMILY_ADMIN, u.getProperty(Constants.IS_FAMILY_ADMIN)[0].getBoolean());
            }
            if( u.hasProperty(Constants.IS_SYSTEM_ADMIN) ) {
                user.put(Constants.IS_SYSTEM_ADMIN, u.getProperty(Constants.IS_SYSTEM_ADMIN)[0].getBoolean());
            }

            user.put(Constants.IS_DISABLED, u.isDisabled());
            if( u.hasProperty(Constants.JCR_CREATED) )user.put(Constants.JCR_CREATED, u.getProperty(Constants.JCR_CREATED)[0].getDate().getTime());


            _users.add(com.familydam.repository.modules.auth.models.User.builder().withMap(user).build());

        }

        return _users;
    }
}
