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
import com.familydam.apps.photos.services.ImageResizeService;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.PropertyOption;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.oak.commons.IOUtils;
import org.apache.jackrabbit.oak.plugins.segment.SegmentStream;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.InvalidItemStateException;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Dictionary;

/**
 * Image resize Servlet
 * <p>
 * Selectors
 * - resize = pull w/h from URL params
 * - thumb = hard coded sq. 200x200 size
 * <p>
 * Annotations below are short version of:
 */
//todo add decorator to add thumbnail hateoas link
@SlingServlet(
        metatype = true,
        resourceTypes = "sling/servlet/default",
        selectors = {"resize"},
        extensions = {"jpg","jpeg", "JPG", "JPEG", "png", "PNG", "gif", "GIF"})
@Properties({
        @Property(name = "resize-library", label = "Resize Library", value = "scalr", description = "What resizing library should we use"
                , options = {
                @PropertyOption(name = "scalr", value = "scalr"),
                @PropertyOption(name = "image-magick", value = "image-magick")
        }),
        @Property(name = "image-magick-path", label = "Image Magic Path.", value = {""}, description = "Path to your local installation of Image Magick (ex: /opt/local/bin)")
})
public class ImageThumbnailServlet extends SlingSafeMethodsServlet
{

    private final Logger log = LoggerFactory.getLogger(ImageThumbnailServlet.class);

    @Reference
    private ResourceResolverFactory resolverFactory;

    private ImageResizeService imageRenditionsService;


    private String resizeLibrary = "scalr";
    private String imageMagickPath = "/";


    protected void activate(ComponentContext ctx) {
        Dictionary<?, ?> props = ctx.getProperties();

        String defaultLibrary = "scalr";
        String defaultImageMagickLocation = "/opt/local/bin";
        //todo, add OS check for windows and set win default instead of mac default

        this.resizeLibrary = PropertiesUtil.toString(props.get("resize-library"), defaultLibrary);
        this.imageMagickPath = PropertiesUtil.toString(props.get("image-magick-path"), defaultImageMagickLocation);

        imageRenditionsService = new ImageResizeService(resizeLibrary, imageMagickPath);
    }



    @Override
    protected void doGet(SlingHttpServletRequest request,
                         SlingHttpServletResponse response) throws ServletException,IOException
    {

        String[] selectors = request.getRequestPathInfo().getSelectors();
        String extension = request.getRequestPathInfo().getExtension();
        String resourcePath = request.getRequestPathInfo().getResourcePath();
        String imagePath = resourcePath.substring(0, resourcePath.indexOf("."));
        String imageUri = request.getRequestURI();
        File _tmpFile = null;

        try {

            //Session session = request.getResourceResolver().adaptTo(Session.class);
            ResourceResolver adminResolver = resolverFactory.getAdministrativeResourceResolver(null);
            Session adminSession = adminResolver.adaptTo(Session.class);



            Node cacheRoot = JcrUtils.getOrAddFolder(adminSession.getNode("/"), FamilyDAMConstants.CACHE_ROOT.substring(1));
            //Node cacheNode = JcrUtils.getNodeIfExists(cacheRoot, resourcePath);
            Resource cacheResource = adminResolver.getResource(FamilyDAMConstants.CACHE_ROOT +imageUri);
            if( cacheResource != null ){

                returnInputStream(response, cacheResource.getResourceMetadata().getContentType(), cacheResource.adaptTo(InputStream.class));

            }else {

                ResourceResolver resolver = request.getResourceResolver();
                Resource resource = resolver.getResource(imagePath +"." +extension);


                String mimeType = resource.getResourceMetadata().getContentType();
                String mimeTypeExt = mimeType.split("/")[1];
                int longSize = getLongSize(selectors);

                InputStream is = resource.adaptTo(InputStream.class);
                log.info("Resize Image {} to {}", resource.getPath(), longSize);
                _tmpFile = imageRenditionsService.resizeImage(resource, imageUri, mimeTypeExt, is, longSize);

                String newImageISPath = cacheImage(resource, imageUri, _tmpFile, mimeType, adminSession);
                adminSession.save();
                returnInputStream(response, mimeType, resolver.getResource(newImageISPath).adaptTo(InputStream.class) );
            }

        }
        catch (InvalidItemStateException iise) {

            ResourceResolver resolver = request.getResourceResolver();
            Resource resource = resolver.getResource(resourcePath);
            if( resource == null ){
                // if null, grab the original
                resource = resolver.getResource(imagePath +"." +extension);
            }
            returnInputStream(response, resource.getResourceMetadata().getContentType(), resource.adaptTo(InputStream.class));

        }catch (Exception ex) {
            response.getOutputStream().write(ex.getMessage().getBytes());
            response.setStatus(500);
        }
        finally{
            if( _tmpFile != null && _tmpFile.exists() ) _tmpFile.delete();
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




    /**
     * Save the tmp file (after resize) to our system cache folder
     * @param resource
     * @param bufImage
     * @param mimeType
     * @param session
     * @return
     * @throws RepositoryException
     * @throws IOException
     */
    private String cacheImage(Resource resource, String uri, File tmpFile_, String mimeType,  Session session) throws RepositoryException, IOException
    {
        Node cacheRoot = JcrUtils.getOrAddFolder(session.getNode("/"), FamilyDAMConstants.CACHE_ROOT.substring(1));

        String relativePath = cacheRoot.getPath() +resource.getParent().getPath();
        Node relativeParent = JcrUtils.getOrCreateByPath(relativePath, "sling:Folder", session);

        //Save the
        Node cacheNode = JcrUtils.putFile(relativeParent, uri.substring(uri.lastIndexOf("/")+1), mimeType, new FileInputStream(tmpFile_));

        session.save();
        return cacheNode.getPath();
    }




    private void returnInputStream(SlingHttpServletResponse response, String contentType, InputStream newImageIS) throws IOException
    {
        try {
            response.setContentType(contentType);

            int _len = new Long(newImageIS.available()).intValue();
            if( newImageIS instanceof SegmentStream ){
                _len = new Long(((SegmentStream) newImageIS).getLength()).intValue();
            }
            response.setContentLength(_len);

            IOUtils.copy(newImageIS, response.getOutputStream());

        }catch(Exception ex){
            ex.printStackTrace();
        }
    }


}

