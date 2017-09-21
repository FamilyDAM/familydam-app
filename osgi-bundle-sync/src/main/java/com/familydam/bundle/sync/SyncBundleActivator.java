/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.bundle.sync;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class SyncBundleActivator implements BundleActivator
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());



    @Override public void start(BundleContext bundleContext) throws Exception
    {
        log.trace("Starting FamilyDAM-Sync Bundle");


        //TODO: manully run cron jobs on startup
    }


    @Override public void stop(BundleContext bundleContext) throws Exception
    {
        log.trace("Stopping FamilyDAM-Sync Bundle");
    }
}
