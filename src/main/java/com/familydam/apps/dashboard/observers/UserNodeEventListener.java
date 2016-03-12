/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.observers;


import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
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
@Property(name = org.osgi.service.event.EventConstants.EVENT_TOPIC,
        value = SlingConstants.TOPIC_RESOURCE_ADDED)
@Component(immediate = true)
@Service(value = EventHandler.class)
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
            if( res.getPath().startsWith("/jcr:system/rep:permissionStore/") && "rep:PermissionStore".equals(propResType) ) {
                handleNewUser(session, res, event);
            }

        }
        catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }


    }


    private void handleNewUser(Session session, Resource res, Event event) throws RepositoryException
    {
        log.trace("User " +res.getPath() +" added");
        final String userId = res.adaptTo(User.class).getPrincipal().getName();


        addToGroup(session, res);

        //todo, if the user isSuperAdmin - change the system admin password to match (keep in sync)

        // Assign user to READ access to all folders under "/content"
        assignPermissions(session, userId, new String[]{Privilege.JCR_READ} );

        // TODO: 3/7/16  - create all of the users folders, using their session. With EDIT permission for their own folders
        //userDao.createUserDirectories(session, user);

        // todo start job to generate encryption keys for the user
    }


    /**
     * Assign user to READ access to all folders under "/content"
     * @param session
     */
    private void assignPermissions(Session session, String userId, String[] privledges )
    {
        //curl -FprincipalId=myuser -Fprivilege@jcr:read=granted http://localhost:8080/test/node.modifyAce.html
        try {

            AccessControlManager accessControlManager = session.getAccessControlManager();
            PrincipalManager principalManager = getPrincipalManager(session);


            //get principle for user
            Principal _principal = principalManager.getPrincipal(userId);
            // create a privilege set with jcr:all
            Privilege[] privileges = new Privilege[] { accessControlManager.privilegeFromName(Privilege.JCR_ALL) };



            AccessControlPolicy[] ps = accessControlManager.getPolicies("/content"); // or getApplicablePolicies()
            JackrabbitAccessControlList list = (JackrabbitAccessControlList) ps[0];

            list.addEntry(_principal, privileges, true);


            // finally set policy again & save
            accessControlManager.setPolicy(list.getPath(), list);


            // and the session must be saved for the changes to be applied
            session.save();

        }catch (RepositoryException re){
            log.error(re.getMessage(), re);
        }

    }


    /**
     * Add new user to the familyGroup and maybe the family admin group
     * @param session
     * @throws RepositoryException
     */
    private void addToGroup(Session session, Resource userResource) throws RepositoryException
    {
        UserManager userManager = AccessControlUtil.getUserManager(session);
        User user = (User) userManager.getAuthorizable(userResource.getName());

        if( user != null ) {
            boolean isAdmin = user.isAdmin();
            boolean isSuperAdmin = false;
            if (user.getProperty("isSuperAdmin") != null) {
                isSuperAdmin = user.getProperty("isSuperAdmin")[0].getBoolean();
            }


            Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_GROUP);
            if (familyGroup == null) {
                familyGroup = userManager.createGroup(FamilyDAMDashboardConstants.FAMILY_GROUP);
            }
            //now add the user to the family group
            familyGroup.addMember(user);


            // if this family group is empty and this is the first user, make them an admin
            if (isAdmin || isSuperAdmin) {
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
