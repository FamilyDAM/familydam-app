/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.decorators;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceDecorator;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

import static com.familydam.apps.dashboard.FamilyDAMDashboardConstants.HATEAOS_LINKS;

/**
 * Created by mnimer on 3/13/16.
 */
//@Component(metatype = true)
//@Service
//@Property(name = "service.description", value = "Add Hateaos Links to Resources before being returned")
public class HateaosDecorator implements ResourceDecorator
{
    @Override public Resource decorate(Resource resource)
    {
        if (!resource.getPath().startsWith("/content")) {
            return resource;
        }

        if( !isFileOrFolder(resource) ){
            return resource;
        }


        ValueMapWrapper wrapper = new ValueMapWrapper(resource);

        Map linksMap = new HashMap();
        linksMap.put("self", resource.getPath() +".json");

        if (isFile(resource)) {
            linksMap.put("delete", resource.getPath()); //todo check permission
            linksMap.put("download", resource.getPath());  //todo check permission
        }
        if (isFolder(resource)) {
            linksMap.put("delete", resource.getPath()); //todo check permission
        }
        if (isDamImage(resource)) {
            String _path = resource.getPath().substring(0, resource.getPath().lastIndexOf("."));
            String _ext = resource.getPath().substring(resource.getPath().lastIndexOf("."));
            linksMap.put("thumb", _path + ".resize.250" +_ext);
            linksMap.put("resize", _path + ".resize.{size}.{format}");
        }

        wrapper.put(HATEAOS_LINKS, linksMap);
        return wrapper;

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


    private boolean isFileOrFolder(Resource resource)
    {
        try {
            if( !resource.isResourceType("sling:syntheticStarResource") ) {
                return resource.adaptTo(javax.jcr.Node.class).isNodeType("nt:file")
                        || resource.adaptTo(javax.jcr.Node.class).isNodeType("nt:folder")
                        || resource.adaptTo(javax.jcr.Node.class).isNodeType("sling:Folder");
            }
        }
        catch (Exception re) {
            return false;
        }
        return false;
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


    @Override public Resource decorate(Resource resource, HttpServletRequest request)
    {
        return decorate(resource);
    }


}
