package com.familydam.bundle.sync.services.dropbox;

import com.familydam.bundle.sync.FamilyDAMSyncConstants;
import com.familydam.bundle.sync.services.SyncService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.http.HttpEntity;
import org.apache.http.HttpVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.*;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.commons.contentdetection.ContentAwareMimeTypeService;
import org.apache.sling.commons.contentdetection.internal.ContentAwareMimeTypeServiceImpl;
import org.apache.sling.commons.mime.MimeTypeService;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.familydam.bundle.sync.FamilyDAMSyncConstants.ACCESS_TOKEN;

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
@Service(value = DropboxSyncService.class)
@Component(label = "Dropbox Sync Service",
        description = "Syncs files and folders from Dropbox")
@Properties({
        @Property(name = "dropbox.apiendpoint", label = "endpoint", description = "Dropbox API Endpoint"),
        @Property(name = "dropbox.contentendpoint", label = "endpoint", description = "Dropbox Content Endpoint")
})
public class DropboxSyncService extends SyncService
{
    public final Logger log = LoggerFactory.getLogger(DropboxSyncService.class);

    @Reference
    ResourceResolverFactory resolverFactory;

    @Reference
    MimeTypeService mimeTypeService;

    SimpleDateFormat dataFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

    String apiEndpoint;
    String contentEndpoint;



    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        String apiEndpoint = "https://api.dropboxapi.com/2";
        String contentEndpoint = "https://content.dropboxapi.com/2";


        String _apiEndpoint = PropertiesUtil.toString(props.get("dropbox.apiendpoint"), apiEndpoint);
        String _contentEndpoint = PropertiesUtil.toString(props.get("dropbox.contentendpoint"), contentEndpoint);
        this.apiEndpoint = _apiEndpoint;
        this.contentEndpoint = _contentEndpoint;

    }


    public void syncFiles()
    {

        try {
            ResourceResolver adminResolver = getResourceResolver(resolverFactory);
            JackrabbitSession adminSession = (JackrabbitSession)getAdminSession(adminResolver);

            //get FamilyDAM users
            Iterator<Authorizable> users = getUsers(adminSession);
            while (users.hasNext()) {
                Authorizable _user = users.next();
                Node userNode = adminSession.getNode(_user.getPath());
                Node userSecNode = userNode.getNode(FamilyDAMSyncConstants.USER_DAM_SECURITY);




                try {

                    boolean hasNode = userSecNode.hasNode("dropbox");
                    if (hasNode) {

                        String token = userSecNode.getNode("dropbox").getProperty(ACCESS_TOKEN).getString();
                        String _endpoint = this.apiEndpoint +"/files/list_folder";

                        String _nextUrl = _endpoint;
                        while (_nextUrl != null) {

                            _nextUrl = listFolders(adminSession, userNode, token, _nextUrl, "");

                        }

                        adminSession.save();
                    }


                } catch (RepositoryException re) {
                    re.printStackTrace();
                    //swallow
                }




                //LIST
                //curl -X POST https://api.dropboxapi.com/2/files/list_folder \
                //--header 'Authorization: Bearer q_8IyQTYsfMAAAAAAAAWshyOuFu1Y88pxXBco5v3RCJ5-pa_WLhBAH3XAphsMXG9' \
                //--header 'Content-Type: application/json' \
                //--data '{"path":""}'



            }
        } catch (Exception le) {
            le.printStackTrace();
            log.error(le.getMessage(), le);
        }
    }


    /**
     *
     * @param userNode
     * @param token - oauth access token
     * @param _nextUrl - Could be /list_folders or /list_folders/continue
     * @param path
     * @return
     * @throws java.io.IOException
     */
    private String listFolders(JackrabbitSession session, Node userNode, String token, String _nextUrl, String path) throws java.io.IOException
    {

        Map body = new HashMap();
        body.put("path", path);
        body.put("include_media_info", false);
        String _body = new ObjectMapper().writeValueAsString(body);


        Map items = Request.Post(_nextUrl)
                .useExpectContinue()
                .version(HttpVersion.HTTP_1_1)
                .addHeader("Authorization", "Bearer " +token)
                .bodyString(_body, ContentType.APPLICATION_JSON)
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
        if( items != null ) {
            for (Map item : (List<Map>) items.get("entries")) {
                if (item.containsKey(".tag")) {
                    String type = (String) item.get(".tag");

                    if (type.equalsIgnoreCase("file")) {
                        boolean updated = saveFile(session, userNode, token, item);
                    } else if (type.equalsIgnoreCase("folder")) {
                        boolean updated = saveFolder(session, userNode, token, item);
                    }else{
                        log.warn("Unknown Dropbox Type: " +type);
                    }
                    try {
                        session.save();
                    }catch (RepositoryException re){
                        log.error(re.getMessage(), re);
                    }

                }
            }
        }

        //TODO: check for "has_more" and use the "cursor"

        return null;
    }



    private boolean saveFolder(JackrabbitSession session, Node userNode, String token, Map item) throws IOException
    {
        String id = (String)item.get("id");
        String nextUrl = this.apiEndpoint +"/files/list_folder";

        try {
            String _name = userNode.getProperty("rep:principalName").getString();
            Node rootNode = session.getNode("/");

            Node dropBoxNode = JcrUtils.getOrCreateByPath(rootNode.getPath()  +"/content/dam-cloud/" +_name +"/dropbox", "nt:unstructured", session);

            String _path = (String)item.get("path_display");
            String _pathLower = (String)item.get("path_lower");
            Node folderNode = JcrUtils.getOrCreateByPath(dropBoxNode.getPath()  +_path, "nt:unstructured", session);

            saveMapToNode(item, folderNode);
            System.out.print("Create Dropbox Folder: " +folderNode.getPath());

            /** sample
             {
             ".tag": "folder",
             "name": "backups",
             "path_lower": "/backups",
             "path_display": "/backups",
             "id": "id:ExMNWeXcgL4AAAAAAAABZg"
             }
             */

            listFolders(session, userNode, token, nextUrl, _pathLower);

        }catch (RepositoryException re) {
            re.printStackTrace();
        }

        return false;
    }



    private boolean saveFile(JackrabbitSession session, Node userNode, String token, final Map item) throws IOException
    {
        String id = (String)item.get("id");

        Map body = new HashMap();
        body.put("path", id); //load by id
        String _body = new ObjectMapper().writeValueAsString(body);

        try {
            String _name = userNode.getProperty("rep:principalName").getString();
            Node rootNode = session.getNode("/");

            final Node dropBoxNode = JcrUtils.getOrAddNode(rootNode, "content/dam-cloud/" + _name + "/dropbox", "nt:unstructured");

            String _path = (String) item.get("path_display");
            String _pathLower = (String) item.get("path_lower");


            Boolean isModified = false;
            Node existingNode = JcrUtils.getNodeIfExists(dropBoxNode, _path.substring(1));
            if( existingNode != null ) {

                try {
                    DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
                    Date existingNodeDate = df.parse(existingNode.getProperty("client_modified").getString());
                    Date dropboxNodeDate = df.parse(item.get("client_modified").toString());
                    if (dropboxNodeDate.compareTo(existingNodeDate) != 0) {
                        isModified = true;
                    }
                }catch (ParseException pe){
                    log.warn(pe.getMessage(), pe);
                }
            }
            //TODO: check if the file already exists and if it does is it newer on dropbox
            if( existingNode == null || isModified ) {

                Request.Post(this.contentEndpoint + "/files/download")
                        .useExpectContinue()
                        .version(HttpVersion.HTTP_1_1)
                        .addHeader("Authorization", "Bearer " + token)
                        .addHeader("Dropbox-API-Arg", _body)
                        .execute().handleResponse(response -> {

                    StatusLine statusLine = response.getStatusLine();
                    HttpEntity entity = response.getEntity();

                    if (statusLine.getStatusCode() == 200) {
                        String json = response.getFirstHeader("dropbox-api-result").getValue();
                        Map apiResults = new ObjectMapper().readValue(json, Map.class);
                        String _pathDisplay = (String) apiResults.get("path_display");
                        int indx = _path.lastIndexOf("/");
                        _pathDisplay = _pathDisplay.substring(0, indx);

                        String _fileName = (String) apiResults.get("name");
                        String _mime = response.getFirstHeader("Content-Type").getValue();



                        InputStream is = entity.getContent();
                        String detectedMimeType = mimeTypeService.getMimeType(_fileName);
                        if( detectedMimeType != null ){
                            _mime = detectedMimeType;
                        }

                        // SAVE FILE NODE
                        try {
                            Node parentNode = JcrUtils.getOrCreateByPath(dropBoxNode.getPath() +_pathDisplay, "nt:unstructured", session);

                            Node fileNode = JcrUtils.putFile(parentNode, _fileName, _mime, is);
                            fileNode.addMixin("dam:extensible");
                            saveMapToNode(apiResults, fileNode);
                            System.out.print("Save Dropbox File: " + fileNode.getPath());
                        } catch (Exception re) {
                            re.printStackTrace();
                            log.error(re.getMessage(), re);
                        }
                    } else {
                        log.warn("Dropbox save file http error: " + _path);
                    }
                    return response.getLastHeader("Dropbox-API-Result");
                });
            }

        }catch (RepositoryException re){
            re.printStackTrace();
            log.error(re.getMessage(), re);
        }

        return false;
    }



    private void saveMapToNode(Map item_, Node node_) throws RepositoryException {
        for (Object key : item_.keySet()) {
            Object val = item_.get(key);
            if( val instanceof String) {
                node_.setProperty(key.toString(), new StringValue((String)val));
            } else if( val instanceof Integer) {
                node_.setProperty(key.toString(), new LongValue(((Integer)val).longValue()));
            } else if( val instanceof Long) {
                node_.setProperty(key.toString(), new LongValue(((Long)val)));
            } else if( val instanceof Double) {
                node_.setProperty(key.toString(), new DoubleValue(((Double)val)));
            } else if( val instanceof Boolean) {
                node_.setProperty(key.toString(), new BooleanValue(((Boolean) val)));
            } else if( val instanceof Date) {
                Calendar cal = Calendar.getInstance();
                cal.setTime((Date)val);
                node_.setProperty(key.toString(), new DateValue(cal));
            }
        }
    }

}
