package com.familydam.bundle.sync.cron;

import com.familydam.bundle.sync.FamilyDAMSyncConstants;
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
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

/**
 * Created by mike on 1/26/17.
 *
 * @see - http://www.docjar.com/docs/api/org/quartz/CronTrigger.html for patterns
 */
@Component(metatype = true, immediate = true)
@Service(value = Runnable.class)
@Properties({
        @Property(name = "scheduler.expression", value = "0 * * * * ?"), //every 1mins
        @Property(name = "scheduler.concurrent", boolValue = false),
        @Property(name = "scheduler.runOn", value = "SINGLE"),
        @Property(name = "service.enabled", boolValue = true, label = "Enabled", description = "Enable/Disable the Scheduled Service"),
        @Property(name = "queue.url", propertyPrivate = false, value = "http://localhost:8080/api/v1/events")
})
public class PullFamilyDAMUserEvents implements Runnable {
    /**
     * Logger.
     */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    private Boolean enabled;
    private String queueUrl;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.enabled = PropertiesUtil.toBoolean(props.get("service.enabled"), true);
        this.queueUrl = PropertiesUtil.toString(props.get("queue.url"), "http://localhost:8080/api/v1/events");

        //run(); //run on startup
    }


    @Override
    public void run() {

        if (this.enabled) {
            JackrabbitSession adminSession = null;
            UserManager userManager = null;

            try {
                ResourceResolver adminResolver = null;
                adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
                adminSession = (JackrabbitSession) adminResolver.adaptTo(Session.class);


                userManager = adminSession.getUserManager();
                Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
                    public <T> void build(QueryBuilder<T> builder) {
                        builder.setCondition(builder.and(builder.neq("rep:principalName", new StringValue("admin")), builder.neq("rep:principalName", new StringValue("anonymous"))));
                        builder.setSortOrder("@rep:principalName", QueryBuilder.Direction.ASCENDING);
                        builder.setSelector(User.class);
                    }
                });


                while (users.hasNext()) {
                    Authorizable _user = users.next();
                    Node userNode = adminSession.getNode(_user.getPath());
                    Node secNode = userNode.getNode(FamilyDAMSyncConstants.USER_DAM_SECURITY);

                    try{
                        if ( userNode.hasProperty("jwtToken") ) {

                            String token = userNode.getProperty("jwtToken").getString();
                            List<Map> events = Request.Get(this.queueUrl)
                                    .useExpectContinue()
                                    .version(HttpVersion.HTTP_1_1)
                                    .addHeader("Authorization", token)
                                    .execute().handleResponse(response -> {
                                        StatusLine statusLine = response.getStatusLine();
                                        HttpEntity entity = response.getEntity();
                                        if (statusLine.getStatusCode() == 200) {

                                            ObjectMapper mapper = new ObjectMapper();
                                            List results = mapper.readValue(entity.getContent(), List.class);
                                            return results;
                                        }
                                        return Collections.EMPTY_LIST;
                                    });


                            for (Map event : events) {
                                if( ((String)event.get("type")).equalsIgnoreCase("fb_login_token") )
                                {
                                    if( !secNode.hasNode("facebook") ){
                                        secNode.addNode("facebook", JcrConstants.NT_UNSTRUCTURED);
                                    }

                                    Node fbNode = secNode.getNode("facebook");
                                    fbNode.setProperty("access_token", (String)((Map)event.get("message")).get("access_token")  );
                                    fbNode.setProperty("token_type", (String)((Map)event.get("message")).get("token_type")  );
                                    fbNode.setProperty("expires_in", (Integer)((Map)event.get("message")).get("expires_in")  );
                                    adminSession.save();
                                }
                                else if( ((String)event.get("type")).equalsIgnoreCase("twitter_login_token") )
                                {
                                    if( !secNode.hasNode("twitter") ){
                                        secNode.addNode("twitter", JcrConstants.NT_UNSTRUCTURED);
                                    }

                                    Node twitterNode = secNode.getNode("twitter");
                                    twitterNode.setProperty("token", (String)((Map)event.get("message")).get("token")  );
                                    twitterNode.setProperty("tokenSecret", (String)((Map)event.get("message")).get("tokenSecret")  );
                                    adminSession.save();
                                }
                            }
                        }

                    }catch(RepositoryException re){
                        re.printStackTrace();
                        //swallow
                    }
                }


            } catch (Exception le) {
                logger.error(le.getMessage(), le);
            }
        }
    }

}
