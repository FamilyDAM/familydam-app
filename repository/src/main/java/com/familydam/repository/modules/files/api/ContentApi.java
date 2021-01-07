package com.familydam.repository.modules.files.api;

import com.familydam.repository.models.ContentNode;
import com.familydam.repository.modules.auth.config.security.JcrAuthToken;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.files.services.*;
import com.familydam.repository.utils.NodeToMapUtil;
import org.apache.jackrabbit.commons.JcrUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class ContentApi {

    Logger log = LoggerFactory.getLogger(ContentApi.class);


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
    NodeUpdatePropertyService nodeUpdatePropertyService;

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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }catch ( RepositoryException re){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, re.getMessage());
        }

        // todo find workaround for '+' char: "/content/files/mike/Photos/alaska/kayden - garage sell 2019/smugmug/Flowers+"
        Node n = session.getNode(path);
        if( n == null ){
            return ResponseEntity.notFound().build();
        }


        String accept = request.getHeader("Accept");
        //Return the actual nt:file Input Stream
        if( !"application/json".equals(accept) && n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) )
        {
            byte[] out = readFileSteam(n, request.getParameter("size"));
            HttpHeaders responseHeaders = getFileStreamHeaders(request.getParameterMap(), n);

            //return stream
            if( out != null ) {
                return new ResponseEntity(out, responseHeaders, HttpStatus.OK);
            }else{
                return ResponseEntity.notFound().build();
            }
        }

        // Get Data for Single Node (json of properties)
        else if( n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
            //todo convert to Hal+EntityModel
            Map nodeMap = NodeToMapUtil.convert(n);
            return ResponseEntity.ok(nodeMap);
        }


        //Get list of all child nodes
        else {
            List<ContentNode> nodes = fsListService.listNodes(session, path);

            List<EntityModel<ContentNode>> entityNodes = nodes.stream().map((cn)->{
                Link selfLink = WebMvcLinkBuilder.linkTo(ContentApi.class).slash(cn.getPath()).withSelfRel();
                return EntityModel.of(cn, selfLink);
            }).collect(Collectors.toList());

            RepresentationModel model = HalModelBuilder
                .emptyHalModel()
                .embed(entityNodes)
                .link(WebMvcLinkBuilder.linkTo(ContentApi.class).slash(path).withSelfRel())
                .build();
            return ResponseEntity.ok(model);
        }
    }


    /**
     * Modify the whole object
     * @param principal
     * @param request
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
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

    /**
     * update properties on object
     * @param principal
     * @param request
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    @PutMapping(value = {"/content/**"})
    public ResponseEntity putEntry(Principal principal, StandardMultipartHttpServletRequest request) throws RepositoryException, IOException
    {
        Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );
        //Session session = repo.login( new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()) );

        if( !session.hasPermission(request.getRequestURI(), Session.ACTION_SET_PROPERTY) ){
            return ResponseEntity.status(403).build();
        }

        nodeUpdatePropertyService.updateNode(session, request.getRequestURI(), request.getParameterMap());

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



    @NotNull
    private HttpHeaders getFileStreamHeaders(Map<String, String[]> reqParams, Node n) throws RepositoryException {
        //set headers
        HttpHeaders responseHeaders = new HttpHeaders();
        if( reqParams.containsKey("download") ) {
            responseHeaders.add("content-disposition", "attachment; filename=" + n.getName());
        }
        responseHeaders.add("Content-Type", n.getNode("jcr:content").getProperty("jcr:mimeType").getString());
        return responseHeaders;
    }

    @Nullable
    private byte[] readFileSteam(Node n, String size) throws RepositoryException, IOException {
        InputStream inputStream;
        byte[] out = null;

        //Check the type, if a file, we want to read the file as a stream to return.
        if( n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
            String mimeType = n.getNode("jcr:content").getProperty("jcr:mimeType").getString();
            if (mimeType.startsWith("image") && size != null) {
                //special handling of images (with cached resize support)
                inputStream = fsReadImageService.readFile(n, size);
                out=org.apache.commons.io.IOUtils.toByteArray(inputStream);
            }else{
                //read raw file
                inputStream = fsReadFileService.readFile(n);
                out=org.apache.commons.io.IOUtils.toByteArray(inputStream);
            }
        }
        return out;
    }


}
