/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.apps.photos;

/**
 * Created by mnimer on 3/5/16.
 */
public class FamilyDAMConstants
{
    public static final String METADATA = "dam:metadata";
    public static final String DAM_DATECREATED = "dam:datecreated";

    //mixins
    public static final String DAM_EXTENSIBLE = "dam:extensible";
    public static final String DAM_IMAGE = "dam:image";

    //The job topics
    public static final String EXIF_JOB_TOPIC = "familydam/image/exif/job";
    public static final String PHASH_JOB_TOPIC = "familydam/image/phash/job";


    //paths
    public static final String CACHE_ROOT = "/caches";

}
