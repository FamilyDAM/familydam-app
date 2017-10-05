package com.familydam.apps.files.decorators;

import com.familydam.core.utilities.ValueMapWrapper;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceDecorator;

import javax.servlet.http.HttpServletRequest;

@Component(immediate = true)
@Service
public class PathDecorator implements ResourceDecorator
{
    @Override
    public Resource decorate(Resource resource) {

        if( resource.getPath().startsWith("/content") ) {
            ValueMapWrapper wrapper = new ValueMapWrapper(resource);
            wrapper.put(JcrConstants.JCR_PATH, resource.getPath());
            return wrapper;
        }

        return resource;
    }

    @Override
    public Resource decorate(Resource resource, HttpServletRequest request) {
        return decorate(resource);
    }
}
