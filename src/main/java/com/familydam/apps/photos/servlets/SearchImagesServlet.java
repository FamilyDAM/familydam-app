/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.familydam.apps.photos.servlets;

import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.Writer;

/**
 * Hello World Servlet registered by path
 * 
 * Annotations below are short version of:
 * 
 * @Component
 * @Service(Servlet.class)
 * @Properties({
 *     @Property(name="service.description", value="Hello World Path Servlet"),
 *     @Property(name="service.vendor", value="The Apache Software Foundation"),
 *     @Property(name="sling.servlet.paths", value="/hello-world-servlet")
 * })
 */
@SlingServlet(paths="/api/dam:image/search")
@Properties({
    @Property(name="service.description", value="Hello World Path Servlet"),
    @Property(name="service.vendor", value="The Apache Software Foundation")
})
@SuppressWarnings("serial")
public class SearchImagesServlet extends SlingSafeMethodsServlet {
    
    private final Logger log = LoggerFactory.getLogger(SearchImagesServlet.class);

    @Override
    protected void doGet(SlingHttpServletRequest request,
            SlingHttpServletResponse response) throws ServletException,
            IOException {
        
        Writer w = response.getWriter();
        w.write("<!DOCTYPE html PUBLIC \"-//IETF//DTD HTML 2.0//EN\">");
        w.write("<html>");
        w.write("<head>");
        w.write("<title>photo-servlet</title>");
        w.write("</head>");
        w.write("<body>");
        w.write("<h1>Hello World PHOTOS!</h1>");
        w.write("</body>");
        w.write("</html>");
        
        log.info("Hello World PHOTOS");
        
    }


    /*********************************
     *
     *

     @PreAuthorize("hasRole('ROLE_ADMIN')")
     @RequestMapping(value = "/{type}", method = RequestMethod.POST)
     public ResponseEntity<Object> searchByType(HttpServletRequest request,
     HttpServletResponse response,
     @AuthenticationPrincipal Authentication currentUser_,
     @RequestBody() String jsonBody,
     @PathVariable(value = "type") String type,
     @RequestParam(value = "groupBy", defaultValue = "date:day", required = false) String groupBy_,
     @RequestParam(value = "limit", required = false, defaultValue = "100") Integer limit,
     @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset)
     {

     Session session = null;
     try {
     session = authenticatedHelper.getSession(currentUser_);

     String _orderBy = "jcr:lastModified";
     String _orderByDirection = "asc";
     ObjectMapper objectMapper = new ObjectMapper();
     Map _filters = objectMapper.readValue(jsonBody, Map.class);

     if (_filters.containsKey("order")) {
     _orderBy = (String) ((Map) _filters.get("order")).get("field");
     _orderByDirection = (String) ((Map) _filters.get("order")).get("direction");
     }

     if (_filters.containsKey("group")) {
     groupBy_ = _filters.get("group").toString();
     }


     StringBuffer sql = new StringBuffer("SELECT * FROM [").append(type).append("] ");

     sql.append(" WHERE [jcr:primaryType] = 'nt:file'");

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
     List<Map> _paths = (List) _filters.get("paths");
     if (_paths.size() > 0) {
     hasPath = true;
     for (int i = 0; i < _paths.size(); i++) {
     Map _path = _paths.get(i);
     pathClause.append(" ISDESCENDANTNODE([" +_path.get("path") +"]) ");
     if( i >= 0 && i < (_paths.size()-1) ){
     pathClause.append(" OR ");
     }
     }
     }
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


     sql.append(" ORDER BY [").append(_orderBy).append("] DESC");
     if (limit > 0) { // 0 == return all
     //sql.append(" LIMIT ").append(limit);
     //sql.append(" OFFSET ").append(offset);
     }


     QueryManager queryManager = session.getWorkspace().getQueryManager();
     Query query = queryManager.createQuery(sql.toString(), "JCR-SQL2");
     //Query query = queryManager.createQuery(sql.toString(), "sql");

     // Execute the query and get the results ...
     QueryResult result = query.execute();


     // Iterate over the nodes in the results ...
     Collection<INode> _nodes = new ArrayList<>();
     javax.jcr.NodeIterator nodeItr = result.getNodes();
     while (nodeItr.hasNext()) {
     javax.jcr.Node node = nodeItr.nextNode();
     _nodes.add(NodeMapper.map(node));
     }



     Map<String, Group> _groupedNodes = new TreeMap<>();


     for (INode _node : _nodes)
     {
     String _key = getGroupKey(groupBy_, _node);
     String _label = getGroupLabel(groupBy_, _node);

     if( !_groupedNodes.containsKey(_key) )
     {
     Group group = new Group();
     group.setValue(_key);
     group.setLabel(_label);
     _groupedNodes.put(_key, group);
     }

     _groupedNodes.get(_key).getChildren().add(_node);
     }


     return new ResponseEntity<>(_groupedNodes, HttpStatus.OK);


     }
     catch (Exception ae) {
     ae.printStackTrace();
     return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
     }
     finally {
     if (session != null) {
     session.logout();
     }
     }
     }


      // Get the real filter value

    private String getGroupKey(String groupBy_, INode node_)
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
                return dateCreated.get(Calendar.YEAR) + "-" +(dateCreated.get(Calendar.MONTH)+1);
            }
        }
        else if( groupBy_.equalsIgnoreCase("date:day") )
        {
            Calendar dateCreated = node_.getDateCreated();
            if( dateCreated != null ) {
                return dateCreated.get(Calendar.YEAR) + "-" +(dateCreated.get(Calendar.MONTH)+1) + "-" + dateCreated.get(Calendar.DAY_OF_MONTH);
            }
        }
        return defaultKey; // a catch all for items with no value for the group by property
    }


    //get a pretty label for the filter with a month name string
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
            int _year = new Integer((String)date.get("year")).intValue();
            int _month = new Integer((String)date.get("month")).intValue();
            int _day = new Integer((String)date.get("day")).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, _day);
        }
        else if( date.containsKey("month") )
        {
            int _year = new Integer((String)date.get("year")).intValue();
            int _month = new Integer((String)date.get("month")).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, 1);
        }
        else
        {
            int _year = new Integer((String)date.get("year")).intValue();
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
            int _year = new Integer((String)date.get("year")).intValue();
            int _month = new Integer((String)date.get("month")).intValue();
            int _day = new Integer((String)date.get("day")).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, _day);
        }
        else if( date.containsKey("month") )
        {
            int _year = new Integer((String)date.get("year")).intValue();
            int _month = new Integer((String)date.get("month")).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, _month-1);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        }
        else
        {
            int _year = new Integer((String)date.get("year")).intValue();
            cal.set(Calendar.YEAR, _year);
            cal.set(Calendar.MONTH, 11);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        }

        String _date = ValueFactoryImpl.getInstance().createValue(cal).getString();
        return _date.substring(0, _date.lastIndexOf("T")) +"T23:59:59.000Z";
    }

     *
     *
    *********************************/

}

