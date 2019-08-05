package com.familydam.repository.utils;

import com.familydam.repository.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NodeToMapUtil
{
    static Logger log = LoggerFactory.getLogger(NodeToMapUtil.class);


    public static Map convert(Node node) throws RepositoryException {
        return convert(node, true);
    }


    public static Map convert(Node node, boolean includeChildNodes) throws RepositoryException {
        Map obj = new HashMap();

        //convert root properties
        convertProperties(node, obj);

        //walk the tree and map child nodes

        if( includeChildNodes && node.hasNodes() ){
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

        obj.put("name", node.getName());
        obj.put("path", node.getPath());


        obj.put("name", node.getName());
        obj.put("path", node.getPath());
        obj.put("index", node.getIndex());
        obj.put(Constants.HATEAOS_LINKS, hateosDecorator(node));



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
                } else if (PropertyType.STRING == property.getType()) {
                    obj.put(property.getName(), property.getString());
                } else if (PropertyType.DATE == property.getType()) {
                    obj.put(property.getName(), property.getDate());
                } else if (PropertyType.DECIMAL == property.getType()) {
                    obj.put(property.getName(), property.getDecimal());
                }  else if (PropertyType.DOUBLE == property.getType()) {
                    obj.put(property.getName(), property.getDouble());
                }  else if (PropertyType.NAME == property.getType()) {
                    if( property.isMultiple() ){
                        Value[] values = property.getValues();
                        List valueList = new ArrayList();
                        for (int i = 0; i < values.length; i++) {
                            Value v = values[i];
                            valueList.add(v.getString());
                        }
                        obj.put(property.getName(), valueList);
                    }else {
                        Value value = property.getValue();
                        if( PropertyType.NAME == property.getType() || PropertyType.STRING == property.getType() ) {
                            obj.put(property.getName(), value.getString());
                        }
                    }
                }  else if (PropertyType.BINARY == property.getType()) {
                    //skip binary
                } else {
                    log.warn("Unknown property type: '" +property.getType() +"' for property: '" +property.getName()+"'");
                    //obj.put(property.getName(), property.getString());
                }
                //todo, support more types

            }catch (RepositoryException ex){
                throw ex;
            }catch (Exception ex){
                log.error(ex.getMessage(), ex);
            }
        }


        //Special mapping override
        if( obj.get("jcr:primaryType").equals("nt:unstructured")){
            obj.put("jcr:primaryType", "nt:folder");
        }else{
            obj.put("jcr:primaryType", obj.get("jcr:primaryType"));
        }

    }

    private static boolean isInternalProp(Property property) throws RepositoryException {
        if( "rep:password".equals(property.getName()) ) return true;
        else if( "rep:authorizableId".equals(property.getName()) ) return true;
        return false;
    }


    private static Object hateosDecorator(Node node_) throws RepositoryException
    {
        Map linksMap = new HashMap();
        linksMap.put("self", node_.getPath());

        if (isFile(node_)) {
            linksMap.put("delete", node_.getPath()); //todo check permission
            linksMap.put("download", node_.getPath() + "?download=true");  //todo check permission
        }
        if (isFolder(node_)) {
            linksMap.put("delete", node_.getPath()); //todo check permission
        }
        if (isDamImage(node_)) {
            String _path = node_.getPath().substring(0, node_.getPath().lastIndexOf("."));
            String _ext = node_.getPath().substring(node_.getPath().lastIndexOf("."));
            linksMap.put("thumb", node_.getPath() + "?size=250");
            linksMap.put("resize", node_.getPath() + "?size={size}");
        }

        return linksMap;
    }


    private static boolean isFile(Node node) throws RepositoryException
    {
        return node.isNodeType(NodeType.NT_FILE);
    }

    private static boolean isFolder(Node node) throws RepositoryException
    {
        return node.isNodeType(NodeType.NT_FOLDER);
    }

    private static boolean isDamImage(Node node) throws RepositoryException
    {
        return node.isNodeType(Constants.DAM_IMAGE);
    }
}
