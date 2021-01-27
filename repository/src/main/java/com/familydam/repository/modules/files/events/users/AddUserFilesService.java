package com.familydam.repository.modules.files.events.users;

import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.services.IEventService;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.JackrabbitAccessControlList;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.commons.jackrabbit.authorization.AccessControlUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import javax.jcr.security.AccessControlManager;
import javax.jcr.security.Privilege;

@Service
@Lazy(value = false)
public class AddUserFilesService implements EventListener, IEventService {
    Logger log = LoggerFactory.getLogger(AddUserFilesService.class);

    public Repository repository;
    public AdminUser adminUser;

    public AddUserFilesService(Repository repository, AdminUser adminUser) {
        this.repository = repository;
        this.adminUser = adminUser;
    }

    @PostConstruct
    public void activate() throws RepositoryException {
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        ObservationManager om = session.getWorkspace().getObservationManager();
        om.addEventListener(this, Event.NODE_ADDED, "/rep:security/rep:authorizables/rep:users", true, null, null, false);
        session.save();
        log.debug("AddUserFiles Event Listener Registered");
    }


    @Override
    public void onEvent(EventIterator events) {
        while (events.hasNext()) {
            Event event = events.nextEvent();
            if (Event.NODE_ADDED == event.getType()) {
                try {
                    process(event.getPath());
                } catch (RepositoryException ex) {
                    log.error(ex.getMessage(), ex);
                }
            }
        }
    }


    @Override
    public void process(String path) {
        try {
            Session adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
            Node node = adminSession.getNode(path);
            if( adminSession.getNode(path).getPrimaryNodeType().getName().equals("rep:User") ){
                UserManager userManager = ((JackrabbitSession) adminSession).getUserManager();
                Authorizable authorizable = userManager.getAuthorizable(node.getName());
                initializeUserFolders(adminSession, ((User)authorizable));
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }



    private void initializeUserFolders(Session session_, User user_) throws RepositoryException {
        Node contentNode = session_.getNode("/content");
        Node contentFileNode = contentNode.getNode("files");
        Node userNode = contentFileNode.addNode(user_.getID(), NodeType.NT_FOLDER);


        //Add default sub folders to home folder
        //todo pull these from application.properties (i18n)
        Node n1 = userNode.addNode("Documents", NodeType.NT_FOLDER);
        Node n2 = userNode.addNode("Music", NodeType.NT_FOLDER);
        Node n3 = userNode.addNode("Movies", NodeType.NT_FOLDER);
        Node n4 = userNode.addNode("Photos", NodeType.NT_FOLDER);


        //add read permission to all family root content
        assignPrivilege(session_, user_, contentNode, Privilege.JCR_READ);
        assignPrivilege(session_, user_, contentFileNode, Privilege.JCR_READ);
        //Give all permissions, but effectively delete for the user root
        assignPrivilege(session_, user_, userNode, Privilege.JCR_READ);
        assignPrivilege(session_, user_, userNode, Privilege.JCR_MODIFY_ACCESS_CONTROL);
        assignPrivilege(session_, user_, userNode, Privilege.JCR_ADD_CHILD_NODES);
        assignPrivilege(session_, user_, userNode, Privilege.JCR_REMOVE_CHILD_NODES);
        assignPrivilege(session_, user_, userNode, Privilege.JCR_MODIFY_PROPERTIES);
        assignPrivilege(session_, user_, userNode, Privilege.JCR_VERSION_MANAGEMENT);
        //add read/write/all permision to this users files
        assignPrivilege(session_, user_, n1, Privilege.JCR_ALL);
        assignPrivilege(session_, user_, n2, Privilege.JCR_ALL);
        assignPrivilege(session_, user_, n3, Privilege.JCR_ALL);
        assignPrivilege(session_, user_, n4, Privilege.JCR_ALL);

        session_.save();
    }

    private void assignPrivilege(Session session_, User user_, Node contentNode, String... privledge) throws RepositoryException {
        AccessControlManager acm = session_.getAccessControlManager();
        JackrabbitAccessControlList acl = AccessControlUtils.getAccessControlList(session_, contentNode.getPath());
        Privilege[] privileges = AccessControlUtils.privilegesFromNames(session_, privledge);
        acl.addEntry(user_.getPrincipal(), privileges, true);
        acm.setPolicy(contentNode.getPath(), acl);
    }
}

