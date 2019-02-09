/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos.services;

import org.apache.sling.api.resource.Resource;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;

/**
 * Created by mnimer on 3/5/16.
 */
public interface IImageResizeService
{
    File resizeImage(Resource resource, String uri, String mimeTypeExt, InputStream is, int longSize) throws Exception;
    BufferedImage scaleWithScalr(Resource resource, InputStream is, int longSize) throws Exception;
    File scaleWithImageMagik(Resource resource, InputStream is, int longSize) throws Exception;
}
