/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.services;

import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by mnimer on 3/5/16.
 */
public interface IImageRenditionService
{
    BufferedImage scaleImage(InputStream is, int longSize) throws RepositoryException, IOException;

    BufferedImage rotateImage(Session session, Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException;
}
