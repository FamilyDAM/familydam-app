package com.familydam.apps.dashboard.services;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.value.LongValue;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.*;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
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
@org.apache.felix.scr.annotations.Properties({
        @org.apache.felix.scr.annotations.Property(name = "scheduler.period", value = "15 0 * * *"), //12:15am
        @org.apache.felix.scr.annotations.Property(name="scheduler.concurrent", boolValue=false)
})
public class DateIndexGenerator implements Runnable
{
    /** Logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

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



    public boolean indexExists(Session session) throws RepositoryException
    {
        Node _caches = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);

        if( _caches.hasNode(FamilyDAMDashboardConstants.INDEXES) && _caches.getNode(FamilyDAMDashboardConstants.INDEXES).hasNode(FamilyDAMDashboardConstants.PHOTO_DATES))
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
        //dates
        if( !indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_DATES) ){
            indexNode.addNode(FamilyDAMDashboardConstants.PHOTO_DATES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node dateNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);



        for (String dateVal : items) {
            try {
                String[] dateParts = dateVal.split("-");


                if (!dateNode.hasNode(dateParts[0])) {
                    dateNode.addNode(dateParts[0], JcrConstants.NT_UNSTRUCTURED);
                }

                Node yearNode = dateNode.getNode(dateParts[0]);
                if (!yearNode.hasNode(dateParts[1])) {
                    yearNode.addNode(dateParts[1], JcrConstants.NT_UNSTRUCTURED);
                }


                Node monthNode = yearNode.getNode(dateParts[1]);
                if (!monthNode.hasNode(dateParts[2])) {
                    monthNode.addNode(dateParts[2], JcrConstants.NT_UNSTRUCTURED);
                }
            }catch(Exception ex){
                logger.error(ex.getMessage(), ex);
            }

        }

        session.save();
    }



    public void removeFromIndex(Session session, String[] items) throws RepositoryException
    {

    }



    public List<Map> getList(Session session) throws RepositoryException
    {
        String _path = "/" +FamilyDAMDashboardConstants.CACHES +"/" +FamilyDAMDashboardConstants.INDEXES +"/" +FamilyDAMDashboardConstants.PHOTO_DATES;
        Node treeNode = JcrUtils.getOrCreateByPath(_path, JcrConstants.NT_UNSTRUCTURED, session);

        List<Map> results = new ArrayList<>();

        //todo

        return results;
    }



    public void rebuild(Session session) throws RepositoryException
    {
        //since we are rebuilding, let's delete it if it exists
        if( indexExists(session) ){
            session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES).remove();
            session.save();
        }

        Node cacheNode = session.getRootNode().getNode(FamilyDAMDashboardConstants.CACHES);
        //index
        if( !cacheNode.hasNode(FamilyDAMDashboardConstants.INDEXES) ){
            cacheNode.addNode(FamilyDAMDashboardConstants.INDEXES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node indexNode = cacheNode.getNode(FamilyDAMDashboardConstants.INDEXES);
        //dates
        if( !indexNode.hasNode(FamilyDAMDashboardConstants.PHOTO_DATES) ){
            indexNode.addNode(FamilyDAMDashboardConstants.PHOTO_DATES, JcrConstants.NT_UNSTRUCTURED);
            session.save();
        }
        Node dateNode = indexNode.getNode(FamilyDAMDashboardConstants.PHOTO_DATES);




        StringBuffer sql = new StringBuffer("SELECT * FROM [dam:image] where [dam:datecreated] is not null");

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

            try{
                Node node = nodeItr.nextNode();

                String dateVal = node.getProperty("dam:datecreated").getString();

                String[] dateParts = dateVal.split("-");

                String year = dateParts[0];
                String monthName = MonthDay.of(new Integer(dateParts[1]), new Integer(dateParts[2])).getMonth().name();
                String monthNumber = dateParts[1];
                String day = dateParts[2];


                if( !dateNode.hasNode(dateParts[0]) )
                {
                    Node newNode = dateNode.addNode(dateParts[0], JcrConstants.NT_UNSTRUCTURED);
                    //count, key, name, year, month, day
                    newNode.setProperty("count", -1);
                    newNode.setProperty("key", year);
                    newNode.setProperty("name", year);
                    newNode.setProperty("year", year);
                    //newNode.setProperty("month", null);
                    //newNode.setProperty("day", null);
                    session.save();
                }

                Node yearNode = dateNode.getNode(dateParts[0]);
                if( !yearNode.hasNode(dateParts[1]) ){
                    Node monthNode = yearNode.addNode(dateParts[1], JcrConstants.NT_UNSTRUCTURED);
                    //count, key, name, year, month, day
                    monthNode.setProperty("count", -1);
                    monthNode.setProperty("key", year + "-" + monthNumber);
                    monthNode.setProperty("name", monthName);
                    monthNode.setProperty("year", year);
                    monthNode.setProperty("month", monthNumber);
                    //newNode.setProperty("day", null);
                    session.save();
                }


                Node monthNode = yearNode.getNode(dateParts[1]);
                if( !monthNode.hasNode(dateParts[2]) ){
                    Node dayNode = monthNode.addNode(dateParts[2], JcrConstants.NT_UNSTRUCTURED);
                    //count, key, name, year, month, day
                    dayNode.setProperty("count", -1);
                    dayNode.setProperty("key", year + "-" + monthNumber + "-" + day);
                    dayNode.setProperty("name", day);
                    dayNode.setProperty("year", year);
                    dayNode.setProperty("month", monthNumber);
                    dayNode.setProperty("day", day);
                    session.save();
                }
            }catch(Exception ex){
                logger.error(ex.getMessage(), ex);
            }

        }


        session.save();
    }
}
