package com.familydam.apps.photos.services;

import com.familydam.apps.photos.FamilyDAMConstants;
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
@Service(value= PeopleIndexGenerator.class)
public class PeopleIndexGenerator
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;


    /**
     * Check if index exists
     * @param session
     * @return
     * @throws RepositoryException
     */
    public boolean indexExists(Session session) throws RepositoryException
    {
        Node _caches = session.getRootNode().getNode(FamilyDAMConstants.CACHES);

        if( _caches.hasNode(FamilyDAMConstants.INDEXES) && _caches.getNode(FamilyDAMConstants.INDEXES).hasNode(FamilyDAMConstants.PHOTO_PEOPLE))
        {
            return true;
        }

        return false;
    }


    /**
     * add a new property to the index
     * @param session
     * @param items
     * @throws RepositoryException
     */
    public void addToIndex(Session session, String[] items) throws RepositoryException
    {
        Node cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMConstants.PHOTO_PEOPLE) ){
            indexNode.addNode(FamilyDAMConstants.PHOTO_PEOPLE, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node peopleListNode = indexNode.getNode(FamilyDAMConstants.PHOTO_PEOPLE);


        for (String key : items) {
            if( !peopleListNode.hasNode(key) ){
                Node propNode = peopleListNode.addNode(key, JcrConstants.NT_UNSTRUCTURED);
                propNode.setProperty("count", 1l );
            }
        }

        session.save();
    }


    /**
     * remove the value from the index (for now this is handled by a scheduled rebuilt of the index)
     * @param session
     * @param items
     * @throws RepositoryException
     */
    public void removeFromIndex(Session session, String[] items) throws RepositoryException
    {

    }


    /**
     * return all of the data in the index
     * @param session
     * @return
     * @throws RepositoryException
     */
    public List<Map> getList(Session session) throws RepositoryException
    {
        String _path = "/" +FamilyDAMConstants.CACHES +"/" +FamilyDAMConstants.INDEXES +"/" +FamilyDAMConstants.PHOTO_PEOPLE;
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


    /**
     * Force rebuild the people name index
     * @param session
     * @throws RepositoryException
     */
    public void rebuild(Session session) throws RepositoryException
    {
        //since we are rebuilding, let's delete it if it exists
        if( indexExists(session) ){
            Node cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);
            Node indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
            Node peopleListNode = indexNode.getNode(FamilyDAMConstants.PHOTO_PEOPLE);
            peopleListNode.remove();
            session.save();
        }




        StringBuffer sql = new StringBuffer("SELECT [dam:people]  FROM [dam:image] where [dam:people] is not null");

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
                tags = node.getProperty("dam:people").getValues();
            }catch (ValueFormatException ex){
                tags = (Value[])Arrays.asList(node.getProperty("dam:people").getValue()).toArray();
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



        Node cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMConstants.PHOTO_PEOPLE) ){
            indexNode.addNode(FamilyDAMConstants.PHOTO_PEOPLE, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node peopleListNode = indexNode.getNode(FamilyDAMConstants.PHOTO_PEOPLE);


        for (String key : _nodeMap.keySet()) {

            if( !peopleListNode.hasNode(key) ){

                Node propNode = peopleListNode.addNode(key, JcrConstants.NT_UNSTRUCTURED);
                propNode.setProperty("count", new LongValue(_nodeMap.get(key)));
            }
        }

        session.save();
    }
}
