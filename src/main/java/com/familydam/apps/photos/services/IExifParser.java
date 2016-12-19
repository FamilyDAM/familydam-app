package com.familydam.apps.photos.services;

import com.drew.imaging.ImageProcessingException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by mike on 11/15/16.
 */
public interface IExifParser {
    Node parseExif(InputStream is, Node node) throws RepositoryException, ImageProcessingException, IOException;
}
