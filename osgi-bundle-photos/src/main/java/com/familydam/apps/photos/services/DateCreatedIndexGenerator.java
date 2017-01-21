package com.familydam.apps.photos.services;

import com.familydam.apps.photos.FamilyDAMConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.*;
import java.text.SimpleDateFormat;
import java.time.MonthDay;
import java.util.*;

/**
 * Created by mike on 11/11/16.
 */
@Component(immediate = true)
@Service(value = DateCreatedIndexGenerator.class)
public class DateCreatedIndexGenerator
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    SimpleDateFormat dfYear = new SimpleDateFormat("yyyy");
    SimpleDateFormat dfMonth = new SimpleDateFormat("MMMM");
    SimpleDateFormat dfMonth2 = new SimpleDateFormat("MM");
    SimpleDateFormat dfDay = new SimpleDateFormat("dd");


    @Reference
    private ResourceResolverFactory resolverFactory;

    public DateCreatedIndexGenerator() {
    }

    public DateCreatedIndexGenerator(ResourceResolverFactory resolverFactory) {
        this.resolverFactory = resolverFactory;
    }




    /**
     * Force rebuild the people name index
     * @param session
     * @throws RepositoryException
     */
    public void rebuild(Session session) throws RepositoryException
    {
        //since we are rebuilding, let's delete it if it exists
        Node cacheNode = null;
        Node indexNode = null;
        Node dateListNode = null;
        if( indexExists(session) ){
            cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);
            indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
            if( indexNode.hasNode(FamilyDAMConstants.PHOTO_DATES) ) {
                dateListNode = indexNode.getNode(FamilyDAMConstants.PHOTO_DATES);
                dateListNode.remove();
            }
            session.save();
        }


        try {

            //StringBuffer sql = new StringBuffer("SELECT [" + FamilyDAMConstants.DAM_DATECREATED + "]  FROM [nt:file]  WHERE [jcr:mixinTypes] = ' dam:image' AND [" + FamilyDAMConstants.DAM_DATECREATED + "] is not null");
            StringBuffer sql = new StringBuffer("SELECT [").append(FamilyDAMConstants.DAM_DATECREATED).append("]  FROM [nt:file] WHERE [jcr:path] like '/content/%'  AND [jcr:mixinTypes] = '").append(FamilyDAMConstants.DAM_IMAGE).append("' AND [").append(FamilyDAMConstants.DAM_DATECREATED).append("] is not null");

            QueryManager queryManager = session.getWorkspace().getQueryManager();
            //Query query = queryManager.createQuery(sql, "JCR-SQL2");
            Query query = queryManager.createQuery(sql.toString(), Query.JCR_SQL2);

            // Execute the query and get the results ...
            QueryResult result = query.execute();

            RowIterator nodeItr = result.getRows();
            while (nodeItr.hasNext()) {

                Row row = nodeItr.nextRow();

                Calendar date = row.getValue(FamilyDAMConstants.DAM_DATECREATED).getDate();

                parseAndSaveDate(session, date);
            }

            if( !dateListNode.getNodes().hasNext() )
            {
                dateListNode.remove();
            }

            session.save();

        }catch (Exception ex){
            if( dateListNode != null ) {
                dateListNode.remove();
                session.save();
            }
        }
    }



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
    public void addToIndex(Session session, Calendar[] items) throws RepositoryException, org.apache.sling.api.resource.LoginException
    {
        if( session == null ){
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            session = adminResolver.adaptTo(Session.class);
        }

        for (Calendar date : items) {
            parseAndSaveDate(session, date);
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



    private void parseAndSaveDate(Session session, Calendar date_) throws RepositoryException
    {
        Node cacheNode = session.getRootNode().getNode(FamilyDAMConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMConstants.PHOTO_DATES) ){
            indexNode.addNode(FamilyDAMConstants.PHOTO_DATES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node dateNode = indexNode.getNode(FamilyDAMConstants.PHOTO_DATES);




        Integer year = date_.get(Calendar.YEAR);
        Integer monthNumber = date_.get(Calendar.MONTH)+1;
        Integer day = date_.get(Calendar.DAY_OF_MONTH);
        String monthName = MonthDay.of(monthNumber, day).getMonth().name();



        Node yearNode;
        if ( !dateNode.hasNode(year.toString()) ) {
            yearNode = dateNode.addNode(year.toString());
            yearNode.setProperty("key", year);
            yearNode.setProperty("name", year);
            yearNode.setProperty("year", year);
            yearNode.setProperty("count", 1l);
            session.save();
        }else{
            yearNode = dateNode.getNode(year.toString());
            //yearNode.setProperty("count", yearNode.getProperty("count").getLong()+1);
        }


        Node monthNode;
        if ( !yearNode.hasNode(monthNumber.toString()) ) {
            monthNode = yearNode.addNode(monthNumber.toString());
            monthNode.setProperty("key", year + "-" + monthNumber);
            monthNode.setProperty("name", monthName);
            monthNode.setProperty("year", year);
            monthNode.setProperty("month", monthNumber);
            monthNode.setProperty("count", 1l);
            session.save();
        }else{
            monthNode = yearNode.getNode(monthNumber.toString());
            //monthNode.setProperty("count", monthNode.getProperty("count").getLong()+1);
        }


        Node dayNode;
        if (!monthNode.hasNode(day.toString())) {
            dayNode = monthNode.addNode(day.toString());
            dayNode.setProperty("key", year + "-" + monthNumber + "-" + day);
            dayNode.setProperty("name", day);
            dayNode.setProperty("year", year);
            dayNode.setProperty("month", monthNumber);
            dayNode.setProperty("day", day);
            dayNode.setProperty("count", 1l);
            session.save();
        }else{
            dayNode = monthNode.getNode(day.toString());
            dayNode.setProperty("count", dayNode.getProperty("count").getLong()+1);
        }

        session.save();

    }
}
