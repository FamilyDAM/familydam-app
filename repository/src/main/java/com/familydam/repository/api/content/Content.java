package com.familydam.repository.api.content;

import com.familydam.repository.config.security.JcrAuthToken;
import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.fs.FsListService;
import com.familydam.repository.services.fs.FsReadFileService;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
public class Content {

    Logger log = LoggerFactory.getLogger(Content.class);


    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;

    @Autowired
    FsReadFileService fsReadFile;

    @Autowired
    AdminUser adminUser;


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
        if( !"application/json".equals(accept) && n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ){
            InputStream inputStream = fsReadFile.readFile(n);
            byte[] out=org.apache.commons.io.IOUtils.toByteArray(inputStream);

            HttpHeaders responseHeaders = new HttpHeaders();
            if( request.getParameterMap().containsKey("download") ) {
                responseHeaders.add("content-disposition", "attachment; filename=" + n.getName());
            }
            responseHeaders.add("Content-Type", n.getNode("jcr:content").getProperty("jcr:mimeType").getString());

            return new ResponseEntity(out, responseHeaders, HttpStatus.OK);
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
            return handleNewFolder(request, session);
        } else {
            return handleFileUpload(request, session);
        }

    }


    @PutMapping(value = {"/content/**"})
    public ResponseEntity putEntry(HttpServletRequest request){
        request.toString();
        return ResponseEntity.ok().build();
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


    private String cleanName(String name_){
        return name_.trim().replaceAll("\\[", "(").replaceAll("]", ")").replaceAll(":", "").replaceAll("\n", "").replaceAll(" ", "+");
    }




    protected ResponseEntity handleNewFolder(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException, IOException {
        String name = request.getParameter("name");
        Node n = JcrUtils.getOrCreateByPath(request.getRequestURI(), NodeType.NT_FOLDER, session);
        session.save();
        return ResponseEntity.created( URI.create(n.getPath()) ).build();
    }

    protected ResponseEntity handleFileUpload(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException, IOException {
        String name = request.getParameter("name");
        //String path = request.getParameter("path");
        String destination = request.getParameter("destination");
        //a list, but client always sends 1 file
        List<MultipartFile> files = request.getMultiFileMap().get("file");


        if( !session.hasPermission(destination, Session.ACTION_ADD_NODE) ){
            return ResponseEntity.status(403).build();
        }


        Node destNode = JcrUtils.getOrCreateByPath(destination, NodeType.NT_FOLDER,  session);
        for (MultipartFile file : files) {
            Node n = JcrUtils.putFile(destNode, cleanName(name), file.getContentType(), file.getInputStream());
            session.save();
            return ResponseEntity.created( URI.create(n.getPath()) ).build();
        }

        return ResponseEntity.badRequest().build();
    }

}
