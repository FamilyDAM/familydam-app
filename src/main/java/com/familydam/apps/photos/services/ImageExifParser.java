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
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;

/**
 * Created by mnimer on 3/5/16.
 */
public class ImageExifParser
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public Node parseExif(InputStream is, Node node) throws RepositoryException, ImageProcessingException, IOException
    {
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


            SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd");
            String dateCreated = dateFormat.format(date);
            node.setProperty(FamilyDAMConstants.DAM_DATECREATED, dateCreated);

        }
        catch (ImageProcessingException ipe) {
            //swallow
            // File Format is not Supported - todo: log node & path
            log.warn(node.getPath() +" | " +ipe.getMessage());
        }

        return node;
    }
}
