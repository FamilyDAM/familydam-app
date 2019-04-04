/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.servlets.photos;

import com.familydam.apps.dashboard.exceptions.UnknownINodeException;
import com.familydam.apps.dashboard.helpers.NodeMapper;
import com.familydam.apps.dashboard.models.DamImage;
import com.familydam.apps.dashboard.models.Group;
import com.familydam.apps.dashboard.models.INode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.value.ValueFactoryImpl;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import javax.jcr.security.AccessControlException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Search for content by jcr node type or mixin
 *
 * Sample Form Post Body
 * <code>
 * {
 *     "paths": [
 *         "/content/family/files"
 *     ],
 *     "group": "date:day",
 *     "order": {
 *         "field": "dam:datecreated",
 *         "direction": "desc"
 *     }
 * }
 * </code>
 * Created by mnimer on 12/13/14.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        selectors = {"image", "search"},
        extensions = "json",
        methods = "POST")
public class PhotoSearchServlet  extends SlingAllMethodsServlet
{
    public final Logger log = LoggerFactory.getLogger(PhotoSearchServlet.class);
    ObjectMapper objectMapper = new ObjectMapper();


    public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
    {
        Session session = null;
        session = request.getResourceResolver().adaptTo(Session.class);
        String[] selectors = request.getRequestPathInfo().getSelectors();
        String extension = request.getRequestPathInfo().getExtension();
        String resourcePath = request.getRequestPathInfo().getResourcePath();


        String _order = "DESC";
        String type = "dam:image";
        String groupBy = "date:day";
        Integer limit = 0;
        Integer offset = 0;

        try {
            String requestBody = IOUtils.toString(request.getInputStream(), Charset.forName("UTF-8"));

            Map _filters = objectMapper.readValue(requestBody, Map.class);

            String _orderBy = "dam:datecreated";//"jcr:lastModified";
            String _orderByDirection = "desc";

            if (_filters.containsKey("order")) {
                _orderBy = (String) ((Map) _filters.get("order")).get("field");
                _orderByDirection = (String) ((Map) _filters.get("order")).get("direction");
            }

            if (_filters.containsKey("group")) {
                groupBy = _filters.get("group").toString();
            }


            //StringBuffer sql = new StringBuffer("SELECT * FROM [").append(type).append("] ");
            //sql.append(" WHERE [jcr:primaryType] = 'nt:file'");
            //sql.append(" AND ISDESCENDANTNODE(file, ").append(resourcePath).append(")");

            StringBuffer sql = new StringBuffer("SELECT * FROM [nt:file] as file ");
            sql.append(" WHERE [jcr:mixinTypes] = '").append(type).append("'");


            boolean hasTags = false;
            boolean hasPeople = false;
            boolean hasDate = false;
            boolean hasPath = false;
            StringBuilder tagClause = new StringBuilder();
            StringBuilder peopleClause = new StringBuilder();
            StringBuilder dateClause = new StringBuilder();
            StringBuilder pathClause = new StringBuilder();


            if (_filters.containsKey("tags")) {
                List<Map> _tags = (List) _filters.get("tags");
                if (_tags.size() > 0) {
                    hasTags = true;
                    for (int i = 0; i < _tags.size(); i++) {
                        Map tag = _tags.get(i);
                        tagClause.append(" lower([dam:tags]) = '" + tag.get("name").toString().toLowerCase() +"'");
                        if( i >= 0 && i < (_tags.size()-1) ){
                            tagClause.append(" OR ");
                        }
                    }
                }
            }
            if (_filters.containsKey("people")) {
                List<Map> _people = (List) _filters.get("people");
                if (_people.size() > 0) {
                    hasPeople = true;
                    for (int i = 0; i < _people.size(); i++) {
                        Map people = _people.get(i);
                        peopleClause.append(" lower([dam:people]) = '" + people.get("name").toString().toLowerCase() +"'");
                        if( i >= 0 && i < (_people.size()-1) ){
                            peopleClause.append(" OR ");
                        }
                    }
                }
            }
            if (_filters.containsKey("date")) {
                List<Map> _dates = (List) _filters.get("date");
                if (_dates.size() > 0) {
                    hasDate = true;
                    for (int i = 0; i < _dates.size(); i++) {
                        Map date = _dates.get(i);
                        dateClause.append(" ( [dam:datecreated] >= cast('" +parseStartDate(date) +"' as date) AND [dam:datecreated] <= cast('" +parseEndDate(date) +"' as date) )");
                        if( i >= 0 && i < (_dates.size()-1) ){
                            dateClause.append(" OR ");
                        }
                    }
                }
            }
            if (_filters.containsKey("paths")) {
                List<String> _paths = (List) _filters.get("paths");
                if (_paths.size() > 0) {
                    hasPath = true;
                    for (int i = 0; i < _paths.size(); i++) {
                        //pathClause.append(" ISDESCENDANTNODE([" +_paths.get(i) +"]) ");
                        pathClause.append(" [jcr:path] like '").append(_paths.get(i)).append("/%'");
                        if( i >= 0 && i < (_paths.size()-1) ){
                            pathClause.append(" OR ");
                        }
                    }
                }
            }else{
                sql.append(" AND [jcr:path] like '").append(resourcePath).append("/%'");
            }


            if( hasTags || hasPeople ){
                sql.append(" AND (");
                if( hasTags ){
                    sql.append(tagClause.toString());
                }
                if( hasTags && hasPeople ){
                    sql.append(" OR ");
                }
                if( hasPeople ){
                    sql.append(peopleClause.toString());
                }
                sql.append(" ) ");
            }

            if( hasDate ){
                sql.append(" AND (");
                sql.append(dateClause.toString());
                sql.append(" ) ");
            }


            if( hasPath ){
                sql.append(" AND (");
                sql.append(pathClause.toString());
                sql.append(" ) ");
            }

            sql.append(" ORDER BY [").append(_orderBy).append("] ").append(_order).append(", [name] ASC");

            QueryManager queryManager = session.getWorkspace().getQueryManager();
            Query query = queryManager.createQuery(sql.toString(), "JCR-SQL2");
            if (limit > 0) { // 0 == return all
                query.setLimit(limit);
                query.setOffset(limit * offset);
            }
            //Query query = queryManager.createQuery(sql.toString(), "sql");

            // Execute the query and get the results ...
            QueryResult result = query.execute();

            //Group the results

            Map<String, Group> _groupedNodes = groupResults(response, _order, groupBy, result);
            List<Group> _sortedGroups = sortGroups(_groupedNodes, _orderByDirection);

            response.setStatus(200);
            response.setContentType("application/json");
            response.getOutputStream().write(objectMapper.writeValueAsString(_sortedGroups).getBytes());
        }
        catch (AccessControlException ex){
            response.setStatus(403);
            return;
        }
        catch (Exception ex){
            ex.printStackTrace();
            response.setStatus(500);
            response.setContentType("application/json");
            try {
                response.getOutputStream().write(ex.getMessage().getBytes());
            }catch(IOException ioe){}
        }
        finally {
            if (session != null) {
                session.logout();
            }
        }
    }



    private Map<String, Group> groupResults(SlingHttpServletResponse response, String _order, String groupBy, QueryResult result) throws RepositoryException, UnknownINodeException, IOException {
        // Iterate over the nodes in the results ...
        Collection<INode> _nodes = new ArrayList<>();
        javax.jcr.NodeIterator nodeItr = result.getNodes();
        while (nodeItr.hasNext()) {
            javax.jcr.Node node = nodeItr.nextNode();
            log.debug(node.getPath());
            _nodes.add(NodeMapper.map(node));
        }


        Map<String, Group> _groupedNodes;
        if( _order.equalsIgnoreCase("DESC")) {
            _groupedNodes = new TreeMap<>(Collections.reverseOrder());
        }else{
            _groupedNodes = new TreeMap<>();
        }


        for (INode _node : _nodes)
        {
            String _key = getGroupKey(groupBy, _node);
            String _label = getGroupLabel(groupBy, _node);

            if( !_groupedNodes.containsKey(_key) )
            {
                Group group = new Group();
                group.setValue(_key);
                group.setLabel(_label);
                _groupedNodes.put(_key, group);
            }

            _groupedNodes.get(_key).getChildren().add(_node);
        }


        for (String key : _groupedNodes.keySet()) {
            Collections.sort( (List)_groupedNodes.get(key).getChildren(), new Comparator<Object>() {
                @Override
                public int compare(Object o1, Object o2) {

                    int dataOrder = ((DamImage)o1).getDateCreated().compareTo(((DamImage)o2).getDateCreated());
                    if (dataOrder != 0) return dataOrder * -1;

                    return ((DamImage)o1).getName().compareTo( ((DamImage)o2).getName() );
                }
            });
        }

        return _groupedNodes;
    }


    /**
     * Sort the groups into a list
     * @param groupedNodes
     * @return
     */
    private List<Group> sortGroups(Map<String, Group> groupedNodes, String direction) {
        Set<String> keys = groupedNodes.keySet();

        Stream<String> stream = keys.stream();
        if( direction.equalsIgnoreCase("asc") ){
            stream = stream.sorted();
        }else{
            stream = stream.sorted(Comparator.reverseOrder());
        }

        return stream.map( k -> {
            return groupedNodes.get(k);
        }).collect(Collectors.toList());
    }


    /**
     * Get the real filter value
     * @param groupBy_
     * @param node_
     * @return
     */
    private String getGroupKey(String groupBy_, INode node_)
    {
        String defaultKey = "---";
        NumberFormat nf = NumberFormat.getInstance();

        if( groupBy_.equalsIgnoreCase("date:year") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                return new Integer(dateCreated.get(Calendar.YEAR)).toString();
            }
        }
        else if( groupBy_.equalsIgnoreCase("date:month") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                //String monthName = dateCreated.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                //return dateCreated.get(Calendar.YEAR) + "-" +(dateCreated.get(Calendar.MONTH)+1);
                SimpleDateFormat df =new SimpleDateFormat("yyyy-MM");
                return df.format(dateCreated.getTime());
            }
        }
        else if( groupBy_.equalsIgnoreCase("date:day") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                return df.format(dateCreated.getTime());
            }
        }
        return defaultKey; // a catch all for items with no value for the group by property
    }


    /**
     * get a pretty label for the filter with a month name string
     * @param groupBy_
     * @param node_
     * @return
     */
    private String getGroupLabel(String groupBy_, INode node_)
    {
        String defaultKey = "---";

        if( groupBy_.equalsIgnoreCase("date:year") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                return new Integer(dateCreated.get(Calendar.YEAR)).toString();
            }
        }
        else if( groupBy_.equalsIgnoreCase("date:month") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                String monthName = dateCreated.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                return monthName +" " +dateCreated.get(Calendar.YEAR);
            }
        }
        else if( groupBy_.equalsIgnoreCase("date:day") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                String monthName = dateCreated.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                return monthName + " " +dateCreated.get(Calendar.DAY_OF_MONTH) +", " +dateCreated.get(Calendar.YEAR);
            }
        }
            return defaultKey; // a catch all for items with no value for the group by property
    }



    private String parseStartDate(Map date) throws RepositoryException
    {
        Calendar cal = Calendar.getInstance();
        if( date.containsKey("day") ){
            int _year = new Integer(date.get("year").toString()).intValue();
            int _month = new Integer(date.get("month").toString()).intValue();
            int _day = new Integer(date.get("day").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, _day);
        }
        else if( date.containsKey("month") )
        {
            int _year = new Integer(date.get("year").toString()).intValue();
            int _month = new Integer(date.get("month").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, 1);
        }
        else
        {
            int _year = new Integer(date.get("year").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, 0);
            cal.set(Calendar.DAY_OF_MONTH, 1);
        }

        String _date = ValueFactoryImpl.getInstance().createValue(cal).getString();
        return _date.substring(0, _date.lastIndexOf("T")) +"T00:00:01.000Z";
    }



    private String parseEndDate(Map date) throws RepositoryException
    {
        Calendar cal = Calendar.getInstance();
        if( date.containsKey("day") ){
            int _year = new Integer(date.get("year").toString()).intValue();
            int _month = new Integer(date.get("month").toString()).intValue();
            int _day = new Integer(date.get("day").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, _day);
        }
        else if( date.containsKey("month") )
        {
            int _year = new Integer(date.get("year").toString()).intValue();
            int _month = new Integer(date.get("month").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        }
        else
        {
            int _year = new Integer(date.get("year").toString()).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, 11);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        }

        String _date = ValueFactoryImpl.getInstance().createValue(cal).getString();
        return _date.substring(0, _date.lastIndexOf("T")) +"T23:59:59.000Z";
    }

}

