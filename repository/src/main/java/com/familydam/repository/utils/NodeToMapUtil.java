package com.familydam.repository.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import java.util.HashMap;
import java.util.Map;

public class NodeToMapUtil
{
    static Logger log = LoggerFactory.getLogger(NodeToMapUtil.class);

    public static Map convert(Node node) throws RepositoryException {
        Map obj = new HashMap();

        //convert root properties
        convertProperties(node, obj);

        //walk the tree and map child nodes
        if( node.hasNodes() ){
            NodeIterator nodeIterator = node.getNodes();
            while( nodeIterator.hasNext() ){
                Node n = nodeIterator.nextNode();

                obj.put(n.getName(), new HashMap());
                convertProperties(n, (Map)obj.get(n.getName()));
            }
        }

        return obj;
    }

    protected static void convertProperties(Node node, Map obj) throws RepositoryException {
        PropertyIterator propertyIterator = node.getProperties();
        while(propertyIterator.hasNext()){
            try {
                Property property = (Property) propertyIterator.next();

                //skip internal props
                if( isInternalProp(property) ) continue;

                if (PropertyType.BOOLEAN == property.getType()) {
                    obj.put(property.getName(), property.getBoolean());
                } else if (PropertyType.LONG == property.getType()) {
                    obj.put(property.getName(), property.getLong());
                } else {
                    obj.put(property.getName(), property.getString());
                }
                //todo, support more types

            }catch (RepositoryException ex){
                throw ex;
            }catch (Exception ex){
                log.error(ex.getMessage(), ex);
            }
        }
    }

    private static boolean isInternalProp(Property property) throws RepositoryException {
        if( "rep:password".equals(property.getName()) ) return true;
        else if( "rep:authorizableId".equals(property.getName()) ) return true;
        return false;
    }
}
