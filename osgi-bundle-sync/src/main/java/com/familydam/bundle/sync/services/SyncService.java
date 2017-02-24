package com.familydam.bundle.sync.services;

import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Iterator;

/**
 * Created by mike on 2/16/17.
 */
public class SyncService
{


    public ResourceResolver getResourceResolver(ResourceResolverFactory resolverFactory) throws LoginException {
        JackrabbitSession adminSession = null;
        UserManager userManager = null;

        ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
        return adminResolver;
    }


    public Session getAdminSession(ResourceResolver adminResolver) throws LoginException {
        return (JackrabbitSession) adminResolver.adaptTo(Session.class);
    }


    public Iterator<Authorizable> getUsers(JackrabbitSession adminSession) throws RepositoryException {
        UserManager userManager = adminSession.getUserManager();
        return userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
            public <T> void build(QueryBuilder<T> builder) {
                builder.setCondition(builder.neq("rep:principalName", new StringValue("anonymous")));
                builder.setCondition(builder.and(builder.neq("rep:principalName", new StringValue("admin")), builder.neq("rep:principalName", new StringValue("anonymous"))));
                builder.setSortOrder("@rep:principalName", QueryBuilder.Direction.ASCENDING);
                builder.setSelector(User.class);
            }
        });
    }

}
