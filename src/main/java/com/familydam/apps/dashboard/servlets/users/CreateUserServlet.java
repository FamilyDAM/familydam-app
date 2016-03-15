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
package com.familydam.apps.dashboard.servlets.users;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.AuthorizableExistsException;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.BooleanValue;
import org.apache.jackrabbit.value.DateValue;
import org.apache.jackrabbit.value.DoubleValue;
import org.apache.jackrabbit.value.LongValue;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.security.Privilege;
import javax.servlet.ServletException;
import java.io.IOException;
import java.security.Principal;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import static com.familydam.apps.dashboard.FamilyDAMDashboardConstants.IS_ROOT_ADMIN;

/**
 * Hello World Servlet registered by path
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(
        paths = {"/familydam/api/v1/users"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.CreateUserServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "CreateUserServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
@SuppressWarnings("serial")
public class CreateUserServlet extends SlingAllMethodsServlet
{

    private final Logger log = LoggerFactory.getLogger(CreateUserServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;


    /**
     * Rest endpoint to create new users
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doPost(SlingHttpServletRequest request,
                          SlingHttpServletResponse response) throws ServletException,
            IOException
    {

        //String[] selectors = request.getRequestPathInfo().getSelectors();
        //String extension = request.getRequestPathInfo().getExtension();
        //String resourcePath = request.getRequestPathInfo().getResourcePath();


        try {

            Session session = request.getResourceResolver().adaptTo(Session.class);
            ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session adminSession = adminResolver.adaptTo(Session.class);

            boolean isFirstUser = checkFirstUser(adminSession);

            Session activeSession = session;
            if (isFirstUser) {
                // this is the first user of the system so we'll trust them and use the admin session to create the first user
                activeSession = adminSession;
            }

            User user = createUser(activeSession, request);
            assignToGroup(activeSession, user, request);
            createDefaultFolders(adminSession, user);

            response.setStatus(201);
            response.setContentType("application/text");
            response.setContentType(user.getPath());
        }
        catch ( AuthorizableExistsException aee ){
            response.setStatus(409);
        }
        catch ( LoginException | RepositoryException ex) {
            log.error(ex.getMessage(), ex);
            response.setStatus(500);
        }

    }


    private boolean checkFirstUser(Session session_) throws RepositoryException
    {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query()
        {
            public <T> void build(QueryBuilder<T> builder)
            {
                builder.setCondition(builder.neq("rep:principalName", new StringValue("anonymous")));
                builder.setCondition(builder.and(builder.neq("rep:principalName", new StringValue("admin")), builder.neq("rep:principalName", new StringValue("anonymous"))));
                builder.setSortOrder("@rep:principalName", QueryBuilder.Direction.ASCENDING);
                builder.setSelector(User.class);
            }
        });

        return !users.hasNext();
    }


    /**
     * Create a new FamilyDAM user
     * @param session_
     * @param request
     * @return
     * @throws RepositoryException
     */
    private User createUser(Session session_, SlingHttpServletRequest request) throws RepositoryException
    {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Map<Object,Object[]> _userProps = request.getParameterMap();

        User _user = userManager.createUser(_userProps.get(":name")[0].toString().toLowerCase(), _userProps.get("pwd")[0].toString());

        for (Object key : _userProps.keySet()) {

            if( key.toString().equalsIgnoreCase(":name") || key.toString().equalsIgnoreCase("pwd") || key.toString().equalsIgnoreCase("pwdConfirm")){
                continue;
            }

            if (_userProps.get(key)[0] instanceof Double[]) {
                _user.setProperty(key.toString(), new DoubleValue((Double) _userProps.get(key)[0]));
            } else if (_userProps.get(key)[0] instanceof Boolean) {
                _user.setProperty(key.toString(), new BooleanValue((Boolean) _userProps.get(key)[0]));
            } else if (_userProps.get(key)[0] instanceof Long) {
                _user.setProperty(key.toString(), new LongValue((Long) _userProps.get(key)[0]));
            } else if (_userProps.get(key)[0] instanceof Date) {
                Calendar _cal = Calendar.getInstance();
                _cal.setTime((Date) _userProps.get(key)[0]);
                _user.setProperty(key.toString(), new DateValue(_cal));
            } else {
                _user.setProperty(key.toString(), new StringValue(_userProps.get(key)[0].toString()));

            }
        }

        session_.save();


        // make sure the user has an UUID
        Node userNode = session_.getNode(_user.getPath());
        userNode.addMixin(JcrConstants.MIX_REFERENCEABLE);
        session_.save();


        return _user;
    }


    /**
     * Add the user to the right family User group
     * @param session_
     * @param user_
     * @param request_
     * @throws RepositoryException
     */
    private void assignToGroup(Session session_, User user_, SlingHttpServletRequest request_) throws RepositoryException
    {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();
        Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_GROUP);
        if (familyGroup == null) {
            familyGroup = userManager.createGroup(FamilyDAMDashboardConstants.FAMILY_GROUP);
        }
        //now add the user to the family group
        familyGroup.addMember(user_);



        // if this family group is empty and this is the first user, make them an admin
        if (user_.isAdmin() || (user_.getProperty(IS_ROOT_ADMIN) != null && user_.getProperty(IS_ROOT_ADMIN)[0].getBoolean())) {
            Group familyAdminGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_ADMIN_GROUP);
            if (familyAdminGroup == null) {
                familyAdminGroup = userManager.createGroup(FamilyDAMDashboardConstants.FAMILY_ADMIN_GROUP);
            }
            familyAdminGroup.addMember(user_);
            //If the user is an admin give them jcr_all permissions to the whole system
            assignPermission(session_, user_, session_.getRootNode(), new String[]{Privilege.JCR_ALL}, null);
        }


        //TODO: add USER to the default system administrators group
        //TODO: add jcr:all policy to the jcr root

        session_.save();
    }


    private void createDefaultFolders(Session session_, User user_) throws RepositoryException
    {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();
        Group familyGroup = (Group) userManager.getAuthorizable(FamilyDAMDashboardConstants.FAMILY_GROUP);


        //find system folder (parent folders)
        QueryManager queryManager = session_.getWorkspace().getQueryManager();

        // find all DAM Content Folders, we'll add a user folder to each one
        Query query = queryManager.createQuery("SELECT * FROM [dam:contentfolder] AS s", "sql");

        // Execute the query and get the results ...
        QueryResult result = query.execute();


        javax.jcr.NodeIterator nodeItr = result.getNodes();
        while (nodeItr.hasNext()) {
            javax.jcr.Node node = nodeItr.nextNode();

            if (!node.getPath().equals("/")) {

                Node _node = JcrUtils.getOrAddNode(node, user_.getID(), JcrConstants.NT_FOLDER);
                _node.addMixin("mix:created");
                _node.addMixin("dam:extensible");
                _node.addMixin("dam:userfolder");

                if( node.getName().equals("dam-files") || node.getName().equals("dam-cloud")) {
                    _node.addMixin("mix:versionable");
                }
                _node.setProperty(JcrConstants.JCR_NAME, user_.getID());
                session_.save();

                assignPermission(session_, user_, _node, new String[]{Privilege.JCR_ALL}, null);
            }

            // give all users READ only access to the FamilyDAM contentfolder
            assignPermission(session_, user_, node, new String[]{Privilege.JCR_READ}, null);
        }


        // commit new folders.
        session_.save();
    }


    private void assignPermission(Session session_, User user_, Node node_, String[] addPrivledges_, String[] removePrivledges_)
    {
        try {
            //get principle for user
            Principal _principal = user_.getPrincipal();


            //setup list of privledges to add or remove
            Set<String> grantedPrivilegeNames = new HashSet<String>();
            if( addPrivledges_ != null ) {
                for (String priviledge : addPrivledges_) {
                    grantedPrivilegeNames.add(priviledge);
                }
            }
            Set<String> deniedPrivilegeNames = new HashSet<String>();
            Set<String> removedPrivilegeNames = new HashSet<String>();
            if( removePrivledges_ != null ){
                for (String priviledge : removePrivledges_) {
                    removedPrivilegeNames.add(priviledge);
                }
            }


            // finally set policy again & save
            //accessControlManager.setPolicy(list.getPath(), list);

            AccessControlUtil.replaceAccessControlEntry(session_,
                    node_.getPath(), _principal,
                    grantedPrivilegeNames.toArray(new String[grantedPrivilegeNames.size()]),
                    deniedPrivilegeNames.toArray(new String[deniedPrivilegeNames.size()]),
                    removedPrivilegeNames.toArray(new String[removedPrivilegeNames.size()]));


            // and the session must be saved for the changes to be applied
            session_.save();

        }
        catch (RepositoryException re) {
            log.error(re.getMessage(), re);
        }
    }

}

