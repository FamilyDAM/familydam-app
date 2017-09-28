package com.familydam.apps.files.events;

import com.familydam.core.FamilyDAMCoreConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.api.SlingRepository;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;
import java.util.Arrays;

@Component(immediate = true)
@Service
public class AddFileMixinListener implements EventListener {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    private BundleContext bundleContext;


    @Reference
    private SlingRepository repository;

    //Inject a Sling ResourceResolverFactory
    @Reference
    private ResourceResolverFactory resolverFactory;

    private Session session;

    private ObservationManager observationManager;


    //Place app logic here to define the AEM Custom Event Handler
    protected void activate(ComponentContext ctx) {
        this.bundleContext = ctx.getBundleContext();

        try {
            //Invoke the adaptTo method to create a Session
            // ResourceResolver resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
            session = repository.loginAdministrative(null);

            // Setup the event handler to respond to a new claim under content/claim....
            observationManager = session.getWorkspace().getObservationManager();
            final String[] types = {"nt:file", "sling:File"};
            final String path = "/content"; // define the path
            observationManager.addEventListener(this, Event.NODE_ADDED, path, true, null, null, false);
            log.info("Observing property changes to {} nodes under {}", Arrays.asList(types), path);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    protected void deactivate(ComponentContext componentContext) throws RepositoryException {
        if (observationManager != null) {
            observationManager.removeEventListener(this);
        }
        if (session != null) {
            session.logout();
            session = null;
        }
    }



    boolean isSupported(Event event) throws RepositoryException {
        if (Event.NODE_ADDED == event.getType()) {
            if( event.getPath().startsWith("/content") ){
                if( !event.getPath().endsWith(JcrConstants.JCR_CONTENT)) {
                    return true;
                }
            }
        }
        return false;
    }


    @Override
    public void onEvent(EventIterator events) {

        while (events.hasNext()) {
            Event event = events.nextEvent();


                try {
                    if( isSupported(event) ){

                        Session session = repository.loginAdministrative(null);
                        ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);

                        // save the session, before changing props
                        if (session.hasPendingChanges()) {
                            session.save();
                        }

                        Node node = session.getNodeByIdentifier(event.getIdentifier());//JcrUtils.getNodeIfExists(event.getPath(), session);
                        node.addMixin(NodeType.MIX_LOCKABLE);
                        node.addMixin(NodeType.MIX_REFERENCEABLE);
                        node.addMixin(NodeType.MIX_LAST_MODIFIED);
                        node.addMixin(FamilyDAMCoreConstants.DAM_FILE);
                        node.addMixin(FamilyDAMCoreConstants.DAM_EXTENSIBLE);


                        final Resource res = adminResolver.getResource(event.getPath());
                        final String mimeType = res.getResourceMetadata().getContentType();
                        //log.trace(propPath + " | mimetype=" + mimeType);

                        if (mimeType.startsWith("image")) {
                            node.addMixin(FamilyDAMCoreConstants.DAM_IMAGE);
                            node.addMixin(FamilyDAMCoreConstants.DAM_TAGGABLE);
                            node.addMixin(NodeType.MIX_VERSIONABLE);
                            //save mixin changes
                        }
                        else if (mimeType.startsWith("video")) {
                            node.addMixin(FamilyDAMCoreConstants.DAM_VIDEO);
                            node.addMixin(FamilyDAMCoreConstants.DAM_TAGGABLE);
                            node.addMixin(NodeType.MIX_VERSIONABLE);
                            //save mixin changes
                        }
                        else if (mimeType.startsWith("audio")) {
                            node.addMixin(FamilyDAMCoreConstants.DAM_MUSIC);
                            node.addMixin(FamilyDAMCoreConstants.DAM_TAGGABLE);
                            node.addMixin(NodeType.MIX_VERSIONABLE);
                            //save mixin changes
                        }

                        session.save();
                    }

                } catch (Exception ex) {
                    log.error(ex.getMessage(), ex);
                }

        }
    }



}

