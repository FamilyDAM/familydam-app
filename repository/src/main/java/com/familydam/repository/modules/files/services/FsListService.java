package com.familydam.repository.modules.files.services;

import com.familydam.repository.models.ContentNode;
import com.familydam.repository.models.UnstructuredNode;
import com.familydam.repository.modules.files.models.FileNode;
import com.familydam.repository.modules.files.models.FolderNode;
import com.familydam.repository.services.IRestService;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Get all files under path, under /content
 */
@Service
public class FsListService implements IRestService
{
    Logger log = LoggerFactory.getLogger(FsListService.class);


    public List<ContentNode> listNodes(Session session, String path) throws RepositoryException
    {
        Iterable<Node> childNodes;

        Node n;
        if(StringUtils.isEmpty(path)){
            n = JcrUtils.getNodeIfExists("/content", session);
        }else{
            n = JcrUtils.getNodeIfExists(path, session);
        }

        if( n == null ) {
            log.warn("Invalid Path was requested '" +path +"'");
            return Collections.EMPTY_LIST;
        }

        childNodes = JcrUtils.getChildNodes(n);


        return StreamSupport
            .stream(childNodes.spliterator(), false)
            .filter(node -> {
                try {
                    return node.getPrimaryNodeType().isNodeType(NodeType.NT_FILE)
                        || node.getPrimaryNodeType().isNodeType(NodeType.NT_FOLDER)
                        || node.getPrimaryNodeType().isNodeType(NodeType.NT_UNSTRUCTURED);
                }catch(RepositoryException ex){
                    return false;
                }
            })
            .map(node -> {
                try {
                    if( node.isNodeType(NodeType.NT_FOLDER)){
                        return FolderNode.builder().withNode(node).build();
                    } else if( node.isNodeType(NodeType.NT_FILE)){
                        return FileNode.builder().withNode(node).build();
                    } else {
                        return UnstructuredNode.builder().withNode(node).build();
                    }
                }catch (RepositoryException re){
                    log.error(re.getMessage(), re);
                }
                return null;
            })
            .collect(Collectors.toList());
    }
}
