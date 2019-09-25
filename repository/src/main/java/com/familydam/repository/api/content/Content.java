package com.familydam.repository.api.content;

import com.familydam.repository.config.security.JcrAuthToken;
import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.fs.*;
import com.familydam.repository.utils.NodeToMapUtil;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
public class Content {

    Logger log = LoggerFactory.getLogger(Content.class);


    @Autowired
    AdminUser adminUser;

    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;

    @Autowired
    FsReadFileService fsReadFileService;

    @Autowired
    FsReadImageService fsReadImageService;

    @Autowired
    FsNewFileService fsNewFileService;

    @Autowired
    FsNewFolderService fsNewFolderService;



    @GetMapping(value = {"/content", "/content/**"})
    @ResponseBody
    public ResponseEntity listPath(HttpServletRequest request) throws IOException, RepositoryException
    {
        Session session = repo.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        String path = request.getServletPath();

        try {
            session.checkPermission(path, Session.ACTION_READ);
        }catch (AccessControlException ex){
            return ResponseEntity.status(403).build();
        }catch ( RepositoryException re){
            return ResponseEntity.status(500).body(re.getMessage());
        }

        Node n = session.getNode(path);
        if( n == null ){
            return ResponseEntity.notFound().build();
        }


        String accept = request.getHeader("Accept");
        //Return the actual nt:file Input Stream
        if( !"application/json".equals(accept) && n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) )
        {
            InputStream inputStream;
            byte[] out = null;

            //Check the type, if a file, we want to read the file as a stream to return.
            if( n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
                String mimeType = n.getNode("jcr:content").getProperty("jcr:mimeType").getString();
                if (mimeType.startsWith("image")) {
                    //special handling of images (with cached resize support)
                    inputStream = fsReadImageService.readFile(n, request);
                    out=org.apache.commons.io.IOUtils.toByteArray(inputStream);
                }else{
                    //read raw file
                    inputStream = fsReadFileService.readFile(n);
                    out=org.apache.commons.io.IOUtils.toByteArray(inputStream);
                }
            }


            //set headers
            HttpHeaders responseHeaders = new HttpHeaders();
            if( request.getParameterMap().containsKey("download") ) {
                responseHeaders.add("content-disposition", "attachment; filename=" + n.getName());
            }
            responseHeaders.add("Content-Type", n.getNode("jcr:content").getProperty("jcr:mimeType").getString());

            //return stream

            if( out != null ) {
                return new ResponseEntity(out, responseHeaders, HttpStatus.OK);
            }else{
                return ResponseEntity.notFound().build();
            }
        }
        // Get Data for Node (json of properties)
        else if( n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
            Map nodeMap = NodeToMapUtil.convert(n);
            return ResponseEntity.ok(nodeMap);
        }
        //Get list of all child nodes
        else {
            List<Map> nodes = fsListService.listNodes(session, path);
            return ResponseEntity.ok(nodes);
        }
    }



    @PostMapping(value = {"/content/**"})
    public ResponseEntity postEntry(Principal principal, StandardMultipartHttpServletRequest request) throws RepositoryException, IOException
    {
        Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );
        //Session session = repo.login( new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()) );

        String type = request.getParameter("jcr:primaryType");
        if( "nt:folder".equals(type)){
            return fsNewFolderService.createFolder(request, session);
        } else {
            return fsNewFileService.createFile(request, session);
        }

    }



    @DeleteMapping(value = {"/content/**"})
    public ResponseEntity deleteEntry(Principal principal, HttpServletRequest request) throws RepositoryException
    {
        Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );
        //Session session = repo.login( new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()) );

        if( !session.hasPermission(request.getRequestURI(), Session.ACTION_REMOVE) ){
            return ResponseEntity.status(403).build();
        }


        Node n = JcrUtils.getNodeIfExists( request.getRequestURI(), session );
        if( n != null ){
            n.remove();
            session.save();
        }else{
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

}
