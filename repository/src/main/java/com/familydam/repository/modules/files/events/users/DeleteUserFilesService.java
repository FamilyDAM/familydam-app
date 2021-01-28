package com.familydam.repository.modules.files.events.users;

import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.services.IEventService;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.jcr.*;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;

@Service
@Lazy(value = false)
public class DeleteUserFilesService implements EventListener, IEventService {
    Logger log = LoggerFactory.getLogger(DeleteUserFilesService.class);

    public Repository repository;
    public AdminUser adminUser;

    public DeleteUserFilesService(AdminUser adminUser, Repository repository) {
        this.adminUser = adminUser;
        this.repository = repository;
    }

    @PostConstruct
    public void activate() throws RepositoryException {
        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        ObservationManager om = session.getWorkspace().getObservationManager();
        om.addEventListener(this, Event.NODE_REMOVED, "/rep:security/rep:authorizables/rep:users", true, null, null, false);
        session.save();
        log.debug("DeleteUserFiles Event Listener Registered");
    }


    @Override
    public void onEvent(EventIterator events) {
        while (events.hasNext()) {
            Event event = events.nextEvent();
            if (Event.NODE_REMOVED == event.getType()) {
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
            UserManager userManager = ((JackrabbitSession) adminSession).getUserManager();
            Authorizable authorizable = userManager.getAuthorizable(path);

            String name = path.substring(path.lastIndexOf("/")+1);

            Node contentNode = adminSession.getNode("/content");
            Node contentFileNode = contentNode.getNode("files");
            Node userFileNode = contentFileNode.getNode(name);
            userFileNode.remove();
            adminSession.save();


        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }
    
}

