/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.daos;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import com.familydam.apps.dashboard.exceptions.UnknownINodeException;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.query.Row;
import javax.jcr.query.RowIterator;
import java.text.SimpleDateFormat;
import java.time.MonthDay;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;



/**
 * Created by mnimer on 10/14/15.
 */
@Component(immediate = true)
@Service(value = TreeDao.class)
public class TreeDao
{
    private Logger log = LoggerFactory.getLogger(this.getClass());
    SimpleDateFormat dfYear = new SimpleDateFormat("yyyy");
    SimpleDateFormat dfMonth = new SimpleDateFormat("MMMM");
    SimpleDateFormat dfMonth2 = new SimpleDateFormat("MM");
    SimpleDateFormat dfDay = new SimpleDateFormat("dd");


    /**
     * Create a tree of YEAR -> MONTH -> DATE
     * @param session
     * @return
     * @throws RepositoryException
     */
    public Map dateTree(Session session, String path_) throws RepositoryException, UnknownINodeException
    {
        StringBuffer sql = new StringBuffer("SELECT [" + FamilyDAMDashboardConstants.DAM_DATECREATED +"]  FROM [dam:image] where [" +FamilyDAMDashboardConstants.DAM_DATECREATED +"] is not null");


        QueryManager queryManager = session.getWorkspace().getQueryManager();
        //Query query = queryManager.createQuery(sql, "JCR-SQL2");
        Query query = queryManager.createQuery(sql.toString(), Query.JCR_SQL2);
//
        // Execute the query and get the results ...
        QueryResult result = query.execute();


        // Iterate over the nodes in the results ...
        Map<String, Map> _nodeMap = new HashMap<>();
        RowIterator nodeItr = result.getRows();
        while ( nodeItr.hasNext() ) {
            try {
                Row row = nodeItr.nextRow();

                String date = row.getValue(FamilyDAMDashboardConstants.DAM_DATECREATED).getString();
                String[] dateParts = date.split("-");


                String year = dateParts[0];
                String monthName = MonthDay.of(new Integer(dateParts[1]), new Integer(dateParts[2])).getMonth().name();
                String monthNumber = dateParts[1];
                String day = dateParts[2];

                Map yearMap = _nodeMap.get(year);
                if (yearMap == null) {
                    yearMap = new HashMap();
                    yearMap.put("key", year);
                    yearMap.put("name", year);
                    yearMap.put("year", year);
                    yearMap.put("children", new HashMap());
                    _nodeMap.put(year, yearMap);
                }


                Map monthMap = (Map) ((Map) _nodeMap.get(year).get("children")).get(monthName);
                if (monthMap == null) {

                    monthMap = new HashMap();
                    monthMap.put("key", year +"-" +monthNumber);
                    monthMap.put("name", monthName);
                    monthMap.put("year", year);
                    monthMap.put("month", monthNumber);
                    monthMap.put("children", new HashMap());

                    ((Map) _nodeMap.get(year).get("children")).put(monthNumber, monthMap);

                }

                Map dayMap = (Map) ((Map) ((Map) ((Map) _nodeMap.get(year).get("children")).get(monthNumber)).get("children")).get(day);
                if (dayMap == null) {
                    dayMap = new HashMap();
                    dayMap.put("key", year +"-" +monthNumber +"-" +day);
                    dayMap.put("name", day);
                    dayMap.put("year", year);
                    dayMap.put("month", monthNumber);
                    dayMap.put("day", day);
                    dayMap.put("children", new HashMap());

                    ((Map) ((Map) ((Map) _nodeMap.get(year).get("children")).get(monthNumber)).get("children")).put(day, dayMap);
                }

                //log.debug(row);
            }catch(Exception ex){
                //ex.printStackTrace();
            }
        }

        return _nodeMap;
    }

    /**
     * Create a list of distinct tags in the system.
     * @param session
     * @return
     * @throws RepositoryException
     */
    public List<Map> tagList(Session session, String path_) throws RepositoryException, UnknownINodeException
    {
        StringBuffer sql = new StringBuffer("SELECT [dam:tags]  FROM [dam:image] where [dam:tags] is not null");


        return queryForListAndCount(session, "dam:tags", sql);
    }


    /**
     * Create a list of distinct tags in the system.
     * @param session
     * @return
     * @throws RepositoryException
     */
    public List<Map> peopleList(Session session, String path_) throws RepositoryException, UnknownINodeException
    {
        StringBuffer sql = new StringBuffer("SELECT [dam:people]  FROM [dam:image] where [dam:people] is not null");

        return queryForListAndCount(session, "dam:people", sql);
    }





    private List<Map> queryForListAndCount(Session session, String field, StringBuffer sql) throws RepositoryException
    {
        QueryManager queryManager = session.getWorkspace().getQueryManager();
        //Query query = queryManager.createQuery(sql, "JCR-SQL2");
        Query query = queryManager.createQuery(sql.toString(), Query.JCR_SQL2);
//
        // Execute the query and get the results ...
        QueryResult result = query.execute();


        // Iterate over the nodes in the results ...
        final Map<String, Integer> _nodeMap = new HashMap<>();
        final List<Map> _nodeList = new ArrayList<>();
        NodeIterator nodeItr = result.getNodes();
        while ( nodeItr.hasNext() ) {
            Node node = nodeItr.nextNode();

            Value[] tags = node.getProperty(field).getValues();

            for (Value _tag : tags) {
                String tag = _tag.getString().toLowerCase();

                Integer existingItemCount = _nodeMap.get(tag);
                if( existingItemCount == null ){
                    existingItemCount = 1;
                }else{
                    existingItemCount += 1;
                }

                _nodeMap.put(tag, existingItemCount);
            }
            //log.debug(node);
        }


        // now we have a final list with count, Sort the keys and move it all into a list.
        _nodeMap.keySet().stream().sorted().forEach(new Consumer<String>()
        {
            @Override public void accept(String s)
            {
                Map _item = new HashMap();
                _item.put("name", s);
                _item.put("count", _nodeMap.get(s));
                _nodeList.add(_item);
            }
        });


        // now we have a final list with count, Sort the keys and move it all into a list.
        List nodes = _nodeMap.keySet().stream().sorted()
                .map(new Function<String, Object>()
                {
                    @Override public Object apply(String s)
                    {
                        Map _item = new HashMap();
                        _item.put("name", s);
                        _item.put("count", _nodeMap.get(s));
                        return _item;
                    }
                }).collect(Collectors.toList());

        return _nodeList;
    }

}
