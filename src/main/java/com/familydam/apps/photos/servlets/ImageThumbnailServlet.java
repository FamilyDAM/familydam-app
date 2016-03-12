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

import com.familydam.apps.photos.FamilyDAMConstants;
import com.familydam.apps.photos.services.ImageRenditionsService;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.PropertyOption;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.plugins.segment.SegmentStream;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;

/**
 * Image resize Servlet
 * <p>
 * Selectors
 * - resize = pull w/h from URL params
 * - thumb = hard coded sq. 200x200 size
 * <p>
 * Annotations below are short version of:
 */
@SlingServlet(resourceTypes = "sling/servlet/default",
        selectors = {"resize"},
        extensions = {"jpg", "JPG", "png", "PNG", "gif", "GIF"})
@Properties({
        @Property(name = "service.description", value = "photo-servlet Type Servlet"),
        @Property(name = "service.vendor", value = "The Apache Software Foundation"),
        @Property(name = "resize-engine", label = "Resize Method", value = "scalr", description = "What method of resizing should we use"
                , options = {
                @PropertyOption(name = "scalr", value = "scalr"),
                @PropertyOption(name = "image-magic", value = "image-magick")
        }),
        @Property(name = "image-magick-path", label = "Image Magic Path.", value = {"/opt/local/bin"}, description = "Path to your local installation of Image Magick")
})
@SuppressWarnings("serial")
public class ImageThumbnailServlet extends SlingSafeMethodsServlet
{

    private final Logger log = LoggerFactory.getLogger(ImageThumbnailServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;



    @Override
    protected void doGet(SlingHttpServletRequest request,
                         SlingHttpServletResponse response) throws ServletException,
            IOException
    {

        String[] selectors = request.getRequestPathInfo().getSelectors();
        String extension = request.getRequestPathInfo().getExtension();
        String resourcePath = request.getRequestPathInfo().getResourcePath();
        String imagePath = resourcePath.substring(0, resourcePath.indexOf("."));


        try {

            //Session session = request.getResourceResolver().adaptTo(Session.class);
            ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session adminSession = adminResolver.adaptTo(Session.class);



            Node cacheRoot = JcrUtils.getOrAddFolder(adminSession.getNode("/"), FamilyDAMConstants.CACHE_ROOT.substring(1));
            //Node cacheNode = JcrUtils.getNodeIfExists(cacheRoot, resourcePath);
            Resource cacheResource = adminResolver.getResource(FamilyDAMConstants.CACHE_ROOT +resourcePath);
            if( cacheResource != null ){

                returnInputStream(response, cacheResource.getResourceMetadata().getContentType(), cacheResource.adaptTo(InputStream.class));

            }else {

                ResourceResolver resolver = request.getResourceResolver();
                Resource resource = resolver.getResource(imagePath + "." + extension);


                String mimeType = resource.getResourceMetadata().getContentType().split("/")[1];


                int longSize = getLongSize(selectors);

                InputStream is = resource.adaptTo(InputStream.class);
                BufferedImage _bufImage = resizeImage(is, longSize);
                InputStream newImageIS = cacheImage(resourcePath, resource.getName(), _bufImage, mimeType, adminSession);

                String contentType = resource.getResourceMetadata().getContentType();
                returnInputStream(response, contentType, newImageIS);
            }

        }
        catch (Exception ex) {
            response.setStatus(500);
        }

    }


    private void returnInputStream(SlingHttpServletResponse response, String contentType, InputStream newImageIS) throws IOException
    {
        response.setContentType(contentType);
        response.setContentLength( new Long(((SegmentStream) newImageIS).getLength()).intValue() );


        byte[] buffer = new byte[10240];
        try (
                InputStream input = newImageIS;
                OutputStream output = response.getOutputStream();
        ) {
            for (int length = 0; (length = input.read(buffer)) > 0;) {
                output.write(buffer, 0, length);
            }
        }
    }


    private int getLongSize(String[] selectors)
    {
        if (selectors.length == 3) {
            return Math.max(new Integer(selectors[1]), new Integer(selectors[2]));
        } else if (selectors.length == 2) {
            return new Integer((selectors[1])).intValue();
        }
        return 250;
    }


    private BufferedImage resizeImage(InputStream is, int longSize) throws RepositoryException, IOException
    {
        BufferedImage image = new ImageRenditionsService().scaleImage(is, longSize);
        return image;
    }


    /**
     * Save the resized image into our system cache folder
     * @param path
     * @param name
     * @param bufImage
     * @param mimeType
     * @param session
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    private InputStream cacheImage(String path, String name, BufferedImage bufImage, String mimeType, Session session) throws RepositoryException, IOException
    {
        Node cacheRoot = JcrUtils.getOrAddFolder(session.getNode("/"), FamilyDAMConstants.CACHE_ROOT.substring(1));

        String relativePath = path.substring(0, path.lastIndexOf('/'));
        String relativeName = path.substring(path.lastIndexOf('/')+1);
        Node relativeParent = JcrUtils.getOrAddFolder(cacheRoot, relativePath.substring(1));


        File tempFile = File.createTempFile(name, mimeType);
        ImageIO.write(bufImage, mimeType, tempFile);

        Node cacheNode = JcrUtils.putFile(relativeParent, relativeName, "image/" +mimeType, new FileInputStream(tempFile));

        session.save();
        return cacheNode.getNode("jcr:content").getProperty("jcr:data").getBinary().getStream();

    }




    private void writeOutput(SlingHttpServletResponse response, InputStream is) throws IOException
    {
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        Writer w = response.getWriter();

        try {
            InputStream input = new BufferedInputStream(is);
            bos = new BufferedOutputStream(response.getOutputStream());

            byte[] buffer = new byte[8192];
            for (int length = 0; (length = input.read(buffer)) > 0; ) {
                bos.write(buffer, 0, length);
                //todo flush
            }
        }
        finally {
            //if( bis != null ) bis.close();
            //if( bos != null ) bos.close();
        }
    }


}

