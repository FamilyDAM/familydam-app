package com.familydam.apps.photos.services;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.LongValue;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.*;

/**
 * Created by mike on 11/11/16.
 */
@Component(immediate = true)
@Service(value= TagIndexGenerator.class)
public class TagIndexGenerator
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;



    public boolean indexExists(Session session) throws RepositoryException
    {
        Node _caches = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);

        if( _caches.hasNode(FamilyDAMDashboardConstants.INDEXES) && _caches.getNode(FamilyDAMDashboardConstants.INDEXES).hasNode(FamilyDAMDashboardConstants.PHOTO_TAGS))
        {
            return true;
        }

        return false;
    }




    public void addToIndex(Session session, String[] items) throws RepositoryException
    {
        Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMDashboardConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMDashboardConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_TAGS) ){
            indexNode.addNode(FamilyDAMDashboardConstants.PHOTO_TAGS, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node tagListNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_TAGS);


        for (String key : items) {
            if( !tagListNode.hasNode(key) ){
                Node propNode = tagListNode.addNode(key, JcrConstants.NT_UNSTRUCTURED);
                propNode.setProperty("count", 1l );
            }
        }

        session.save();
    }



    public void removeFromIndex(Session session, String[] items) throws RepositoryException
    {

    }



    public List<Map> getList(Session session) throws RepositoryException
    {
        String _path = "/" +FamilyDAMDashboardConstants.CACHES +"/" +FamilyDAMDashboardConstants.INDEXES +"/" +FamilyDAMDashboardConstants.PHOTO_TAGS;
        Node treeNode = JcrUtils.getOrCreateByPath(_path, JcrConstants.NT_UNSTRUCTURED, session);

        List<Map> results = new ArrayList<>();
        NodeIterator nodeIterator = treeNode.getNodes();
        while( nodeIterator.hasNext() )
        {
            Node propNode = nodeIterator.nextNode();

            Map propVal = new HashMap();
            propVal.put("name", propNode.getName());
            propVal.put("count", propNode.getProperty("count").getLong());
            results.add(propVal);

        }

        return results;
    }



    public void rebuild(Session session) throws RepositoryException
    {
        //since we are rebuilding, let's delete it if it exists
        if( indexExists(session) ){
            session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES).remove();
            session.save();
        }



        StringBuffer sql = new StringBuffer("SELECT [dam:tags]  FROM [dam:image] where [dam:tags] is not null");

        QueryManager queryManager = session.getWorkspace().getQueryManager();
        //Query query = queryManager.createQuery(sql, "JCR-SQL2");
        Query query = queryManager.createQuery(sql.toString(), Query.JCR_SQL2);

        // Execute the query and get the results ...
        QueryResult result = query.execute();


        // Iterate over the nodes in the results ...
        Map<String, Long> _nodeMap = new HashMap<>();
        List<Map> _nodeList = new ArrayList<>();
        NodeIterator nodeItr = result.getNodes();

        while (nodeItr.hasNext()) {
            Node node = nodeItr.nextNode();

            Value[] tags = new Value[0];
            try {
                tags = node.getProperty("dam:tags").getValues();
            }catch (ValueFormatException ex){
                tags = (Value[])Arrays.asList(node.getProperty("dam:tags").getValue()).toArray();
            }

            for (Value _tag : tags) {
                String tag = _tag.getString().toLowerCase();

                Long existingItemCount = _nodeMap.get(tag);
                if (existingItemCount == null) {
                    existingItemCount = 1l;
                } else {
                    existingItemCount += 1l;
                }

                _nodeMap.put(tag, existingItemCount);
            }
            //log.debug(node);
        }


        Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMDashboardConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMDashboardConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_TAGS) ){
            indexNode.addNode(FamilyDAMDashboardConstants.PHOTO_TAGS, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node tagListNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_TAGS);


        for (String key : _nodeMap.keySet()) {

            if( !tagListNode.hasNode(key) ){

                Node propNode = tagListNode.addNode(key, JcrConstants.NT_UNSTRUCTURED);
                propNode.setProperty("count", new LongValue(_nodeMap.get(key)));
            }
        }

        session.save();
    }
}
