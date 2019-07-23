package com.familydam.repository.utils;

import org.apache.jackrabbit.api.security.user.Authorizable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class AuthorizableToMapUtil
{
    static Logger log = LoggerFactory.getLogger(AuthorizableToMapUtil.class);


    public static Map convert(Authorizable node) throws RepositoryException {
        Map obj = new HashMap();

        //convert root properties
        convertProperties(node, obj);

        return obj;
    }



    protected static void convertProperties(Authorizable node, Map obj) throws RepositoryException {
        Iterator<String> propertyIterator = node.getPropertyNames();
        while(propertyIterator.hasNext()){
            try {
                String property = propertyIterator.next();
                Value[] value = node.getProperty(property);

                //skip internal props
                if( isInternalProp(value) ) continue;

                /**
                if (PropertyType.BOOLEAN == property.getType()) {
                    obj.put(property.getName(), property.getBoolean());
                } else if (PropertyType.LONG == property.getType()) {
                    obj.put(property.getName(), property.getLong());
                } else {
                    obj.put(property.getName(), property.getString());
                }
                //todo, support more types
                 **/

            }catch (RepositoryException ex){
                throw ex;
            }catch (Exception ex){
                log.error(ex.getMessage(), ex);
            }
        }
    }

    private static boolean isInternalProp(Value[] property) throws RepositoryException {
        return false;
    }
}
