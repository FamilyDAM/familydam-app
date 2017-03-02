package com.familydam.bundle.sync.services.twitter;

import com.familydam.bundle.sync.FamilyDAMSyncConstants;
import com.familydam.bundle.sync.services.SyncService;
import com.familydam.bundle.sync.services.facebook.FacebookSyncService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.http.HttpEntity;
import org.apache.http.HttpVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.*;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.LongPredicate;
import java.util.function.ToLongFunction;
import java.util.logging.StreamHandler;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static com.familydam.bundle.sync.FamilyDAMSyncConstants.TWITTER_TOKEN;
import static com.familydam.bundle.sync.FamilyDAMSyncConstants.TWITTER_TOKEN_SECRET;
import static org.apache.jackrabbit.JcrConstants.NT_UNSTRUCTURED;

/**
 * Created by mike on 2/16/17.
 */
@Service(value = TwitterSyncService.class)
@Component(label = "Twitter Sync Service",
        description = "Syncs user data for users who have activated Twitter")
@Properties({
        @Property(name = "user.timeline.endpoint", label = "endpoint", description = "Timeline endpoint")
})
public class TwitterSyncService extends SyncService {

    public final Logger log = LoggerFactory.getLogger(TwitterSyncService.class);

    SimpleDateFormat dataFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
    SimpleDateFormat dataLongFormatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss ZZZZZ yyyy"); //"created_at": "Mon Oct 24 14:45:24 +0000 2016"

    @Reference
    private ResourceResolverFactory resolverFactory;

    private String twitterEndpoint;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        String defaultEndpoint = "http://localhost:8080/api/v1/social/twitter/proxy/user.timeline"; //https://api.twitter.com/1.1/statuses/user_timeline.json";

        twitterEndpoint = PropertiesUtil.toString(props.get("user.timeline.endpoint"), defaultEndpoint);

    }


    public void syncUserPosts(Boolean latest) {

        try {
            ResourceResolver adminResolver = getResourceResolver(resolverFactory);
            JackrabbitSession adminSession = (JackrabbitSession) getAdminSession(adminResolver);

            //get FamilyDAM users
            Iterator<Authorizable> users = getUsers(adminSession);


            while (users.hasNext()) {
                Authorizable _user = users.next();
                Node userNode = adminSession.getNode(_user.getPath());
                Node userSecNode = userNode.getNode(FamilyDAMSyncConstants.USER_DAM_SECURITY);

                try {

                    boolean hasNode = userSecNode.hasNode("twitter");
                    if (hasNode) {

                        String token = userSecNode.getNode("twitter").getProperty(TWITTER_TOKEN).getString();
                        String tokenSecret = userSecNode.getNode("twitter").getProperty(TWITTER_TOKEN_SECRET).getString();
                        String _endpoint = this.twitterEndpoint;



                        URI _nextUrl = getUrl(adminSession, _endpoint, token, tokenSecret, latest);
                        while (_nextUrl != null) {
                            List events = Request.Get(_nextUrl)
                                    .useExpectContinue()
                                    .version(HttpVersion.HTTP_1_1)
                                    .execute().handleResponse(response -> {
                                        StatusLine statusLine = response.getStatusLine();
                                        HttpEntity entity = response.getEntity();
                                        if (statusLine.getStatusCode() == 200) {
                                            try {
                                                ObjectMapper mapper = new ObjectMapper();
                                                String json = IOUtils.toString(entity.getContent());
                                                List results = mapper.readValue(json, ArrayList.class);//entity.getContent(), Map.class);
                                                return results;
                                            }catch (Exception ex){
                                                return Collections.EMPTY_LIST;
                                            }
                                        }
                                        return Collections.EMPTY_LIST;
                                    });




                            int rows = 0;
                            for (Map event : (List<Map>) events ) {
                                boolean updated = savePost(userNode, event);
                                if( updated ) rows++;
                            }

                            //remove after adding max_id & since_id
                            _nextUrl = null;
                            if( events.size() <= 1 ){
                                _nextUrl = null;
                                break;
                            }else{
                                _nextUrl = getUrl(adminSession, _endpoint, token, tokenSecret, latest);
                            }

                            //slow down so we don't trip twitter limits
                            Thread.sleep(2000);
                        }
                    }

                } catch (RepositoryException re) {
                    re.printStackTrace();
                    //swallow
                }
            }


        } catch (Exception le) {
            log.error(le.getMessage(), le);
        }
    }



    public URI getUrl(Session session, String endpoint_, String token_, String tokenSecret_, Boolean latest) throws URISyntaxException, RepositoryException
    {
        Long min = -1l;
        Long max = -1l;
        LongSummaryStatistics summaryStatistics = getMinAndMaxTweetId(session);
        if( summaryStatistics != null ) {
            max = summaryStatistics.getMax();
            min = summaryStatistics.getMin();
        }


        URIBuilder builder = new URIBuilder(endpoint_);
        builder.setParameter("token", token_);
        builder.setParameter("tokenSecret", tokenSecret_);
        builder.setParameter("count", "100");
        builder.setParameter("trim_user", "true");
        if( min != -1 && latest){
            builder.setParameter("since_id", max.toString());
        }
        if( max != -1 && !latest ){
            builder.setParameter("max_id", min.toString());
        }

        return builder.build();
    }


    public LongSummaryStatistics getMinAndMaxTweetId(Session session) throws RepositoryException
    {
        // Find Min & Max twitter ids
        QueryManager queryManager = session.getWorkspace().getQueryManager();
        //Query query = queryManager.createQuery(sql, "JCR-SQL2");
        Query query = queryManager.createQuery("select * from [dam:twitter_tweet]", Query.JCR_SQL2);
        // Execute the query and get the results ...
        QueryResult result = query.execute();

        if( !result.getRows().hasNext() )
        {
            return null;
        }

        Spliterator<Node> spliterator = Spliterators.spliteratorUnknownSize(
                result.getNodes(), Spliterator.NONNULL);

        Stream<Node> stream = StreamSupport.stream(spliterator, false);
        LongSummaryStatistics summaryStatistics = stream.mapToLong(value->{
            try {
                return  value.getProperty("id").getLong();
            } catch (RepositoryException ex) {
                return -1;
            }
        }).filter(value -> value > -1).summaryStatistics();

        return summaryStatistics;
    }



    private boolean savePost(Node userNode, Map post_) throws LoginException, RepositoryException, ParseException
    {
        ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
        Session adminSession = adminResolver.adaptTo(Session.class);

        //Make sure we have service root
        Node twitter = JcrUtils.getOrCreateByPath("/content/dam-web/" +userNode.getProperty("rep:principalName").getString() +"/twitter/posts", "nt:unstructured", adminSession);
        adminSession.save();


        String id = ((Number)post_.get("id")).toString();
        Calendar createdTime = Calendar.getInstance();
        createdTime.setTime(dataLongFormatter.parse( (String)post_.get("created_at") ));

        //generate post specific node
        String nodePath = twitter.getPath() +"/" +createdTime.get(Calendar.YEAR) +"/" +(createdTime.get(Calendar.MONTH)+1) +"/" +id;


        try {
            Node _testNode = adminSession.getNode(nodePath);
            return false;
        }catch(PathNotFoundException ex){
            //swallow
        }


        Node post = JcrUtils.getOrCreateByPath(nodePath, NT_UNSTRUCTURED, adminSession);

        try {
            post.addMixin("dam:twitter_tweet");
            //adminSession.save();


            Resource userPost = adminResolver.getResource(post.getPath());
            ModifiableValueMap modifiablePost = userPost.adaptTo(ModifiableValueMap.class);


            Map _user = (Map)post_.get("user");
            Map _entities = (Map)post_.get("entities");
            post_.remove("user");
            post_.remove("entities");
            post_.put("source", ((String)post_.get("source")).replaceAll("<[^>]*>", ""));


            //jcr does not like null properties
            post_.values().removeIf(Objects::isNull);
            // save tweet
            modifiablePost.putAll(post_);

            // get tweetNode
            Node tweetNode = userPost.adaptTo(Node.class);

            // Save USER NODE
            Node newUserNode = JcrUtils.getOrAddNode(post, "user", "nt:unstructured");
            Resource userPostResource = adminResolver.getResource(userNode.getPath());
            ModifiableValueMap modifiableUserPost = userPostResource.adaptTo(ModifiableValueMap.class);
            _user.values().removeIf(Objects::isNull);
            modifiableUserPost.putAll(_user);

            // Save ENTITIES
            Node newEntityNode = JcrUtils.getOrAddNode(post, "entities", "nt:unstructured");
            for (Object key : _entities.keySet()) {
                String _key = (String)key;
                Object _value = _entities.get(key);

                if( _value instanceof Map) {
                    Resource _resource = adminResolver.getResource(newEntityNode.getPath());
                    ModifiableValueMap _modifiableResource = _resource.adaptTo(ModifiableValueMap.class);
                    _user.values().removeIf(Objects::isNull);
                    _modifiableResource.putAll(_user);
                }else if( _value instanceof List ){

                    List _values = (List)_value;

                    //create node for key
                    Node _keyNode = JcrUtils.getOrAddNode(newEntityNode, _key, "nt:unstructured");

                    Integer indx = 1;
                    for (Object value : _values) {

                        //Create a node for each map in array, use the array index as the key
                        if( value instanceof Map ) {
                            Node _indxNode = JcrUtils.getOrAddNode(_keyNode, indx.toString(), "nt:unstructured");
                            Resource _indxResource = adminResolver.getResource(_indxNode.getPath());
                            ModifiableValueMap _modifiableResource = _indxResource.adaptTo(ModifiableValueMap.class);
                            ((Map) value).values().removeIf(Objects::isNull);
                            _modifiableResource.putAll( ((Map)value) );
                        }
                    }

                }
            }


            adminResolver.commit();
            adminSession.save();
            return true;

        }catch (Exception ex){
            post.remove();
            ex.printStackTrace();

            return false;
        }
    }


}
