package com.familydam.repository.modules.files.services;

import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import java.net.URI;

/**
 * Create a new nt:folder
 */
@Service
public class FsNewFolderService implements IRestService
{
    public ResponseEntity createFolder(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException
    {
        String name = request.getParameter("name");
        Node n = JcrUtils.getOrCreateByPath(request.getRequestURI(), NodeType.NT_FOLDER, session);
        session.save();
        return ResponseEntity.created( URI.create(n.getPath()) ).build();
    }
}
