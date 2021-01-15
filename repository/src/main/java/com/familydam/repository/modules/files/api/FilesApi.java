package com.familydam.repository.modules.files.api;

import com.familydam.repository.models.ContentNode;
import com.familydam.repository.modules.auth.config.security.JcrAuthToken;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.files.models.FileNode;
import com.familydam.repository.modules.files.models.FolderNode;
import com.familydam.repository.modules.files.services.*;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class FilesApi {

    Logger log = LoggerFactory.getLogger(FilesApi.class);


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



    @GetMapping(value = {"/content/files", "/content/files/**"})
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
        if( ( !"application/json".equals(accept) || !"application/hal+json".equals(accept) )
                && n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) )
        {

            byte[] out = readFileSteam(n, request.getParameter("size"));
            HttpHeaders responseHeaders = getFileStreamHeaders(request.getParameterMap(), n);
            responseHeaders.add("Content-Type", n.getNode("jcr:content").getProperty("jcr:mimeType").getString());
            if( request.getParameterMap().containsKey("download") ) {
                responseHeaders.add("content-disposition", "attachment; filename=" + request.getParameter("download"));
            }

            //return stream
            if( out != null ) {
                return new ResponseEntity(out, responseHeaders, HttpStatus.OK);
            }else{
                return ResponseEntity.notFound().build();
            }
        }

        // Get Data for Single Node (json of properties)
//        else if( n.getPrimaryNodeType().isNodeType(NodeType.NT_FILE) ) {
//            //todo convert to Hal+EntityModel
//            Map nodeMap = NodeToMapUtil.convert(n);
//            return ResponseEntity.ok(nodeMap);
//        }


        //Get list of all child nodes
        else {
            List<ContentNode> nodes = fsListService.listNodes(session, path);

            List<EntityModel<ContentNode>> entityNodes = nodes.stream().map((cn)->{
                Link selfLink = WebMvcLinkBuilder.linkTo(FilesApi.class).slash(cn.getPath()).withSelfRel();
                if( cn instanceof FileNode ) {
                    Link downloadLink = WebMvcLinkBuilder.linkTo(FilesApi.class).slash(cn.getPath() + "?download=" + cn.getName()).withRel("download");
                    return EntityModel.of(cn, selfLink, downloadLink);
                }else{
                    //todo add support for downloading zip of all files in a folder
                    return EntityModel.of(cn, selfLink);
                }
            }).collect(Collectors.toList());

            RepresentationModel model = HalModelBuilder
                .emptyHalModel()
                .embed(entityNodes)
                .link(WebMvcLinkBuilder.linkTo(FilesApi.class).slash(path).withSelfRel())
                .build();
            return ResponseEntity.ok(model);
        }
    }


    /**
     * Modify the whole object, including the binary file
     * @param principal
     * @param request
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    @PostMapping(value = {"/content/files/**"})
    public ResponseEntity postEntry(Principal principal, StandardMultipartHttpServletRequest request) throws RepositoryException, IOException
    {
        Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );
        //Session session = repo.login( new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()) );

        String type = request.getParameter("jcr:primaryType");
        if( "nt:folder".equals(type)){
            String folderPath = fsNewFolderService.createFolder(request, session);

            var model = HalModelBuilder
                .emptyHalModel()
                .link(WebMvcLinkBuilder.linkTo(FilesApi.class).slash(folderPath).withSelfRel())
                .build();
            return ResponseEntity.ok(model); //todo set in header and return hateoas link
        } else {
            List<String> uploadNodePaths = fsNewFileService.createFile(request, session);
            return ResponseEntity.created( URI.create(uploadNodePaths.get(0))  ).build(); //return hateoas link version
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
    @PutMapping(value = {"/content/files/**"})
    public ResponseEntity putEntry(Principal principal, HttpServletRequest request, @RequestBody String fileOrFolder) throws RepositoryException, IOException
    {
        Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );

        if( !session.hasPermission(request.getRequestURI(), Session.ACTION_SET_PROPERTY) ){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Map jsonProps = new ObjectMapper().readValue(fileOrFolder, Map.class);
        if( "nt:folder".equals(jsonProps.get("primaryType")) ){
            FolderNode folder = new ObjectMapper().readValue(fileOrFolder, FolderNode.class);
            nodeUpdatePropertyService.updateNode(session, request.getRequestURI(), folder.toJcrMap());
            return ResponseEntity.ok().build();

        }else if( "nt:file".equals(jsonProps.get("primaryType")) ){
            FileNode file = new ObjectMapper().readValue(fileOrFolder, FileNode.class);
            nodeUpdatePropertyService.updateNode(session, request.getRequestURI(), file.toJcrMap());
            return ResponseEntity.ok().build();
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid Node Type, only nt:folder or nt:file nodes are allowed");

    }



    @DeleteMapping(value = {"/content/files/**"})
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
