package com.familydam.repository.modules.auth.services;

import com.familydam.repository.Constants;
import com.familydam.repository.modules.auth.utils.KeyEncryption;
import com.familydam.repository.services.IRestService;
import com.familydam.repository.utils.NodeToMapUtil;
import com.familydam.repository.utils.jcr.AccessControlUtil;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.JackrabbitAccessControlList;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.commons.jackrabbit.authorization.AccessControlUtils;
import org.apache.jackrabbit.value.BooleanValue;
import org.apache.jackrabbit.value.StringValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlManager;
import javax.jcr.security.Privilege;
import java.security.Principal;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@Service
public class CreateUserService implements IRestService
{
    Logger log = LoggerFactory.getLogger(CreateUserService.class);

    public Map createUser(Session session_, Map user_) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Object username = user_.get(Constants.NAME).toString().toLowerCase();
        Object pwd = user_.get(Constants.PASSWORD).toString();
        Object isFamilyAdmin = Boolean.parseBoolean(user_.get(Constants.IS_FAMILY_ADMIN).toString());
        User _user = userManager.createUser((String) username, (String) pwd);


        _user.setProperty(Constants.FIRST_NAME, new StringValue((String)user_.get(Constants.FIRST_NAME)));
        _user.setProperty(Constants.LAST_NAME, new StringValue((String)user_.get(Constants.LAST_NAME)));
        //_user.setProperty(Constants.EMAIL, new StringValue((String)user_.get(Constants.EMAIL)));
        _user.setProperty(Constants.IS_FAMILY_ADMIN, new BooleanValue( (Boolean)isFamilyAdmin ));
        session_.save();


        // make sure the user has an UUID
        Node userNode = session_.getNode(_user.getPath());
        userNode.addMixin(JcrConstants.MIX_REFERENCEABLE);
        userNode.addMixin(Constants.MIXIN_DAM_EXTENSIBLE);
        userNode.addMixin(Constants.MIXIN_DAM_USER);
        session_.save();

        initializeUserFolders(session_, _user);
        //authorizePaths(session_, _user);
        session_.save();

        Map user = NodeToMapUtil.convert(userNode);
        user.put("jcr:path", userNode.getPath());

        handleNewUser(session_, userNode, user);

        log.trace("User " + userNode.getPath() + " created by " +session_.getUserID());
        return user;
    }



    private void initializeUserFolders(Session session_, User user_) throws RepositoryException {
        Node contentNode = session_.getNode("/content");
        Node contentFileNode = contentNode.getNode("files");
        Node userNode = contentFileNode.addNode(user_.getID(), NodeType.NT_FOLDER);


        //Add default sub folders to home folder
        //todo pull these from application.properties (i18n)
        userNode.addNode("Documents", NodeType.NT_FOLDER);
        userNode.addNode("Music", NodeType.NT_FOLDER);
        userNode.addNode("Movies", NodeType.NT_FOLDER);
        userNode.addNode("Photos", NodeType.NT_FOLDER);

        //setup email
        Node contentEmailNode = session_.getNode("/content/email");
        Node emailNode = contentEmailNode.addNode(user_.getID(), NodeType.NT_FOLDER);

        //setup web
        Node contentWebNode = session_.getNode("/content/web");
        Node webNode = contentWebNode.addNode(user_.getID(), NodeType.NT_FOLDER);


        //add read permission to all family root content
        assignPrivilege(session_, user_, contentNode, Privilege.JCR_READ);
        assignPrivilege(session_, user_, contentFileNode, Privilege.JCR_READ);
        //add read/write/all permision to this users files
        assignPrivilege(session_, user_, contentNode, Privilege.JCR_ALL);
        assignPrivilege(session_, user_, contentNode, Privilege.JCR_ALL);
        assignPrivilege(session_, user_, contentNode, Privilege.JCR_ALL);
    }

    private void assignPrivilege(Session session_, User user_, Node contentNode, String... privledge) throws RepositoryException {
        AccessControlManager acm = session_.getAccessControlManager();
        JackrabbitAccessControlList acl = AccessControlUtils.getAccessControlList(session_, contentNode.getPath());
        Privilege[] privileges = AccessControlUtils.privilegesFromNames(session_, privledge);
        acl.addEntry(user_.getPrincipal(), privileges, true);
        acm.setPolicy(contentNode.getPath(), acl);
    }


    private void handleNewUser(Session session, Node node_, Map user_) throws RepositoryException
    {
        //log.trace("User " +res.getPath() +" added");
        //final String userId = res.adaptTo(User.class).getPrincipal().getName();
        UserManager userManager = AccessControlUtil.getUserManager(session);
        User user = (User) userManager.getAuthorizableByPath(node_.getPath());

        if (user != null) {
            //todo, if the user isSuperAdmin - change the system admin password to match (todo: keep in sync)

            // start job to generate encryption keys for the user
            //createSecurityKeys(session, user);
        }
    }

    /**
     * Generate a public/private key for each user.
     * @param session_
     * @param user_
     * @throws RepositoryException
     *
     * @See http://www.javamex.com/tutorials/cryptography/rsa_encryption.shtml
     */
    private void createSecurityKeys(Session session_, User user_) throws RepositoryException
    {
        KeyEncryption keyEncryption = new KeyEncryption();

        try {
            Node userNode = session_.getNode(user_.getPath());
            Node securityNode = userNode.addNode("dam:security", "nt:unstructured");
            session_.save();

            keyEncryption.generateKeys(securityNode, session_);

            // remove all access for this user (Note: had to remove. With no access sling will delete on login)
            // assignPermission(session_, user_.getPrincipal(), securityNode, null, new String[]{Privilege.JCR_ALL});

        }catch(Exception ex){
            ex.printStackTrace();
        }

    }






    /**
     * Helper function to assign or remove permissions as needed
     * @param session_
     * @param principal_
     * @param node_
     * @param addPrivledges_
     * @param removePrivledges_
     */
    private void assignPermission(Session session_, Principal principal_, Node node_, String[] addPrivledges_, String[] removePrivledges_)
    {
        try {
            //setup list of privledges to add or remove
            Set<String> grantedPrivilegeNames = new HashSet<String>();
            if( addPrivledges_ != null ) {
                for (String priviledge : addPrivledges_) {
                    grantedPrivilegeNames.add(priviledge);
                }
            }

            Set<String> deniedPrivilegeNames = new HashSet<String>();
            if( removePrivledges_ != null ){
                for (String priviledge : removePrivledges_) {
                    deniedPrivilegeNames.add(priviledge);
                }
            }


            Set<String> removedPrivilegeNames = new HashSet<String>();
            if( removePrivledges_ != null ){
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
                removedPrivilegeNames.toArray(new String[removedPrivilegeNames.size()]),
                null);


            // and the session must be saved for the changes to be applied
            session_.save();


        }
        catch (RepositoryException re) {
            log.error(re.getMessage(), re);
        }
    }
}

