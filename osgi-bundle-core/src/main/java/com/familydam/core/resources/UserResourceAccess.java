/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core.resources;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.security.AccessSecurityException;
import org.apache.sling.resourceaccesssecurity.AllowingResourceAccessGate;
import org.apache.sling.resourceaccesssecurity.ResourceAccessGate;

/**
 * Created by mnimer on 6/2/16.
 */
@Component
@Properties({
        @Property(name= ResourceAccessGate.PATH, label="Path", value="/home/users/.*"),
        @Property(name=ResourceAccessGate.OPERATIONS, value="read,update,create,delete", propertyPrivate=true),
        @Property(name=ResourceAccessGate.CONTEXT, value=ResourceAccessGate.APPLICATION_CONTEXT, propertyPrivate=true)
})
public class UserResourceAccess extends AllowingResourceAccessGate
{
    @Override public GateResult canRead(Resource resource)
    {
        return super.canRead(resource);
    }


    @Override public GateResult canReadValue(Resource resource, String valueName)
    {
        return super.canReadValue(resource, valueName);
    }


    @Override public boolean canReadAllValues(Resource resource)
    {
        return super.canReadAllValues(resource);
    }


    @Override public boolean hasReadRestrictions(ResourceResolver resourceResolver)
    {
        return super.hasReadRestrictions(resourceResolver);
    }


    @Override public boolean hasCreateRestrictions(ResourceResolver resourceResolver)
    {
        return super.hasCreateRestrictions(resourceResolver);
    }


    @Override public boolean hasUpdateRestrictions(ResourceResolver resourceResolver)
    {
        return super.hasUpdateRestrictions(resourceResolver);
    }


    @Override public boolean hasDeleteRestrictions(ResourceResolver resourceResolver)
    {
        return super.hasDeleteRestrictions(resourceResolver);
    }


    public UserResourceAccess()
    {
        super();
    }


    @Override public GateResult canCreate(String absPathName, ResourceResolver resourceResolver)
    {
        return super.canCreate(absPathName, resourceResolver);
    }


    @Override public GateResult canUpdate(Resource resource)
    {
        return super.canUpdate(resource);
    }


    @Override public GateResult canDelete(Resource resource)
    {
        return super.canDelete(resource);
    }


    @Override public GateResult canExecute(Resource resource)
    {
        return super.canExecute(resource);
    }


    @Override public GateResult canCreateValue(Resource resource, String valueName)
    {
        return super.canCreateValue(resource, valueName);
    }


    @Override public GateResult canUpdateValue(Resource resource, String valueName)
    {
        return super.canUpdateValue(resource, valueName);
    }


    @Override public GateResult canDeleteValue(Resource resource, String valueName)
    {
        return super.canDeleteValue(resource, valueName);
    }


    @Override
    public String transformQuery(String query, String language, ResourceResolver resourceResolver) throws AccessSecurityException
    {
        return super.transformQuery(query, language, resourceResolver);
    }


    @Override public boolean hasExecuteRestrictions(ResourceResolver resourceResolver)
    {
        return super.hasExecuteRestrictions(resourceResolver);
    }


    @Override public boolean canCreateAllValues(Resource resource)
    {
        return super.canCreateAllValues(resource);
    }


    @Override public boolean canUpdateAllValues(Resource resource)
    {
        return super.canUpdateAllValues(resource);
    }


    @Override public boolean canDeleteAllValues(Resource resource)
    {
        return super.canDeleteAllValues(resource);
    }
}
