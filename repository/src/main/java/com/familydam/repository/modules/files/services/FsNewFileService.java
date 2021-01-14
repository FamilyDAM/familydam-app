package com.familydam.repository.modules.files.services;

import com.familydam.repository.Constants;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;


/**
 * Create a new nt:File with extra mixins applied
 */
@Service
public class FsNewFileService implements IRestService
{
    Logger log = LoggerFactory.getLogger(FsNewFileService.class);

    /**
     *
     * @param request
     * @param session
     * @return  String - location/url of new resource
     * @throws RepositoryException
     * @throws IOException
     */
    public List<String> createFile(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException, IOException {
        String name;
        String destination;
        List<MultipartFile> files;


        name = request.getParameter("name");
        destination = request.getServletPath() +"/" + request.getParameter("destination");
        if( destination.indexOf(name) > -1){
            //remove file name from end
            //remove any // dividers in path
            destination = destination.replaceAll("\\/\\/", "/").substring(0, destination.indexOf(name));
        }
        //a list, but client always sends 1 file
        files = request.getMultiFileMap().get("file");


        //Check folder permission
        if( !session.hasPermission(destination, Session.ACTION_ADD_NODE) ){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid write permissions for node '" +destination +"'");
        }


        List<String> uploadedNodePaths = new ArrayList<>();
        //Upload 1st file in path
        Node destNode = JcrUtils.getOrCreateByPath(destination, NodeType.NT_FOLDER,  session);
        try {
            for (MultipartFile file : files) {

                Node n = JcrUtils.putFile(destNode, cleanName(name), file.getContentType(), file.getInputStream());
                if (file.getContentType().startsWith("image")) {
                    n.addMixin(Constants.DAM_IMAGE);
                    n.addMixin(Constants.DAM_TAGGABLE);
                }
                n.addMixin(Constants.MIXIN_DAM_EXTENSIBLE);

                if (request.getParameter(Constants.DAM_DATECREATED) != null) {
                    Calendar dateCreatedCal = Calendar.getInstance();
                    dateCreatedCal.setTimeInMillis(new Long(request.getParameter(Constants.DAM_DATECREATED)));
                    n.setProperty(Constants.DAM_DATECREATED, dateCreatedCal);
                }
                if (request.getParameter(Constants.DAM_DATEMODIFIED) != null) {
                    Calendar dateModCal = Calendar.getInstance();
                    dateModCal.setTimeInMillis(new Long(request.getParameter(Constants.DAM_DATEMODIFIED)));
                    n.setProperty(Constants.DAM_DATEMODIFIED, dateModCal);
                }

                session.save();
                log.info("File Created: " + n.getPath() + " | thread=" + Thread.currentThread().getId());
                uploadedNodePaths.add(URI.create(URLEncoder.encode(n.getPath())).toString());
            }

            return uploadedNodePaths;
        }catch (Exception ex){
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unknown error uploading file | " +ex.getMessage());
        }
    }



    private String cleanName(String name_){
        return name_.trim().replaceAll("\\[", "(").replaceAll("]", ")").replaceAll(":", "").replaceAll("\n", "").replaceAll(" ", "+");
    }
}
