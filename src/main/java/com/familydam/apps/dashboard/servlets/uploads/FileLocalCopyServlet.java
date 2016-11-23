/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.dashboard.servlets.uploads;

import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.commons.mime.MimeTypeProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Stream;


/**
 * Created by mnimer on 3/16/16.
 */
@SlingServlet(
        paths = {"/bin/familydam/api/v1/upload/copy"}, metatype = true
)
@Properties({
        @Property(name = "service.pid", value = "com.familydam.apps.dashboard.servlets.users.FileLocalCopyServlet", propertyPrivate = false),
        @Property(name = "service.description", value = "FileLocalCopyServlet  Description", propertyPrivate = false),
        @Property(name = "service.vendor", value = "FamilyDAM Team", propertyPrivate = false)
})
public class FileLocalCopyServlet extends SlingAllMethodsServlet
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Reference
    MimeTypeProvider mimeTypeService;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException
    {
        Session session = request.getResourceResolver().adaptTo(Session.class);
        String resourcePath = request.getRequestPathInfo().getResourcePath();

        try {
            String path = request.getParameter("path");//(String) props.get("path");

            if (path == null) {
                response.setStatus(404);
                return;
            }

            File _f = new File(path);

            Map info = new HashMap();
            info.put("path", path);
            info.put("visible", _f.exists());
            info.put("isDirectory", _f.isDirectory());
            // pass back any extra properties that were sent
            for (Object s : request.getParameterMap().keySet()) {
                info.put(s, request.getParameter(s.toString()));
            }

            //
            long _count = 0;
            if( (Boolean)info.get("isDirectory") )
            {
                _count = copyDirectory(response, session, (String)info.get("path"),  (String)info.get("dir"));
            }else{
                copyFile(response, session, _f,  (String)info.get("dir"));
                _count = 1;
            }

            session.save();
            response.setStatus(200);
            response.setContentType("application/text");
            //response.getOutputStream().write(new JSONObject(info).toString().getBytes());
            response.getOutputStream().write( "Upload Complete".getBytes());

        }
        catch ( Exception ex) {
            try {
                session.refresh(false);
            }catch (RepositoryException re){
                //swallows
            }
            ex.printStackTrace();
            log.error(ex.getMessage(), ex);
            response.getOutputStream().write(ex.getMessage().getBytes());
            response.setStatus(500);
        }
    }


    private long copyDirectory(SlingHttpServletResponse response, Session session, String path, String destDir) throws RepositoryException, FileNotFoundException
    {
        log.info("{Copy Directory} " +path);
        File _dir = new File(path);
        File[] _files = _dir.listFiles();

        if( destDir.endsWith("/") ) {
            destDir = destDir.substring(0, destDir.length()-1);
        }

        final String _dirPath = JcrUtils.getOrCreateByPath(destDir +"/" +cleanName(_dir.getName()), "sling:Folder", session).getPath();

        final SlingHttpServletResponse _response = response;
        final Session _session = session;

        long _count = 0;
        Stream<File> fileStream = Arrays.stream(_files);
        _count += fileStream.map(new Function<File, Object>() {
            @Override
            public Object apply(File file) {
                try {
                    if (file.isDirectory()) {
                        return copyDirectory(_response, _session, file.getAbsolutePath(), _dirPath);
                    } else {
                        copyFile(_response, _session, file, _dirPath);
                        return 1;
                    }
                }catch (FileNotFoundException|RepositoryException fnfe){
                    fnfe.printStackTrace();
                    return 0;
                }
            }
        }).count();

        /**
        fileStream.parallel().forEach(new Consumer<File>()
        {
            public void accept(File file)
            {
                try {
                    if (file.isDirectory()) {
                        copyDirectory(_response, _session, file.getAbsolutePath(), _dirPath);
                    } else {
                        copyFile(_response, _session, file, _dirPath);
                    }
                }catch (FileNotFoundException|RepositoryException fnfe){
                    fnfe.printStackTrace();
                }

            }
        });
         **/


        /**
        for (File file : _files) {
            if( file.isDirectory() ){
                copyDirectory(response, session, file.getAbsolutePath(), _dirPath);
            }else{
                copyFile(response, session, file, _dirPath);
            }
        }
         **/
        session.save();
        return _count;
    }

    private void copyFile(SlingHttpServletResponse response, Session session, File file, String destDir) throws RepositoryException, FileNotFoundException
    {
        log.info("{Copy File}  " +file);

        try {
            String mime = mimeTypeService.getMimeType(file.getName());
            if(mime == null){
                mime = "application/octet-stream";
            }
            Node _dir = JcrUtils.getOrCreateByPath(destDir, "sling:Folder", session);
            Node node = JcrUtils.putFile(_dir, cleanName(file.getName()), mime, new FileInputStream(file));
            //log.debug("COPY:" + node.getPath());
            //System.out.println("COPY:" + node.getPath());
            response.getOutputStream().write( (file.getAbsoluteFile() +"\n").getBytes() );
            response.getOutputStream().flush();
        }catch(IOException ioex){
            ioex.printStackTrace();
        }catch(Exception ex){
            throw ex;
        }
    }


    private String cleanName(String name_){
        return name_.trim().replaceAll("\\[", "(").replaceAll("]", ")").replaceAll(":", "").replaceAll("\n", "");
    }
}
