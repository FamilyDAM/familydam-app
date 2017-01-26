package com.familydam.apps.photos.cron;

import com.familydam.apps.photos.services.DateCreatedIndexGenerator;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

/**
 * Created by mike on 12/18/16.
 */
@Component(immediate = true)
@Service(value = Runnable.class)
@Properties({
        @Property(name = "scheduler.period", value = "0 0/4 * * *"), //every 15mins
        @Property(name="scheduler.concurrent", boolValue=false)
})
public class FamilyDAMEventsCronJob  implements Runnable
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    @Reference
    DateCreatedIndexGenerator indexGenerator;

    @Override
    public void run() {
        try {
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);

            //TODO
        }catch (org.apache.sling.api.resource.LoginException|RepositoryException le){
            logger.error(le.getMessage(), le);
        }
    }


}
