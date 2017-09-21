/*
 * Copyright (c) 2016  Mike Nimer & 11:58 Labs
 */

package com.familydam.core;

/**
 * Created by mnimer on 3/5/16.
 */
public class FamilyDAMCoreConstants
{
    public static final String IS_FAMILY_ADMIN = "isFamilyAdmin";

    // Security Groups
    public static final String FAMILY_ADMIN_GROUP = "family_admin_group";
    public static final String FAMILY_GROUP = "family_group";

    //paths
    public static final String USER_DAM_SECURITY = "dam:security";

    //properties
    public static final String JWT_TOKEN = "jwtToken";
    public static final String PUBLIC_KEY = "publicKey";
    public static final String PUBLIC_KEY_BASE64 = "publicKeyBase64";
    public static final String PRIVATE_KEY = "privateKey";
    public static final String PRIVATE_KEY_BASE64 = "privateKeyBase64";




    //mixins
    public static final String DAM_EXTENSIBLE = "dam:extensible";
    public static final String DAM_IMAGE = "dam:image";

    //properties
    public static final String DAM_DATECREATED = "dam:datecreated";

    //Hateoas
    public static final String HATEAOS_CONTENTTYPE = "application/hal+json";
    public static final String HATEAOS_EMBEDDED = "_embedded";
    public static final String HATEAOS_LINKS = "_links";

}
