package com.familydam.apps.photos.services;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Property;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.LongValue;
import org.apache.sling.api.resource.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.*;
import java.text.SimpleDateFormat;
import java.time.MonthDay;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mike on 11/11/16.
 */
@Component
@Service(value = Runnable.class)
@Properties({
    @Property(name = "scheduler.period", value = "30 0 * * *"), //12:30am
    @Property(name="scheduler.concurrent", boolValue=false)
})
public class DateCreatedIndexGenerator implements Runnable
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

    @Override
    public void run() {
        try {
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session session = adminResolver.adaptTo(Session.class);

            rebuild(session);
        }catch (org.apache.sling.api.resource.LoginException|RepositoryException le){
            logger.error(le.getMessage(), le);
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
        Node _caches = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);

        if( _caches.hasNode(FamilyDAMDashboardConstants.INDEXES) && _caches.getNode(FamilyDAMDashboardConstants.INDEXES).hasNode(FamilyDAMDashboardConstants.PHOTO_PEOPLE))
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
    public void addToIndex(Session session, String[] items) throws RepositoryException, org.apache.sling.api.resource.LoginException
    {
        if( session == null ){
            ResourceResolver adminResolver = null;
            adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            session = adminResolver.adaptTo(Session.class);
        }

        for (String date : items) {
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
        String _path = "/" +FamilyDAMDashboardConstants.CACHES +"/" +FamilyDAMDashboardConstants.INDEXES +"/" +FamilyDAMDashboardConstants.PHOTO_PEOPLE;
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
            Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);
            Node indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
            Node peopleListNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);
            peopleListNode.remove();
            session.save();
        }



        StringBuffer sql = new StringBuffer("SELECT [" + FamilyDAMDashboardConstants.DAM_DATECREATED + "]  FROM [dam:image] where [" + FamilyDAMDashboardConstants.DAM_DATECREATED + "] is not null");

        QueryManager queryManager = session.getWorkspace().getQueryManager();
        //Query query = queryManager.createQuery(sql, "JCR-SQL2");
        Query query = queryManager.createQuery(sql.toString(), Query.JCR_SQL2);

        // Execute the query and get the results ...
        QueryResult result = query.execute();

        RowIterator nodeItr = result.getRows();
        while (nodeItr.hasNext()) {

            Row row = nodeItr.nextRow();

            String date = row.getValue(FamilyDAMDashboardConstants.DAM_DATECREATED).getString();

            parseAndSaveDate(session, date);
        }

        session.save();
    }



    private void parseAndSaveDate(Session session, String date_) throws RepositoryException
    {
        Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMDashboardConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMDashboardConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
        //tagList
        if( !indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_DATES) ){
            indexNode.addNode(FamilyDAMDashboardConstants.PHOTO_DATES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node dateNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);




        String[] dateParts = date_.split("-");

        String year = dateParts[0];
        String monthName = MonthDay.of(new Integer(dateParts[1]), new Integer(dateParts[2])).getMonth().name();
        String monthNumber = dateParts[1];
        String day = dateParts[2];



        Node yearNode;
        if ( !dateNode.hasNode(year) ) {
            yearNode = dateNode.addNode(year);
            yearNode.setProperty("key", year);
            yearNode.setProperty("name", year);
            yearNode.setProperty("year", year);
            yearNode.setProperty("count", 1l);
            session.save();
        }else{
            yearNode = dateNode.getNode(year);
            //yearNode.setProperty("count", yearNode.getProperty("count").getLong()+1);
        }


        Node monthNode;
        if ( !yearNode.hasNode(monthNumber) ) {
            monthNode = yearNode.addNode(monthNumber);
            monthNode.setProperty("key", year + "-" + monthNumber);
            monthNode.setProperty("name", monthName);
            monthNode.setProperty("year", year);
            monthNode.setProperty("month", monthNumber);
            monthNode.setProperty("count", 1l);
            session.save();
        }else{
            monthNode = yearNode.getNode(monthNumber);
            //monthNode.setProperty("count", monthNode.getProperty("count").getLong()+1);
        }


        Node dayNode;
        if (!monthNode.hasNode(day)) {
            dayNode = monthNode.addNode(day);
            dayNode.setProperty("key", year + "-" + monthNumber + "-" + day);
            dayNode.setProperty("name", day);
            dayNode.setProperty("year", year);
            dayNode.setProperty("month", monthNumber);
            dayNode.setProperty("day", day);
            dayNode.setProperty("count", 1l);
            session.save();
        }else{
            dayNode = monthNode.getNode(day);
            dayNode.setProperty("count", dayNode.getProperty("count").getLong()+1);
        }

        session.save();

    }
}
