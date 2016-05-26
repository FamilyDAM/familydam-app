/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.helpers;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.familydam.core.FamilyDAMCoreConstants.HATEAOS_LINKS;


/**
 * Created by mnimer on 3/12/16.
 */
public class TreeWalker
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public static final String CHILDREN_NODE_NAME = "children";

    private Resource startNode;
    private int depth=0;
    private String[] includeTypes = null;
    private String[] includeProperties = null;


    public TreeWalker(Resource startNode_, int depth_, String[] includeTypes_, String[] includeProperties_)
    {
        this.startNode = startNode_;
        this.depth = depth_;
        this.includeTypes = includeTypes_;
        this.includeProperties = includeProperties_;
    }

    public Map walkTree()
    {
        Map treeMap = Collections.EMPTY_MAP;

        treeMap = convertResourceNode(startNode);

        if( depth > 0 ){
            Collection<Map> children = walkTree(startNode, depth);
            if( children != null && children.size() > 0) {
                treeMap.put(CHILDREN_NODE_NAME, children);
            }
        }

        return treeMap;
    }



    private Collection<Map> walkTree(Resource resource_, int depth_)
    {
        if( depth_ == 0) return null;
        --depth_;

        Collection<Map> nodes = new ArrayList();

        for (Resource _resource : resource_.getChildren()) {

            if( includeTypes != null ){
                boolean bExists = false;
                for (String includeType : includeTypes) {
                    if( _resource.getResourceType().equalsIgnoreCase(includeType) )
                    {
                        bExists = true;
                    }else {
                        String[] mixinTypesRaw = (String[]) _resource.getValueMap().get("jcr:mixinTypes");
                        if( mixinTypesRaw != null) {
                            List<String> mixinTypes = Arrays.asList(mixinTypesRaw);
                            if (mixinTypes.indexOf(includeType) > -1) {
                                bExists = true;
                            }
                        }
                    }
                }
                if( !bExists ) continue;
            }

            Map _node = convertResourceNode(_resource);

            if( depth_ > 0) {
                Collection<Map> children = walkTree(_resource, depth_);
                if (children != null) {
                    _node.put(CHILDREN_NODE_NAME, children);
                }
            }

            if(_node != null) {
                nodes.add(_node);
            }else{
                log.warn("Unable to convert node: " +_resource.getPath());
            }
        }

        return nodes;
    }


    private Map convertResourceNode(Resource resource_)
    {
        try {
            Map treeMap = new HashMap();
            if (includeProperties != null) {
                log.trace("Convert node {} to simple Map with the request properties {}", resource_.getPath(), includeProperties);
                Map _startMap = resource_.adaptTo(ValueMap.class);
                Node _startNode = resource_.adaptTo(Node.class);

                treeMap.put("_links", hateosDecorator(resource_));
                for (String _prop : includeProperties) {

                    if( _prop.equals("name") ){
                        treeMap.put("name", _startNode.getName());
                    } else if( _prop.equals("links")  && _startMap.containsKey(HATEAOS_LINKS)){
                        treeMap.put(HATEAOS_LINKS, _startMap.get(HATEAOS_LINKS));
                    } else if( _prop.equals("path") ){
                        treeMap.put("path", _startNode.getPath());
                    } else if( _prop.equals("links") && _startNode.hasProperty(HATEAOS_LINKS) ){
                        treeMap.put(HATEAOS_LINKS, _startNode.getProperty(HATEAOS_LINKS));
                    } else if( _prop.equals("index") ){
                        treeMap.put("index", _startNode.getIndex());
                    } else if( _prop.equals("parent") ){
                        treeMap.put("parent", _startNode.getParent().getPath());
                    } else if( _prop.equals("jcr:mixinTypes") ){
                        treeMap.put("jcr:mixinTypes", resource_.getValueMap().get("jcr:mixinTypes"));
                    } else {
                        Object val = _startMap.get(_prop);
                        if( val != null ) {
                            if (val instanceof Calendar) {
                                treeMap.put(_prop, ((Calendar) val).getTime().toGMTString());
                            } else {
                                treeMap.put(_prop, val);
                            }
                        }else{
                            Resource childResource = resource_.getChild(_prop);
                            if( childResource != null && childResource.hasChildren() ){
                                treeMap.put(_prop, mapChild(childResource));
                            } else if( childResource != null && !childResource.hasChildren() ){
                                treeMap.put(_prop, childResource.adaptTo(Map.class));
                            }
                        }
                        /**
                        if( val.getType() == PropertyType.DATE ){
                            treeMap.put(_prop, val.getString());
                        } else if( val.getType() == PropertyType.NAME ){
                            treeMap.put(_prop, val.getString());
                        } else {
                            treeMap.put(_prop, val);
                        } **/
                    }
                }
            } else {
                treeMap = new HashMap();
                treeMap.putAll(startNode.adaptTo(Map.class));
                treeMap.put(HATEAOS_LINKS, hateosDecorator(resource_));
            }
            return treeMap;
        }catch(Exception re){
            return startNode.adaptTo(Map.class);
        }
    }


    private Object hateosDecorator(Resource resource_)
    {
        Map linksMap = new HashMap();
        linksMap.put("self", resource_.getPath());

        if (isFile(resource_)) {
            linksMap.put("delete", resource_.getPath()); //todo check permission
            linksMap.put("download", resource_.getPath());  //todo check permission
        }
        if (isFolder(resource_)) {
            linksMap.put("delete", resource_.getPath()); //todo check permission
        }
        if (isDamImage(resource_)) {
            String _path = resource_.getPath().substring(0, resource_.getPath().lastIndexOf("."));
            String _ext = resource_.getPath().substring(resource_.getPath().lastIndexOf("."));
            linksMap.put("thumb", _path + ".resize.250.250." +_ext);
            linksMap.put("resize", _path + ".resize.{size}." +_ext);
        }

        return linksMap;
    }


    private Object mapChild(Resource resource_)
    {
        String resourceType = resource_.getResourceType();
        if(resource_.hasChildren() ) {
            Map props = new HashMap();
            props.putAll(resource_.adaptTo(Map.class));

            for (Resource resource : resource_.getChildren()) {
                if( resource.getResourceType().equalsIgnoreCase("nt:unstructured") ) {
                    props.put(resource.getName(), mapChild(resource));
                }else{
                    props.put(resource.getName(), resource.getValueMap());
                }
            }

            return props;
        }else{
            return resource_.getValueMap();
        }
    }





    private boolean isFile(Resource resource)
    {
        try {
            return resource.adaptTo(javax.jcr.Node.class).isNodeType("nt:file");
        }
        catch (RepositoryException re) {
            return false;
        }
    }

    private boolean isFolder(Resource resource)
    {
        try {
            return resource.adaptTo(javax.jcr.Node.class).isNodeType("nt:folder")
                    || resource.adaptTo(javax.jcr.Node.class).isNodeType("sling:Folder");
        }
        catch (RepositoryException re) {
            return false;
        }
    }


    private boolean isDamImage(Resource resource)
    {
        try {
            return resource.adaptTo(javax.jcr.Node.class).isNodeType("dam:image");
        }
        catch (RepositoryException re) {
            return false;
        }
    }


}
