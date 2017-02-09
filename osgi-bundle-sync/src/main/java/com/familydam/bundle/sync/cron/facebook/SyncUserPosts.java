package com.familydam.bundle.sync.cron.facebook;

import com.familydam.bundle.sync.FamilyDAMSyncConstants;
import com.familydam.bundle.sync.services.facebook.FacebookSyncService;
import com.familydam.core.FamilyDAMCoreConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.http.HttpEntity;
import org.apache.http.HttpVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.fluent.Request;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.resource.*;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.familydam.bundle.sync.FamilyDAMSyncConstants.ACCESS_TOKEN;
import static com.familydam.bundle.sync.FamilyDAMSyncConstants.JWT_TOKEN;
import static org.apache.jackrabbit.JcrConstants.NT_UNSTRUCTURED;

/**
 * Created by mike on 1/26/17.
 *
 * @see - http://www.docjar.com/docs/api/org/quartz/CronTrigger.html for patterns
 */
@Component(metatype = true, immediate = true)
@Service(value = Runnable.class)
@Properties({
        @Property(name = "scheduler.expression", value = "0 0 0/1 * * ?"), //every hour
        @Property(name = "scheduler.concurrent", boolValue = false),
        @Property(name = "scheduler.runOn", value = "SINGLE"),
        @Property(name = "service.enabled", boolValue = true, label = "Enabled", description = "Enable/Disable the Scheduled Service"),
})
public class SyncUserPosts implements Runnable {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Reference
    FacebookSyncService facebookSyncService;


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
            facebookSyncService.syncUserPosts();

        }

    }

}
