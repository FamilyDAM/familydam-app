/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by mnimer on 3/16/16.
 */
public class CoreBundleActivator implements BundleActivator
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());



    @Override public void start(BundleContext bundleContext) throws Exception
    {
        log.trace("Starting FamilyDAM-Core Bundle");
        //todo, move content folder creation to this folder

    }


    @Override public void stop(BundleContext bundleContext) throws Exception
    {
        log.trace("Stopping FamilyDAM-Core Bundle");
    }



}
