package com.familydam.bundle.sync.cron.twitter;

import com.familydam.bundle.sync.services.twitter.TwitterSyncService;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Dictionary;

/**
 * Created by mike on 2/16/17.
 */
@Component(metatype = true, immediate = true)
@Service(value = Runnable.class)
@Properties({
        @Property(name = "scheduler.expression", value = "0 0 0/1 * * ?"), //every hour
        @Property(name = "scheduler.concurrent", boolValue = false),
        @Property(name = "scheduler.runOn", value = "SINGLE"),
        @Property(name = "service.enabled", boolValue = true, label = "Enabled", description = "Enable/Disable the Scheduled Service"),
})
public class SyncLatestUserTimeline implements Runnable {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Reference
    private TwitterSyncService twitterSyncService;

    private Boolean enabled;
    private String queueUrl;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.enabled = PropertiesUtil.toBoolean(props.get("service.enabled"), true);

        run(); //run on startup
    }


    @Override
    public void run() {

        if (this.enabled) {

            // Sync user posts
            twitterSyncService.syncUserPosts(true);

        }

    }

}
