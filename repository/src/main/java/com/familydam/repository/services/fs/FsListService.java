package com.familydam.repository.services.fs;

import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.jcr.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class FsListService
{
    Logger log = LoggerFactory.getLogger(FsListService.class);


    public List<Map> listNodes(Session session, String path) throws RepositoryException
    {
        Iterable<Node> childNodes;
        if( path.startsWith("/")) {
            path = path.substring(1);
        }

        if(StringUtils.isEmpty(path)){
            childNodes = JcrUtils.getChildNodes(session.getRootNode());
        }else{
            childNodes = JcrUtils.getChildNodes(session.getRootNode().getNode(path));
        }


        return StreamSupport.stream(childNodes.spliterator(), false).map(node -> {
            try {
                Map nodeProps = new HashMap();
                nodeProps.put("name", node.getName());
                nodeProps.put("path", node.getPath());

                PropertyIterator propertyIterator = node.getProperties();
                while(propertyIterator.hasNext()){
                    Property prop = (Property)propertyIterator.next();
                    if (prop.getType() == PropertyType.STRING) {
                        nodeProps.put(prop.getName(), prop.getString());
                    }
                }

                return nodeProps;
            }catch (RepositoryException re){
                log.error(re.getMessage(), re);
            }
            return null;
        }).collect(Collectors.toList());
    }
}
