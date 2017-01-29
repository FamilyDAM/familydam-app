package com.familydam.bundle.sync.cron;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.felix.scr.annotations.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.HttpClientUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.*;
import org.apache.jackrabbit.oak.commons.IOUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.commons.osgi.OsgiUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import javax.jcr.Value;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Dictionary;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by mike on 1/26/17.
 * @see - http://www.docjar.com/docs/api/org/quartz/CronTrigger.html for patterns
 */
@Component(metatype = true, immediate = true)
@Service(value = Runnable.class)
@Properties({
        @Property(name = "scheduler.period", value = "0 * * * * ?"), //every 1mins
        @Property(name="scheduler.concurrent", boolValue=false),
        @Property(name="scheduler.runOn", value="SINGLE"),
        @Property(name = "service.enabled", boolValue = true, label = "Enabled", description = "Enable/Disable the Scheduled Service"),
        @Property(name="queue.url", propertyPrivate=false, value = "http://localhost:8080/api/v1/events/{token}")
})
public class PullFamilyDAMUserEvents implements Runnable
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    private Boolean enabled;
    private String queueUrl;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.enabled = PropertiesUtil.toBoolean(props.get("service.enabled"), true);
        this.queueUrl = PropertiesUtil.toString(props.get("queue.url"), "http://localhost:8080/api/v1/events/{token}");

        run(); //run on startup
    }



    @Override
    public void run() {

        if( this.enabled  ) {
            JackrabbitSession adminSession = null;
            UserManager userManager = null;

            try {
                ResourceResolver adminResolver = null;
                adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
                adminSession = (JackrabbitSession) adminResolver.adaptTo(Session.class);


                userManager = adminSession.getUserManager();
                Iterator<Authorizable> users = userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
                    public <T> void build(QueryBuilder<T> builder) {
                        builder.setCondition(builder.neq("rep:principalName", new StringValue("anonymous")));
                        builder.setCondition(builder.and(builder.neq("rep:principalName", new StringValue("admin")), builder.neq("rep:principalName", new StringValue("anonymous"))));
                        builder.setSortOrder("@rep:principalName", QueryBuilder.Direction.ASCENDING);
                        builder.setSelector(User.class);
                    }
                });


                while (users.hasNext()) {
                    Authorizable _user = users.next();

                    if (_user.hasProperty("token")) {
                        HttpClientBuilder builder = HttpClientBuilder.create();
                        CloseableHttpClient httpClient = builder.build();


                        HttpGet getRequest = new HttpGet(this.queueUrl.replace("{token}", _user.getProperty("token").toString()));
                        getRequest.addHeader("accept", "application/json");

                        try {
                            CloseableHttpResponse response = httpClient.execute(getRequest);

                            if (response.getStatusLine().getStatusCode() == 200) {
                                Map props = new ObjectMapper().readValue(response.getEntity().getContent(), Map.class);
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                            // error handling
                        } finally {
                            HttpClientUtils.closeQuietly(httpClient);
                        }
                    }
                }


            } catch (Exception le) {
                logger.error(le.getMessage(), le);
            }
        }
    }

}
