package com.familydam.repository.modules.files.services;

import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;

/**
 * Create a new nt:folder
 */
@Service
public class FsNewFolderService implements IRestService
{
    public String createFolder(StandardMultipartHttpServletRequest request, Session session) throws RepositoryException
    {
        String dir = request.getRequestURI();
        if( !dir.endsWith("/") ) dir = dir +"/";

        String name = request.getParameter("name");

        Node n = JcrUtils.getOrCreateByPath(dir +name, NodeType.NT_FOLDER, session);
        session.save();
        return n.getPath();
    }
}
