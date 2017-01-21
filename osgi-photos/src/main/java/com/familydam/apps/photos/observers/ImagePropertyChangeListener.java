package com.familydam.apps.photos.observers;

import com.familydam.apps.photos.services.PeopleIndexGenerator;
import com.familydam.apps.photos.services.TagIndexGenerator;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.observation.ExternalResourceChangeListener;
import org.apache.sling.api.resource.observation.ResourceChange;
import org.apache.sling.api.resource.observation.ResourceChangeListener;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.osgi.service.event.EventAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.util.List;

/**
 * Created by mike on 11/14/16.
 */
@Component(immediate = true, metatype = true)
@Service(value = {ResourceChangeListener.class, ImagePropertyChangeListener.class})
@Properties({
        @Property(name = ResourceChangeListener.CHANGES, value = {"ADDED","CHANGED", "REMOVED"}),
        @Property(name = ResourceChangeListener.PATHS, value = {"/content"})
})
public class ImagePropertyChangeListener implements ResourceChangeListener, ExternalResourceChangeListener
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /** The event admin. */
    @Reference
    private EventAdmin eventAdmin;

    /** Service registration for the event handler. */
    private volatile ServiceRegistration listenerRegistration;

    @Reference
    private ResourceResolverFactory resolverFactory;

    private PeopleIndexGenerator peopleIndexGenerator;
    private TagIndexGenerator tagIndexGenerator;

    @Activate
    protected void activate(final BundleContext bundleContext) {
        bundleContext.toString();
        //final Dictionary<String, Object> properties = new Hashtable<String, Object>();
        //properties.put(Constants.SERVICE_DESCRIPTION, "Apache Sling Job Topic Manager Event Handler");
        //properties.put(Constants.SERVICE_VENDOR, "The Apache Software Foundation");
        //properties.put(ResourceChangeListener.CHANGES, new String[]{ResourceChange.ChangeType.ADDED.toString(), ResourceChange.ChangeType.CHANGED.toString()});
        //properties.put(ResourceChangeListener.PATHS, "/content");
        //this.listenerRegistration = bundleContext.registerService(ResourceChangeListener.class.getName(), this, properties);

        peopleIndexGenerator = new PeopleIndexGenerator();
        tagIndexGenerator = new TagIndexGenerator();
    }

    /**
     * Deactivate this component.
     * Unregister the event handler.
     */
    @Deactivate
    protected void deactivate() {
        if ( this.listenerRegistration != null ) {
            this.listenerRegistration.unregister();
            this.listenerRegistration = null;
        }
    }


    @Override
    public void onChange(List<ResourceChange> changes) {

        try {
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);


            for (ResourceChange change : changes) {

                //Resource res = adminResolver.getResource(change.getPath());
                Node node = JcrUtils.getNodeIfExists(change.getPath(), session);

                if (!change.isExternal()) {
                    if( change.getAddedPropertyNames() != null ) {
                        for (String key : change.getAddedPropertyNames()) {

                            if (key.equalsIgnoreCase("dam:people")) {

                                javax.jcr.Property prop = node.getProperty(key);
                                Value[] values = prop.getValues();

                                for (Value value : values) {
                                    peopleIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                }

                            } else if (key.equalsIgnoreCase("dam:tags")) {

                                javax.jcr.Property prop = node.getProperty(key);
                                Value[] values = prop.getValues();

                                for (Value value : values) {
                                    tagIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                }

                            }
                        }
                    }



                    if( change.getChangedPropertyNames() != null ) {
                        for (String key : change.getChangedPropertyNames()) {

                            if (key.equalsIgnoreCase("dam:people")) {

                                javax.jcr.Property prop = node.getProperty(key);
                                Value[] values = prop.getValues();

                                for (Value value : values) {
                                    peopleIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                }

                            } else if (key.equalsIgnoreCase("dam:tags")) {

                                javax.jcr.Property prop = node.getProperty(key);
                                Value[] values = prop.getValues();

                                for (Value value : values) {
                                    tagIndexGenerator.addToIndex(session, new String[]{value.getString()});
                                }

                            }
                        }
                    }


                }
            }
        }catch(LoginException|RepositoryException le){
            logger.error(le.getMessage(), le);
        }

    }
}

