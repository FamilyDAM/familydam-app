/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.decorators;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by mnimer on 3/14/16.
 */
public class ValueMapWrapper extends ResourceWrapper
{

    private Map<String, Object> data = new HashMap<String, Object>();


    public ValueMapWrapper(Resource resource)
    {
        super(resource);
        final ValueMap valueMap = super.adaptTo(ValueMap.class);
        this.data.putAll(valueMap);
    }

    public void remove(String key) {
        this.data.remove(key);
    }

    public void removeAll(String... keys) {
        for(final String key : keys) {
            remove(key);
        }
    }

    public void putAll(Map<? extends String, Object> map) {
        this.data.putAll(map);
    }

    public void put(String key, Object value) {
        this.data.put(key, value);
    }

    public void replaceAll(Map<String, Object> map) {
        if(map == null) {
            this.data = new HashMap<String, Object>();
        }  else {
            this.data = map;
        }
    }




    @Override
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        if (type != ValueMap.class) {
            return super.adaptTo(type);
        }

        Map<String, Object> map = new HashMap<String, Object>(this.data);

        return (AdapterType) new ValueMapDecorator(map);
    }
}
