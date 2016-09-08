/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.resources;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceDecorator;
import org.apache.sling.api.resource.ResourceResolverFactory;

import javax.jcr.Node;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by mnimer on 6/2/16.
 */
@Service
@Component
@Property(name = "service.description", value = "remove secure user properties")
public class UserDecorator implements ResourceDecorator
{
    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    /**
     * Remove the dam:security public/private key information from any user data that might get returned by the rest api
     * @param resource
     * @return
     */
    @Override public Resource decorate(Resource resource)
    {
        try {
            if (resource != null
                    && resource.getPath().startsWith("/home/users")
                    && resource.adaptTo(Node.class) != null
                    && resource.adaptTo(Node.class).hasNode("dam:security")) {
                resource.adaptTo(Node.class).getNode("dam:security").remove();
            }
        }catch(Exception re){}

        return resource;
    }


    @Override public Resource decorate(Resource resource, HttpServletRequest request)
    {
        try {
            if (resource != null && resource.adaptTo(Node.class) != null && resource.adaptTo(Node.class).hasNode("dam:security")) {
                resource.adaptTo(Node.class).getNode("dam:security").remove();
            }
        }catch(Exception re){}

        return resource;
    }


}
