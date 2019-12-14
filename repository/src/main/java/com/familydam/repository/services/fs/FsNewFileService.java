package com.familydam.repository.services.fs;

import com.familydam.repository.Constants;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Calendar;
import java.util.List;


/**
 * Create a new nt:File with extra mixins applied
 */
@Service
public class FsNewFileService implements IRestService
{
    Logger log = LoggerFactory.getLogger(FsNewFileService.class);

    public ResponseEntity createFile(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException, IOException {
        String name;
        String destination;
        List<MultipartFile> files;

        if( request.getParameter("filepond") != null  ){
            name = request.getHeader("Upload-Name");
            destination = request.getParameter("destination"); //todo:  get from POST  path
            //a list, but client always sends 1 file
            files = request.getMultiFileMap().get("filepond");

        }else {
            name = request.getParameter("name");
            destination = request.getParameter("destination");
            //a list, but client always sends 1 file
            files = request.getMultiFileMap().get("file");
        }

        if( !session.hasPermission(destination, Session.ACTION_ADD_NODE) ){
            return ResponseEntity.status(403).build();
        }


        Node destNode = JcrUtils.getOrCreateByPath(destination, NodeType.NT_FOLDER,  session);
        for (MultipartFile file : files) {

            Node n = JcrUtils.putFile(destNode, cleanName(name), file.getContentType(), file.getInputStream());
            if( file.getContentType().startsWith("image") ){
                n.addMixin(Constants.DAM_IMAGE);
            }
            n.addMixin(Constants.MIXIN_DAM_EXTENSIBLE);

            if( request.getParameter(Constants.DAM_DATECREATED) != null){
                Calendar dateCreatedCal = Calendar.getInstance();
                dateCreatedCal.setTimeInMillis(new Long(request.getParameter(Constants.DAM_DATECREATED)));
                n.setProperty(Constants.DAM_DATECREATED, dateCreatedCal);
            }
            if( request.getParameter(Constants.DAM_DATEMODIFIED) != null){
                Calendar dateModCal = Calendar.getInstance();
                dateModCal.setTimeInMillis(new Long(request.getParameter(Constants.DAM_DATEMODIFIED)));
                n.setProperty(Constants.DAM_DATEMODIFIED, dateModCal);
            }

            session.save();
            log.info("File Created: " +n.getPath() +" | thread=" +Thread.currentThread().getId());
            return ResponseEntity.created( URI.create(URLEncoder.encode(n.getPath())) ).build();
        }


        return ResponseEntity.badRequest().build();
    }



    private String cleanName(String name_){
        return name_.trim().replaceAll("\\[", "(").replaceAll("]", ")").replaceAll(":", "").replaceAll("\n", "").replaceAll(" ", "+");
    }
}
