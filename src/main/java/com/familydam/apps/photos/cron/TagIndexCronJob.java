package com.familydam.apps.photos.cron;

import com.familydam.apps.photos.services.TagIndexGenerator;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

/**
 * Created by mike on 12/18/16.
 */
@Component
@Service(value = Runnable.class)
@org.apache.felix.scr.annotations.Properties({
        @org.apache.felix.scr.annotations.Property(name = "scheduler.period", value = "15 0 * * *"), //12:15am
        @org.apache.felix.scr.annotations.Property(name="scheduler.concurrent", boolValue=false)
})
public class TagIndexCronJob implements Runnable {

    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    TagIndexGenerator indexGenerator;


    @Override
    public void run() {
        try {
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);

            indexGenerator.rebuild(session);
        }catch (org.apache.sling.api.resource.LoginException|RepositoryException le){
            logger.error(le.getMessage(), le);
        }
    }

}
