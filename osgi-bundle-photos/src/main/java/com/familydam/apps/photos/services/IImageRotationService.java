package com.familydam.apps.photos.services;

import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import org.apache.sling.api.resource.Resource;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public interface IImageRotationService
{
    BufferedImage rotateImage(Session session, Node node) throws RepositoryException, IOException, ImageProcessingException, MetadataException;
    BufferedImage rotateImage(File file) throws RepositoryException, IOException, ImageProcessingException, MetadataException;
    BufferedImage rotateImage(BufferedImage image, Resource resource) throws RepositoryException, IOException, ImageProcessingException, MetadataException;
}
