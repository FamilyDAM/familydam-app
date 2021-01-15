package com.familydam.repository.modules.files.services;

import com.familydam.repository.services.IRestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * Create a new nt:File with extra mixins applied
 */
@Service
public class NodeUpdatePropertyService implements IRestService
{
    Logger log = LoggerFactory.getLogger(NodeUpdatePropertyService.class);

    public Node updateNode(Session session, String path, Map properties) throws RepositoryException, IOException {
        Node node = session.getNode(path);

        //Add mixin, if needed
        if( properties.containsKey("dam:tags") ||  properties.containsKey("dam:people") ||   properties.containsKey("dam:rating")){
            if( !node.isNodeType("dam:taggable")) {
                node.addMixin("dam:taggable");
            }
        }

        for (Object key : properties.keySet()) {
            if( key.equals("dam:tags") || key.equals("dam:people")) {
                List<String> values = Arrays.asList( (String[])properties.get(key) );
                if( values.size() == 1){
                    List tags =  Arrays
                        .asList(values.get(0).split(","))
                        .stream()
                        .filter( o -> o!=null && o.trim().length() > 0)
                        .collect(Collectors.toList());
                    values = tags;
                }
                node.setProperty((String)key, values.toArray(new String[values.size()]));
            }
            else if( !"path".equals(key) && !"jcr:primaryType".equals(key) && !"jcr:createdBy".equals(key) ){
                Object val = properties.get(key);
                if( val instanceof String )  node.setProperty((String)key, (String)val);
                if( val instanceof Double )  node.setProperty((String)key, (Double) val);
                if( val instanceof Float )  node.setProperty((String)key, (Long) val);
                if( val instanceof Integer )  node.setProperty((String)key, (Integer) val);
                if( val instanceof Boolean )  node.setProperty((String)key, (Boolean) val);
            }
        }

        session.save();
        return node;
    }



    private String cleanName(String name_){
        return name_.trim()
            .replaceAll("\\[", "(")
            .replaceAll("]", ")")
            .replaceAll(":", "")
            .replaceAll("\n", "")
            .replaceAll("\t", "")
            .replaceAll("\\+", "") //+ represent space, a real + will mess up path
            .replaceAll(" ", "+");
    }
}
