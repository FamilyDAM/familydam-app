/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.familydam.apps.dashboard.servlets;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import com.familydam.core.FamilyDAMCoreConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.*;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.BooleanValue;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.security.AccessControlException;
import javax.jcr.security.Privilege;
import javax.servlet.ServletException;
import java.io.IOException;
import java.security.Principal;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Hello World Servlet registered by path
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(paths = {"/api/familydam/v1/dashboard/user/create"}, metatype = true)
@Properties({
        @Property(name = "service.pid", value = "CreateUserServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CreateUserServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM", propertyPrivate = false)
})
@SuppressWarnings("serial")
public class CreateUserServlet extends SlingAllMethodsServlet {

    private final Logger log = LoggerFactory.getLogger(CreateUserServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;
    ComponentContext context;
    BundleContext bundleContext;


    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
        this.bundleContext = context.getBundleContext();
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }


    @Override
    protected void doOptions(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        super.doOptions(request, response);
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        super.doGet(request, response);
    }

    /**
     * Rest endpoint to create new users
     *
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doPost(SlingHttpServletRequest request,
                          SlingHttpServletResponse response) throws ServletException,
            IOException {

        //String[] selectors = request.getRequestPathInfo().getSelectors();
        //String extension = request.getRequestPathInfo().getExtension();
        //String resourcePath = request.getRequestPathInfo().getResourcePath();


        JackrabbitSession adminSession = null;
        UserManager userManager = null;
        try {

            Session session = request.getResourceResolver().adaptTo(Session.class);
            ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            adminSession = (JackrabbitSession) adminResolver.adaptTo(Session.class);

            boolean isFirstUser = checkFirstUser(adminSession);

            Session activeSession = session;
            if (isFirstUser) {
                // this is the first user of the system so we'll trust them and use the admin session to create the first user
                activeSession = adminSession;

                try {
                    User anonUser = (User) adminSession.getUserManager().getAuthorizable("anonymous");
                    //remove annoymous user access to /content
                    assignPermission(activeSession, anonUser.getPrincipal(), activeSession.getRootNode().getNode("content"), null, new String[]{Privilege.JCR_ALL});
                } catch (NullPointerException ex) {
                    //swallow
                }

            } else {

                // Check permission before creating the user. If they are a family admin then we'll use the admin session to create the user
                userManager = adminSession.getUserManager();
                User _user = (User) userManager.getAuthorizable(session.getUserID());
                Object isFamilyAdmin = _user.getProperty("isFamilyAdmin");
                if (isFamilyAdmin == null || !(((Value[]) isFamilyAdmin)[0].getBoolean())) {
                    response.setStatus(403);
                    response.setContentType("application/text");
                    response.getOutputStream().write("Not authorized to create new users, you need to be an 'admin' user.".getBytes());
                    return;
                }
            }

            User user = createUser(adminSession, request);//createUser(activeSession, request);
            assignToGroup(activeSession, user, request);
            createDefaultFolders(adminSession, user);
            // moved to observer: createSecurityKeys(adminSession, user);


            response.setStatus(201);
            response.setContentType("application/text");
            //response.setContentType(user.getPath());
        } catch (AccessControlException ex) {
            response.setStatus(403);
            return;
        } catch (AuthorizableExistsException aee) {
            response.setStatus(409);
        } catch (LoginException | RepositoryException ex) {

            //remove the user if the save failed at any point
            try {
                if (adminSession != null && userManager != null) {
                    userManager.getAuthorizable(((Object[]) request.getParameterMap().get(":name")).toString().toLowerCase()).remove();
                    adminSession.save();
                }
            } catch (RepositoryException re) {
                log.error(re.getMessage(), re);
            }

            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }

    }


    private boolean checkFirstUser(Session session_) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
            public <T> void build(QueryBuilder<T> builder) {
                builder.setSelector(User.class);
            }
        });

        boolean isFirst = true;

        while (users.hasNext()) {
            User u = (User) users.next();
            if (!u.getID().equalsIgnoreCase("admin") &&
                    !u.getID().equalsIgnoreCase("anonymous") &&
                    !u.getPath().startsWith("/home/users/system") &&
                    !u.isDisabled() ) {
                isFirst = true;
                break;
            }
        }

        return isFirst;
    }


    /**
     * Create a new FamilyDAM user
     *
     * @param session_
     * @param request
     * @return
     * @throws RepositoryException
     */
    private User createUser(Session session_, SlingHttpServletRequest request) throws RepositoryException, IOException {
        try {
            UserManager userManager = ((JackrabbitSession) session_).getUserManager();

            Map<String, String> _userProps;
            _userProps = new ObjectMapper().readValue(request.getInputStream(), Map.class);


            Object username = _userProps.get(":name").toString().toLowerCase();
            Object pwd = _userProps.get("pwd").toString();
            Object isFamilyAdmin = _userProps.get(FamilyDAMDashboardConstants.IS_FAMILY_ADMIN);
            User _user = userManager.createUser((String) username, (String) pwd);


            _user.setProperty(FamilyDAMDashboardConstants.FIRST_NAME, new StringValue(_userProps.get(FamilyDAMDashboardConstants.FIRST_NAME)));
            _user.setProperty(FamilyDAMDashboardConstants.LAST_NAME, new StringValue(_userProps.get(FamilyDAMDashboardConstants.LAST_NAME)));
            _user.setProperty(FamilyDAMDashboardConstants.EMAIL, new StringValue(_userProps.get(FamilyDAMDashboardConstants.EMAIL)));
            _user.setProperty(FamilyDAMDashboardConstants.IS_FAMILY_ADMIN, new BooleanValue( (Boolean)isFamilyAdmin ));

            session_.save();


            // make sure the user has an UUID
            Node userNode = session_.getNode(_user.getPath());
            userNode.addMixin(JcrConstants.MIX_REFERENCEABLE);
            userNode.addMixin("dam:extensible");
            userNode.addMixin("dam:user");
            session_.save();


            return _user;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }


    /**
     * Add the user to the right family User group
     *
     * @param session_
     * @param user_
     * @param request_
     * @throws RepositoryException
     */
    private void assignToGroup(Session session_, User user_, SlingHttpServletRequest request_) throws RepositoryException {
        //user of a "user administrators" group

        UserManager userManager = ((JackrabbitSession) session_).getUserManager();
        Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMCoreConstants.FAMILY_GROUP);
        if (familyGroup == null) {
            familyGroup = userManager.createGroup(FamilyDAMCoreConstants.FAMILY_GROUP);
        }
        //now add the user to the family group
        familyGroup.addMember(user_);


        // if this family group is empty and this is the first user, make them an admin
        if (user_.isAdmin() || (user_.getProperty(FamilyDAMCoreConstants.IS_FAMILY_ADMIN) != null && user_.getProperty(FamilyDAMCoreConstants.IS_FAMILY_ADMIN)[0].getBoolean())) {
            Group familyAdminGroup = (Group) userManager.getAuthorizable(FamilyDAMCoreConstants.FAMILY_ADMIN_GROUP);
            if (familyAdminGroup == null) {
                familyAdminGroup = userManager.createGroup(FamilyDAMCoreConstants.FAMILY_ADMIN_GROUP);
            }
            user_.setProperty("isFamilyAdmin", new BooleanValue(true));
            familyAdminGroup.addMember(user_);
            //If the user is an admin give them jcr_all permissions to the whole system
            assignPermission(session_, user_.getPrincipal(), session_.getRootNode(), new String[]{Privilege.JCR_ALL}, null);

        } else {
            // If they aren't an admin start with read access to /content
            assignPermission(session_, user_.getPrincipal(), session_.getRootNode().getNode("home"), new String[]{Privilege.JCR_READ}, new String[]{Privilege.JCR_WRITE});
            assignPermission(session_, user_.getPrincipal(), session_.getRootNode().getNode("content"), new String[]{Privilege.JCR_READ}, null);
        }

        session_.save();
    }


    private void createDefaultFolders(Session session_, User user_) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();
        Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMCoreConstants.FAMILY_GROUP);


        //find system folder (parent folders)
        QueryManager queryManager = session_.getWorkspace().getQueryManager();

        // find all DAM Content Folders, we'll add a user folder to each one
        Query query = queryManager.createQuery("SELECT * FROM [dam:contentfolder] AS s", "sql");

        // Execute the query and get the results ...
        QueryResult result = query.execute();


        javax.jcr.NodeIterator nodeItr = result.getNodes();
        while (nodeItr.hasNext()) {
            Node node = nodeItr.nextNode();

            if (!node.getPath().equals("/")) {

                Node _node = JcrUtils.getOrAddNode(node, user_.getID(), "sling:Folder");
                _node.addMixin("mix:created");
                _node.addMixin("dam:extensible");
                _node.addMixin("dam:userfolder");
                _node.addMixin("mix:versionable");

                createDefaultFileFolders(_node);

                _node.setProperty(JcrConstants.JCR_NAME, user_.getID());
                session_.save();

                assignPermission(session_, user_.getPrincipal(), _node, new String[]{Privilege.JCR_ALL}, null);
            }

        }


        // commit new folders.
        session_.save();
    }


    /**
     * Create some default folders under /content/dam-files
     *
     * @param node
     * @throws RepositoryException
     */
    private void createDefaultFileFolders(Node node) throws RepositoryException {
        String[] folders = new String[]{"Documents", "Movies", "Music", "Photos"};

        for (String folder : folders) {
            Node _node = JcrUtils.getOrAddNode(node, folder, "sling:Folder");
            _node.addMixin("mix:created");
            _node.addMixin("dam:extensible");
            _node.addMixin("dam:folder");
        }
    }


    /**
     * Helper function to assign or remove permissions as needed
     *
     * @param session_
     * @param principal_
     * @param node_
     * @param addPrivledges_
     * @param removePrivledges_
     */
    private void assignPermission(Session session_, Principal principal_, Node node_, String[] addPrivledges_, String[] removePrivledges_) {
        try {
            //setup list of privledges to add or remove
            Set<String> grantedPrivilegeNames = new HashSet<String>();
            if (addPrivledges_ != null) {
                for (String priviledge : addPrivledges_) {
                    grantedPrivilegeNames.add(priviledge);
                }
            }

            Set<String> deniedPrivilegeNames = new HashSet<String>();
            if (removePrivledges_ != null) {
                for (String priviledge : removePrivledges_) {
                    deniedPrivilegeNames.add(priviledge);
                }
            }


            Set<String> removedPrivilegeNames = new HashSet<String>();
            if (removePrivledges_ != null) {
                for (String priviledge : removePrivledges_) {
                    removedPrivilegeNames.add(priviledge);
                }
            }


            // finally set policy again & save
            //accessControlManager.setPolicy(list.getPath(), list);

            AccessControlUtil.replaceAccessControlEntry(session_,
                    node_.getPath(), principal_,
                    grantedPrivilegeNames.toArray(new String[grantedPrivilegeNames.size()]),
                    deniedPrivilegeNames.toArray(new String[deniedPrivilegeNames.size()]),
                    removedPrivilegeNames.toArray(new String[removedPrivilegeNames.size()]));


            // and the session must be saved for the changes to be applied
            session_.save();

        } catch (RepositoryException re) {
            log.error(re.getMessage(), re);
        }
    }

}

