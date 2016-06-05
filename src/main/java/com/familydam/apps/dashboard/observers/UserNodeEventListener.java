/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.observers;


import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.api.security.JackrabbitAccessControlList;
import org.apache.jackrabbit.api.security.principal.PrincipalManager;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.security.AccessControlManager;
import javax.jcr.security.AccessControlPolicy;
import javax.jcr.security.Privilege;
import java.security.Principal;

import static org.apache.sling.jcr.base.util.AccessControlUtil.getPrincipalManager;

/**
 * Created by mnimer on 3/4/16.
 */
//@Component(immediate = true)
//@Service(value = EventHandler.class)
//@Property(name = org.osgi.service.event.EventConstants.EVENT_TOPIC, value = SlingConstants.TOPIC_RESOURCE_ADDED)
public class UserNodeEventListener implements EventHandler
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;


    @Override public void handleEvent(Event event)
    {
        final String propPath = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        final String propResType = (String) event.getProperty(SlingConstants.PROPERTY_RESOURCE_TYPE);
        final String userId = (String) event.getProperty(SlingConstants.PROPERTY_USERID);


        ResourceResolver adminResolver = null;

        try {
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);

            final Resource res = adminResolver.getResource(propPath);
            if (res.getPath().startsWith("/jcr:system/rep:permissionStore/") && "rep:PermissionStore".equals(propResType)) {
                handleNewUser(session, res, event);
            }

        }
        catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }


    }


    private void handleNewUser(Session session, Resource res, Event event) throws RepositoryException
    {
        //log.trace("User " +res.getPath() +" added");
        //final String userId = res.adaptTo(User.class).getPrincipal().getName();
        UserManager userManager = AccessControlUtil.getUserManager(session);
        User user = (User) userManager.getAuthorizable(res.getName());

        if (user != null) {
            log.trace("User " + user.getPath() + " added");

            addToGroup(session, user);

            //todo, if the user isSuperAdmin - change the system admin password to match (keep in sync)

            // Assign user to READ access to all folders under "/content"
            assignPermissions(session, user, new String[]{Privilege.JCR_READ});

            // TODO: 3/7/16  - create all of the users folders, using their session. With EDIT permission for their own folders
            //userDao.createUserDirectories(session, user);

            // todo start job to generate encryption keys for the user
        }
    }


    /**
     * Assign user to READ access to all folders under "/content"
     *
     * @param session
     */
    private void assignPermissions(Session session, User user, String[] privledges)
    {
        //curl -FprincipalId=myuser -Fprivilege@jcr:read=granted http://localhost:8080/test/node.modifyAce.html
        try {
            UserManager userManager = AccessControlUtil.getUserManager(session);
            Group familyAdminGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_ADMIN_GROUP);


            AccessControlManager accessControlManager = session.getAccessControlManager();
            PrincipalManager principalManager = getPrincipalManager(session);


            //get principle for user
            Principal _principal = principalManager.getPrincipal(user.getID());
            // create a privilege set with jcr:all
            Privilege[] privileges = new Privilege[]{accessControlManager.privilegeFromName(Privilege.JCR_READ)};
            if (familyAdminGroup.isMember(user)) {
                privileges = new Privilege[]{accessControlManager.privilegeFromName(Privilege.JCR_ALL)};
            }

            AccessControlPolicy[] psRoot = accessControlManager.getPolicies("/"); // or getApplicablePolicies()
            JackrabbitAccessControlList list = (JackrabbitAccessControlList) psRoot[0];

            list.addEntry(_principal, privileges, true);


            // finally set policy again & save
            accessControlManager.setPolicy(list.getPath(), list);


            // and the session must be saved for the changes to be applied
            session.save();

        }
        catch (RepositoryException re) {
            log.error(re.getMessage(), re);
        }

    }


    /**
     * Add new user to the familyGroup and maybe the family admin group
     *
     * @param session
     * @throws RepositoryException
     */
    private void addToGroup(Session session, User user) throws RepositoryException
    {
        UserManager userManager = AccessControlUtil.getUserManager(session);

        if (user != null) {
            boolean isJcrAdmin = user.isAdmin();
            boolean isFamilyAdmin = false;
            if (user.getProperty("isFamilyAdmin") != null) {
                isFamilyAdmin = user.getProperty("isFamilyAdmin")[0].getBoolean();
            }


            Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_GROUP);
            if (familyGroup == null) {
                familyGroup = userManager.createGroup(FamilyDAMDashboardConstants.FAMILY_GROUP);
            }
            //now add the user to the family group
            familyGroup.addMember(user);


            // if this family group is empty and this is the first user, make them an admin
            if (isJcrAdmin || isFamilyAdmin) {
                Group familyAdminGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_ADMIN_GROUP);
                if (familyAdminGroup == null) {
                    familyAdminGroup = userManager.createGroup(FamilyDAMDashboardConstants.FAMILY_ADMIN_GROUP);
                }
                familyAdminGroup.addMember(user);

                //TODO: add USER to the default system administrators group
                //TODO: add jcr:all policy to the jcr root
            }

            session.save();
        }
    }

}
