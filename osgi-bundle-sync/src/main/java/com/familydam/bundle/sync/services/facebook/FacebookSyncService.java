package com.familydam.bundle.sync.services.facebook;

import com.familydam.apps.dashboard.servlets.HealthServlet;
import com.familydam.bundle.sync.FamilyDAMSyncConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.http.HttpEntity;
import org.apache.http.HttpVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.fluent.Request;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.QueryBuilder;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.resource.*;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.nio.ch.IOUtil;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.familydam.bundle.sync.FamilyDAMSyncConstants.ACCESS_TOKEN;
import static org.apache.jackrabbit.JcrConstants.NT_UNSTRUCTURED;

/**
 *
 * Service used to download all of the users data
 *
 * useful urls
 * post details = /v2.8/562978141_10154845095193142?fields=id,application,caption,created_time,description,link,message,message_tags,name,object_id,permalink_url,picture,privacy,place,shares,source,status_type,story,type,to,updated_time,with_tags
 * object_id image details - /v2.8/10154845087378142?fields=height,width,images,created_time,backdated_time,from
 * picture 10154845087378142?fields=height,width,images,created_time,from,link,place,album,updated_time,picture,backdated_time
 * String _endpoint = "/v2.8/me/photos?fields=created_time,images,name&limit=100"; //getPhotos
 * String _endpoint = "/v2.8/me/albums?fields=count,created_time,id,name"; //get albums

 * Created by mike on 2/5/17.
 */
//@Component(immediate = true, metatype = true)
@Service(value = FacebookSyncService.class)
@Component(label = "Facebook Sync Service",
        description = "Syncs user data for users who have activate FB")
@Properties({
        @Property(name = "graphql.endpoint", label = "endpoint", description = "GraphQL endpoint"),
        @Property(name = "graphql.fields", label = "fields", description = "GraphQL fields to return")
})
public class FacebookSyncService
{
    public final Logger log = LoggerFactory.getLogger(FacebookSyncService.class);

    @Reference
    private ResourceResolverFactory resolverFactory;

    SimpleDateFormat dataFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

    String graphQLEndpoint;



    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        String defaultEndpoint = "https://graph.facebook.com/v2.8/me/posts";
        String defaultFields = "description,caption,message,created_time,updated_time,object_id,full_picture,place,reactions{name,link,pic_large,profile_type,type,username,picture},comments{comment_count,application,comments},sharedposts{actions,coordinates},insights{description,name,period,title,values},attachments{description,media,title,type,url,subattachments}";


        try {
            String _graphQLEndpoint = PropertiesUtil.toString(props.get("graphql.endpoint"), defaultEndpoint);
            String _graphQLFields = URLEncoder.encode(PropertiesUtil.toString(props.get("graphql.fields"), defaultFields), "UTF-8");
            this.graphQLEndpoint = _graphQLEndpoint + "?fields=" + _graphQLFields + "&show_expired=true&access_token={access_token}&limit={limit}";

        }catch( UnsupportedEncodingException ex){
            ex.printStackTrace();
            throw new RuntimeException(ex.getMessage());
        }


    }


    public void syncUserPosts()
    {

        try {
            ResourceResolver adminResolver = getResourceResolver();
            JackrabbitSession adminSession = (JackrabbitSession)getAdminSession(adminResolver);

            //get FamilyDAM users
            Iterator<Authorizable> users = getUsers(adminSession);


            while (users.hasNext()) {
                Authorizable _user = users.next();
                Node userNode = adminSession.getNode(_user.getPath());
                Node userSecNode = userNode.getNode(FamilyDAMSyncConstants.USER_DAM_SECURITY);

                try {

                    boolean hasNode = userSecNode.hasNode("facebook");
                    if (hasNode) {

                        String token = userSecNode.getNode("facebook").getProperty(ACCESS_TOKEN).getString();
                        String _endpoint = this.graphQLEndpoint;
                        _endpoint = _endpoint.replace("{access_token}", token);
                        _endpoint = _endpoint.replace("{limit}", "50");


                        String _nextUrl = _endpoint;
                        while (_nextUrl != null) {
                            Map events = Request.Get(_nextUrl)
                                    .useExpectContinue()
                                    .version(HttpVersion.HTTP_1_1)
                                    .execute().handleResponse(response -> {
                                        StatusLine statusLine = response.getStatusLine();
                                        HttpEntity entity = response.getEntity();
                                        if (statusLine.getStatusCode() == 200) {
                                            ObjectMapper mapper = new ObjectMapper();
                                            String json = IOUtils.toString(entity.getContent());
                                            Map results = mapper.readValue(json, Map.class);//entity.getContent(), Map.class);
                                            return results;
                                        }
                                        return Collections.EMPTY_MAP;
                                    });


                            // loop over data nodes
                            int rows = 0;
                            for (Map event : (List<Map>) events.get("data")) {
                                boolean updated = savePost(userNode, event);
                                if( updated ) rows++;
                            }

                            if (events.containsKey("paging")) {
                                Map paging = (Map) events.get("paging");
                                if (paging.containsKey("next")) {
                                    _nextUrl = (String)paging.get("next");
                                } else {
                                    _nextUrl = null;
                                }
                            } else {
                                _nextUrl = null;
                            }

                            if( rows == 0 ){
                                _nextUrl = null;
                            }

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






    ResourceResolver getResourceResolver() throws LoginException {
        JackrabbitSession adminSession = null;
        UserManager userManager = null;

        ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
        return adminResolver;
    }


    Session getAdminSession(ResourceResolver adminResolver) throws LoginException {
        return (JackrabbitSession) adminResolver.adaptTo(Session.class);
    }


    Iterator<Authorizable> getUsers(JackrabbitSession adminSession) throws RepositoryException {
        UserManager userManager = adminSession.getUserManager();
        return userManager.findAuthorizables(new org.apache.jackrabbit.api.security.user.Query() {
            public <T> void build(QueryBuilder<T> builder) {
                builder.setCondition(builder.neq("rep:principalName", new StringValue("anonymous")));
                builder.setCondition(builder.and(builder.neq("rep:principalName", new StringValue("admin")), builder.neq("rep:principalName", new StringValue("anonymous"))));
                builder.setSortOrder("@rep:principalName", QueryBuilder.Direction.ASCENDING);
                builder.setSelector(User.class);
            }
        });
    }





    boolean savePost(Node user, Map post_) throws Exception
    {
        ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
        Session adminSession = adminResolver.adaptTo(Session.class);

        //Make sure we have service root
        Node facebook = JcrUtils.getOrCreateByPath("/content/dam-web/" +user.getProperty("rep:principalName").getString() +"/facebook/posts", "nt:unstructured", adminSession);
        adminSession.save();


        String id = (String)post_.get("id");
        Calendar createdTime = Calendar.getInstance();
        createdTime.setTime(dataFormatter.parse( (String)post_.get("created_time") ));

        //generate post specific node
        String nodePath = facebook.getPath() +"/" +createdTime.get(Calendar.YEAR) +"/" +(createdTime.get(Calendar.MONTH)+1) +"/" +id;


        try {
            Node _testNode = adminSession.getNode(nodePath);
            return false;
        }catch(PathNotFoundException ex){
            //swallow
        }

        try {

            Node post = JcrUtils.getOrCreateByPath(nodePath, NT_UNSTRUCTURED, adminSession);
            post.addMixin("dam:facebook_post");
            //adminSession.save();


            List _reactions = getAllReactionData(post_);
            List _comments = getAllCommentsData(post_);
            Map _place = getPlaceData(post_);
            List _attachments = getAllAttachementData(post_);

            post_.remove("reactions");
            post_.remove("comments");
            post_.remove("attachments");
            post_.remove("place");


            Resource userPost = adminResolver.getResource(post.getPath());
            ModifiableValueMap modifiablePost = userPost.adaptTo(ModifiableValueMap.class);
            modifiablePost.putAll(post_);


            Node userPostNode = userPost.adaptTo(Node.class);
            if (_reactions.size() > 0) {
                Node reactionNode = JcrUtils.getOrAddNode(userPostNode, "reactions", "nt:unstructured");
                saveReactions(adminResolver, _reactions, reactionNode);
            }


            if (_comments.size() > 0) {
                Node commentNode = JcrUtils.getOrAddNode(userPostNode, "comments", "nt:unstructured");
                saveComments(adminResolver, _comments, commentNode);
            }

            if( _place != null ){
                Node placeNode = JcrUtils.getOrAddNode(userPostNode, "place", "nt:unstructured");
                savePlaces(adminResolver, _place, placeNode);
            }

            if (_attachments.size() > 0) {
                Node attachmentNode = JcrUtils.getOrAddNode(userPostNode, "attachments", "nt:unstructured");
                saveAttachments(adminResolver, _attachments, attachmentNode);
            }


            adminResolver.commit();
            adminSession.save();
            return true;

        }catch (Exception ex){
            ex.printStackTrace();

            return false;
        }

    }


    private void saveReactions(ResourceResolver adminResolver, List _reactions, Node reactionNode) throws RepositoryException {
        for (Object o : _reactions) {
            Node dataNode = JcrUtils.getOrAddNode(reactionNode, ((Map)o).get("id").toString());
            Resource dataResource = adminResolver.getResource(dataNode.getPath());
            ModifiableValueMap dataMap = dataResource.adaptTo(ModifiableValueMap.class);
            dataMap.putAll( (Map)o );
        }
    }


    private void saveComments(ResourceResolver adminResolver, List _comments, Node commentNode) throws RepositoryException {
        for (Object o : _comments) {
            Node dataNode = JcrUtils.getOrAddNode(commentNode, ((Map)o).get("id").toString());
            Resource dataResource = adminResolver.getResource(dataNode.getPath());
            ModifiableValueMap dataMap = dataResource.adaptTo(ModifiableValueMap.class);
            dataMap.putAll( (Map)o );
        }
    }



    private void savePlaces(ResourceResolver adminResolver, Map place, Node placeNode) throws RepositoryException {
        Node dataNode = JcrUtils.getOrAddNode(placeNode, place.get("id").toString());
        Resource dataResource = adminResolver.getResource(dataNode.getPath());
        ModifiableValueMap dataMap = dataResource.adaptTo(ModifiableValueMap.class);

        if( place.containsKey("location") ){
            Map location = (Map)place.get("location");
            place.remove("location");

            Node locationNode = JcrUtils.getOrAddNode(dataNode, "location", "nt:unstructured");
            Resource locationResource = adminResolver.getResource(locationNode.getPath());
            ModifiableValueMap locationMap = locationResource.adaptTo(ModifiableValueMap.class);
            locationMap.putAll(location);
            locationNode.addMixin("dam:facebook_location");
        }

        dataMap.putAll( place );
    }


    private void saveAttachments(ResourceResolver adminResolver, List _attachements, Node attachmentNode) throws RepositoryException {
        for (Object o : _attachements) {

            if( ((Map)o).containsKey("type") && ((Map)o).containsKey("url") ) {
                String _id = ((Map) o).get("type").toString() + new Integer(((Map) o).get("url").hashCode()).toString();
                Node dataNode = JcrUtils.getOrAddNode(attachmentNode, _id, "nt:unstructured");

                if (((Map) o).containsKey("media")) {
                    Map _media = ((Map) ((Map) o).get("media"));
                    ((Map) o).remove("media");

                    for (Object _key : _media.keySet()) {
                        Map _mediaItem = (Map) _media.get(_key);
                        _mediaItem.put("_type", _key);

                        if (_mediaItem.containsKey("src")) {
                            String _mediaId = "media";//_key + new Integer(_mediaItem.get("src").hashCode()).toString();
                            Node mediaNode = JcrUtils.getOrAddNode(dataNode, _mediaId, "nt:unstructured");
                            Resource mediaResource = adminResolver.getResource(mediaNode.getPath());
                            ModifiableValueMap mediaMap = mediaResource.adaptTo(ModifiableValueMap.class);
                            mediaMap.putAll(_mediaItem);
                        }
                    }
                }


                if (((Map) o).containsKey("subattachments")) {
                    List _media = (List) ((Map) ((Map) o).get("subattachments")).get("data");
                    ((Map) o).remove("subattachments");

                    for (Object subMedia : _media) {
                        Node mediaNode = JcrUtils.getOrAddNode(dataNode, "subattachments", "nt:unstructured");
                        Resource mediaResource = adminResolver.getResource(mediaNode.getPath());
                        ModifiableValueMap mediaMap = mediaResource.adaptTo(ModifiableValueMap.class);
                        mediaMap.putAll((Map) subMedia);
                    }
                }

                Resource dataResource = adminResolver.getResource(dataNode.getPath());
                ModifiableValueMap dataMap = dataResource.adaptTo(ModifiableValueMap.class);
                dataMap.putAll((Map) o);

            }
            //todo throw download event
        }
    }


    /**
     * Return the reaction data, if it's paged will call back to FB to get the rest of the data
     * @param post_
     * @return
     */
    private List getAllReactionData(Map post_) {
        try{
            return (List)((Map)post_.get("reactions")).get("data");
        }catch(Exception ex){
            return Collections.EMPTY_LIST;
        }
    }

    /**
     * Return the reaction data, if it's paged will call back to FB to get the rest of the data
     * @param post_
     * @return
     */
    private List getAllCommentsData(Map post_) {

        try {
            List comments = new ArrayList();
            if( post_.containsKey("comments") && ((Map) post_.get("comments")).containsKey("data") ) {
                List nodes = ((List) ((Map) post_.get("comments")).get("data"));

                for (Object node : nodes) {

                    if (((Map) node).containsKey("comments")) {
                        List commentList = (List) ((Map) ((Map) node).get("comments")).get("data");
                        comments.addAll(commentList);
                    }
                }
            }
            return comments;
        }catch(Exception ex){
            return Collections.EMPTY_LIST;
        }
    }



    /**
     * Return the reaction data, if it's paged will call back to FB to get the rest of the data
     * @param post_
     * @return
     */
    private Map getPlaceData(Map post_) {
        try{
            return (Map)post_.get("place");
        }catch(Exception ex){
            return null;
        }
    }


    /**
     * Return the reaction data, if it's paged will call back to FB to get the rest of the data
     * @param post_
     * @return
     */
    private List getAllAttachementData(Map post_) {
        try{
            return (List)((Map)post_.get("attachments")).get("data");
        }catch(Exception ex){
            return Collections.EMPTY_LIST;
        }
    }
}
