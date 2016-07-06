/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets.uploads;

import com.familydam.apps.dashboard.FamilyDAMDashboardConstants;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.util.Text;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.contentdetection.ContentAwareMimeTypeService;
import org.apache.sling.commons.mime.MimeTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.jcr.AccessDeniedException;
import javax.jcr.InvalidItemStateException;
import javax.jcr.Node;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by mnimer on 3/16/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/upload"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.FileUploadServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "FileUploadServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class FileUploadServlet extends SlingAllMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd");

    @Resource
    public MimeTypeService mimeTypeService;
    @Resource
    public ContentAwareMimeTypeService contentAwareMimeTypeService;
    @Resource
    public ResourceResolverFactory resolverFactory;


    /**
     * JCR node names have a certain character set, which is actually very broad and includes
     * almost all of unicode minus some special characters such as /, [, ], |, :
     * and * (used to build paths, address same-name siblings etc. in JCR), and it
     * cannot be "." or ".." (obviously).
     *
     * @param fileName_
     * @return
     */
    private String cleanFileName(String fileName_)
    {
        return Text.escapeIllegalJcrChars(fileName_.replace("\u00A0", " "));
    }


    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
       String resourcePath = request.getRequestPathInfo().getResourcePath();


        if (!ServletFileUpload.isMultipartContent(request)) {
            response.setStatus(500); //Bad Request
            return;
        }


        boolean fileExists = false;
        Session session = null;
        try {
            session = request.getResourceResolver().adaptTo(Session.class);
            session.refresh(true);


            boolean isMultipart = org.apache.commons.fileupload.servlet.ServletFileUpload.isMultipartContent(request);
            isMultipart = true;
            PrintWriter out = null;

            out = response.getWriter();
            if (isMultipart) {
                final java.util.Map<String, org.apache.sling.api.request.RequestParameter[]> partMap = request.getRequestParameterMap();
                String _uploadPath = null;
                String _fileName = null;
                Map<String, Object> _props = new HashMap<>();

                for (final java.util.Map.Entry<String, org.apache.sling.api.request.RequestParameter[]> pairs : partMap.entrySet()) {
                    final String k = pairs.getKey();
                    final org.apache.sling.api.request.RequestParameter[] pArr = pairs.getValue();
                    final org.apache.sling.api.request.RequestParameter param = pArr[0];

                    if (param.isFormField()) {
                        if (k.equalsIgnoreCase("path")) {
                            _uploadPath = new String(param.get());
                        }else if (k.equalsIgnoreCase("name")) {
                            _fileName = cleanFileName(new String(param.get()));
                        } else {
                            _props.put(k, new String(param.get()));
                        }

                    }
                }

                if (_uploadPath == null || _fileName == null) {
                    response.setStatus(500); //bad requeust, missing path param
                    response.getOutputStream().write("Missing Upload Path or File Name".getBytes());
                    return;
                }


                session.save();
                List<String> locations = new ArrayList<>();
                Node _pathNode = null;
                try {
                    _pathNode = JcrUtils.getOrCreateByPath(_uploadPath, "sling:Folder", session);
                }
                catch (InvalidItemStateException ex) {
                    _pathNode = JcrUtils.getOrCreateByPath(_uploadPath, "sling:Folder", session);
                }

                //Find the file
                for (final java.util.Map.Entry<String, org.apache.sling.api.request.RequestParameter[]> pairs : partMap.entrySet()) {
                    final String k = pairs.getKey();
                    final org.apache.sling.api.request.RequestParameter[] pArr = pairs.getValue();

                    for (RequestParameter param : pArr) {
                        if (!param.isFormField()) {
                            InputStream stream = param.getInputStream();


                            /**
                             * Write to DAM
                             */
//                            Node existingNode = JcrUtils.getNodeIfExists(_pathNode.getPath() +"/" +_fileName, session);
//                            if( existingNode != null ){
//                                if( existingNode.isCheckedOut() ){
//                                    //existingNode.checkin();
//                                    //session.save();
//                                    //existingNode.checkout();
//                                    //existingNode.checkout();
//                                }
//                            }

                            Node _newFile = JcrUtils.putFile(_pathNode, _fileName, param.getContentType(), stream);
                            _newFile.addMixin("dam:extensible");
                            _newFile.addMixin(JcrConstants.MIX_REFERENCEABLE);
                            _newFile.addMixin(JcrConstants.MIX_VERSIONABLE);

                            // Set a DAM specific date (as as tring so it's easy to parse later)
                            javax.jcr.Property createdDate = _newFile.getProperty(JcrConstants.JCR_CREATED);
                            Calendar dateStamp = Calendar.getInstance();
                            if (createdDate == null) {
                                dateStamp = createdDate.getDate();
                            }
                            _newFile.setProperty(FamilyDAMDashboardConstants.DAM_DATECREATED, dateFormat.format(dateStamp.getTime()));


                            // save the primary file.
                            session.save();
                            log.trace("file {} uploaded to {}", _fileName, _newFile.getPath());
                            //System.out.println("file " +_fileName +" uploaded to " +_newFile.getPath());

                            locations.add(_newFile.getPath());
                        }
                    }

                }


                response.setStatus(201);
                // return a path to the new file, in the location header
                response.setHeader("location", StringUtils.join(locations.toArray(), ","));
            }


        }
        catch (AccessDeniedException ex) {
            ex.printStackTrace();
            response.setStatus(403); //Bad Request
        }
        catch (Exception ex) {
            response.setStatus(500); //Bad Request
            try {
                response.getOutputStream().write(ex.getMessage().getBytes());
            }catch(Throwable t){}
            //ex.printStackTrace();
        }
        finally {
            if (session != null) {
                session.logout();
            }
        }

    }



    /***
     * Read raw file stream (doesn't work in sling)
     ServletFileUpload upload = new ServletFileUpload();
     FileItemIterator iter = upload.getItemIterator(request);
     while (iter.hasNext()) {
     FileItemStream item = iter.next();
     String name = item.getFieldName();
     InputStream stream = item.openStream();
     if (item.isFormField()) {
     if (name.equalsIgnoreCase("path")) {
     // FIND the path
     _path = Streams.asString(stream);
     }
     //System.out.println("Form field " + name + " with value " + Streams.asString(stream) + " detected.");
     } else {
     _fileName = item.getName();
     _contentType = item.getContentType();
     //System.out.println("File field " + name + " with file name " + item.getName() + " detected.");
     // Process the input stream
     _fileStream = stream;//item.openStream();


     // check file name for starting /
     int pos = _fileName.lastIndexOf("/");
     if (pos > -1 && (pos + 1) < _fileName.length()) {
     _fileName = _fileName.substring(pos + 1);
     }
     _fileName = cleanFileName(_fileName);

     //set dir path, from the _path

     // Create DIR to store file
     Node copyToDir = JcrUtils.getOrCreateByPath(resourcePath, false, JcrConstants.NT_FOLDER, JcrConstants.NT_FOLDER, session, true);
     //todo add mixins to all parent folders

     // figure out the mime type
     String mimeType = mimeTypeService.getMimeType(_contentType);
     if (mimeType == null) {
     //default to our local check (based on file extension)
     mimeType = contentAwareMimeTypeService.getMimeType(_fileName, _fileStream);
     }

     // Check to see if this is a new node or if we are updating an existing node
     Node nodeExistsCheck = JcrUtils.getNodeIfExists(copyToDir, _fileName);
     if (nodeExistsCheck != null) {
     fileExists = true;
     }

     // Upload the FILE
     Node fileNode = JcrUtils.putFile(copyToDir, _fileName, mimeType, _fileStream);
     fileNode.addMixin("dam:extensible");
     fileNode.addMixin(JcrConstants.MIX_REFERENCEABLE);
     fileNode.addMixin(JcrConstants.MIX_VERSIONABLE);

     //fileNode.setProperty(JcrConstants.JCR_CREATED, session.getUserID());


     // Set a DAM specific date (as as tring so it's easy to parse later)
     javax.jcr.Property createdDate = fileNode.getProperty(JcrConstants.JCR_CREATED);
     Calendar dateStamp = Calendar.getInstance();
     if (createdDate == null) {
     dateStamp = createdDate.getDate();
     }
     fileNode.setProperty(FamilyDAMDashboardConstants.DAM_DATECREATED, dateFormat.format(dateStamp.getTime()));

     // save the primary file.
     session.save();


     response.setStatus(200);
     response.setContentType("application/text");
     // return a path to the new file, in the location header
     response.setHeader("location", fileNode.getPath());
     }
     }
     ***/


}
