/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.observers;


import com.familydam.core.FamilyDAMCoreConstants;
import com.familydam.core.helpers.KeyEncryption;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.fluent.Form;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.HttpHostConnectException;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpProcessorBuilder;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.value.StringValue;
import org.apache.sling.api.SlingConstants;
import org.apache.sling.api.resource.*;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.security.Privilege;
import java.io.DataInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.Principal;
import java.util.*;

/**
 * Created by mnimer on 3/4/16.
 */
//@Component(immediate = true)
//@Service(value = EventHandler.class)
@Properties({
        @Property(name = org.osgi.service.event.EventConstants.EVENT_TOPIC, value = SlingConstants.TOPIC_RESOURCE_ADDED),
        @Property(name="register.user.url", propertyPrivate=false, value = "http://localhost:8080/api/v1/user")
})
public class UserNodeEventListener implements EventHandler
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    String registerUserUrl;


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        this.registerUserUrl = PropertiesUtil.toString(props.get("register.user.url"), "http://localhost:9000/api/v1/user");

    }




    @Override public void handleEvent(Event event)
    {
        final String propPath = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        final String propResType = (String) event.getProperty(SlingConstants.PROPERTY_RESOURCE_TYPE);
        final String userId = (String) event.getProperty(SlingConstants.PROPERTY_USERID);


        ResourceResolver adminResolver = null;

        try {
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);

            final Resource res = adminResolver.getResource(propPath);
            if (res.getPath().startsWith("/home/users/") && res.getResourceType().equalsIgnoreCase("rep:User") ) {
                handleNewUser(session, res, event);
            }

        }
        catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }


    }


    private void handleNewUser(Session session, Resource res, Event event) throws RepositoryException
    {
        //log.trace("User " +res.getPath() +" added");
        //final String userId = res.adaptTo(User.class).getPrincipal().getName();
        UserManager userManager = AccessControlUtil.getUserManager(session);
        User user = (User) userManager.getAuthorizableByPath(res.getPath());

        if (user != null) {
            log.trace("User " + user.getPath() + " added");

            //todo, if the user isSuperAdmin - change the system admin password to match (todo: keep in sync)

            // start job to generate encryption keys for the user
            createSecurityKeys(session, user);

            try {
                Node userNode = session.getNode(user.getPath());
                Node secNode = userNode.getNode(FamilyDAMCoreConstants.USER_DAM_SECURITY);

                String familyId = null;
                Iterator<Group> groups = user.memberOf();
                while(groups.hasNext())
                {
                    Group group = groups.next();
                    if( group.getID().equalsIgnoreCase(FamilyDAMCoreConstants.FAMILY_GROUP))
                    {
                        familyId = session.getNode(group.getPath()).getIdentifier();// +"/jcr:uuid").getString();
                    }
                }

                //extract user data
                ValueMap valueProps = res.adaptTo(ValueMap.class);

                //create writable Map, so we can add props
                Map props = new HashMap(valueProps);
                props.put("familyId", new StringValue(familyId).getString());
                String jwtToken = registerUserandGetJWTToken(props, secNode.getProperty(FamilyDAMCoreConstants.PUBLIC_KEY_BASE64).getString().getBytes(Charset.forName("UTF-8")));

                userNode.setProperty(FamilyDAMCoreConstants.JWT_TOKEN, jwtToken);
                session.save();
            }catch(HttpHostConnectException hhcex){
                hhcex.printStackTrace();
                //Server is down, can't connect it
            }catch(Exception ex){
                ex.printStackTrace();
                //somethng bad happened, we'll try again later
            }
        }
    }

    /**
     * Generate a public/private key for each user.
     * @param session_
     * @param user_
     * @throws RepositoryException
     *
     * @See http://www.javamex.com/tutorials/cryptography/rsa_encryption.shtml
     */
    private void createSecurityKeys(Session session_, User user_) throws RepositoryException
    {
        KeyEncryption keyEncryption = new KeyEncryption();

        try {
            Node userNode = session_.getNode(user_.getPath());
            Node securityNode = userNode.addNode("dam:security", "nt:unstructured");
            session_.save();

            keyEncryption.generateKeys(securityNode, session_);

            // remove all access for this user (Note: had to remove. With no access sling will delete on login)
            // assignPermission(session_, user_.getPrincipal(), securityNode, null, new String[]{Privilege.JCR_ALL});

            // remove all access for the anonymouse user
            UserManager userManager = ((JackrabbitSession) session_).getUserManager();
            User anonUser = (User) userManager.getAuthorizable("anonymous");
            //assignPermission(activeSession, anonUser.getPrincipal(), activeSession.getRootNode().getNode("home"), null, new String[]{Privilege.JCR_WRITE});
            assignPermission(session_, anonUser.getPrincipal(), securityNode, null, new String[]{Privilege.JCR_ALL});

        }catch(Exception ex){
            ex.printStackTrace();
        }

    }






    private String registerUserandGetJWTToken(Map user, byte[] publicBytes64) throws RepositoryException,IOException
    {

        String token = Request.Post(this.registerUserUrl)
                .useExpectContinue()
                .version(HttpVersion.HTTP_1_1)
                .bodyForm(Form.form()
                        .add("userId", (String)user.get("jcr:uuid"))
                        .add("familyId", (String)user.get("familyId"))
                        .add("firstName", (String)user.getOrDefault("firstName", ""))
                        .add("lastName", (String)user.getOrDefault("lastName", ""))
                        .add("email", (String)user.getOrDefault("email", ""))
                        .add("publicKey", new String(publicBytes64, Charset.forName("UTF-8")))
                        .build()
                )
                .execute().handleResponse(response -> {

                    StatusLine statusLine = response.getStatusLine();
                    HttpEntity entity = response.getEntity();
                    if (statusLine.getStatusCode() == 200) {
                        int size = entity.getContent().available();
                        DataInputStream dataIs = new DataInputStream(entity.getContent());
                        byte[] keyBytes = new byte[size];
                        dataIs.readFully(keyBytes);
                        return new String(keyBytes, Charset.forName("UTF-8"));
                    }
                    if (statusLine.getStatusCode() >= 400) {
                        throw new HttpResponseException(
                                statusLine.getStatusCode(),
                                statusLine.getReasonPhrase());
                    }

                    if (entity == null) {
                        throw new ClientProtocolException("Response contains no content");
                    }

                    return "";
                });

        return token;

    }




    /**
     * Helper function to assign or remove permissions as needed
     * @param session_
     * @param principal_
     * @param node_
     * @param addPrivledges_
     * @param removePrivledges_
     */
    private void assignPermission(Session session_, Principal principal_, Node node_, String[] addPrivledges_, String[] removePrivledges_)
    {
        try {
            //setup list of privledges to add or remove
            Set<String> grantedPrivilegeNames = new HashSet<String>();
            if( addPrivledges_ != null ) {
                for (String priviledge : addPrivledges_) {
                    grantedPrivilegeNames.add(priviledge);
                }
            }

            Set<String> deniedPrivilegeNames = new HashSet<String>();
            if( removePrivledges_ != null ){
                for (String priviledge : removePrivledges_) {
                    deniedPrivilegeNames.add(priviledge);
                }
            }


            Set<String> removedPrivilegeNames = new HashSet<String>();
            if( removePrivledges_ != null ){
                for (String priviledge : removePrivledges_) {
                    removedPrivilegeNames.add(priviledge);
                }
            }


            // finally set policy again & save
            //accessControlManager.setPolicy(list.getPath(), list);

            AccessControlUtil.replaceAccessControlEntry(session_,
                    node_.getPath(), principal_,
                    grantedPrivilegeNames.toArray(new String[grantedPrivilegeNames.size()]),
                    deniedPrivilegeNames.toArray(new String[deniedPrivilegeNames.size()]),
                    removedPrivilegeNames.toArray(new String[removedPrivilegeNames.size()]));


            // and the session must be saved for the changes to be applied
            session_.save();

        }
        catch (RepositoryException re) {
            log.error(re.getMessage(), re);
        }
    }
}
