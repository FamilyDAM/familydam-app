/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.services;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.familydam.apps.photos.FamilyDAMConstants;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

/**
 * Created by mnimer on 3/5/16.
 */
@Component
public class ImageExifParser implements IExifParser
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @Reference
    private ResourceResolverFactory resolverFactory;

    public ImageExifParser() {
    }

    public ImageExifParser(ResourceResolverFactory resolverFactory) {
        this.resolverFactory = resolverFactory;
    }

    @Activate
    protected void activate(final BundleContext bundleContext) {
        bundleContext.toString();
    }

    public Node parseExif(InputStream is, Node node) throws RepositoryException, ImageProcessingException, IOException
    {
        log.info("Parse EXIF:" +node.getPath() );

        Node metadataNode = JcrUtils.getOrAddNode(node, FamilyDAMConstants.METADATA, "nt:unstructured");

        try {
            Metadata metadata = ImageMetadataReader.readMetadata(is);

            Iterable<Directory> directories = metadata.getDirectories();

            for (Directory directory : directories) {
                String _name = directory.getName();

                Node dir = JcrUtils.getOrAddNode(metadataNode, _name, JcrConstants.NT_UNSTRUCTURED);

                Collection<Tag> tags = directory.getTags();
                for (Tag tag : tags) {
                    int tagType = tag.getTagType();
                    String tagTypeHex = tag.getTagTypeHex();
                    String tagName = tag.getTagName();
                    String nodeName = tagName.replace(" ", "_").replace("/", "_");
                    String desc = tag.getDescription();

                    Node prop = JcrUtils.getOrAddNode(dir, nodeName, JcrConstants.NT_UNSTRUCTURED);
                    prop.setProperty("name", tagName);
                    prop.setProperty("description", desc);
                    prop.setProperty("type", tagType);
                    prop.setProperty("typeHex", tagTypeHex);
                }
            }


            // Extract Image Date Stamp, and save to root
            Date date = new Date();
            if (metadata.getDirectory(ExifIFD0Directory.class) != null) {
                Date metadataDate = metadata.getDirectory(ExifIFD0Directory.class).getDate(306);
                if (metadataDate != null) {
                    date = metadataDate;
                }
            }


            Calendar dateCreatedCal = Calendar.getInstance();
            dateCreatedCal.setTime(date);
            node.setProperty(FamilyDAMConstants.DAM_DATECREATED, dateCreatedCal);
            new DateCreatedIndexGenerator(resolverFactory).addToIndex(null, new Calendar[]{dateCreatedCal});
        }
        catch (Exception ipe) {
            //swallow
            // File Format is not Supported - todo: log node & path
            log.warn(node.getPath() +" | " +ipe.getMessage());
        }

        return node;
    }
}
