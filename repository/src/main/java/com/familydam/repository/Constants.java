package com.familydam.repository;

public class Constants {

    public static final String IS_FAMILY_ADMIN = "isFamilyAdmin";
    public static final String APP_ROOT = "/content";


    // paths
    public static final String CONTENT_ROOT = "dam-files";
    public static final String CLOUD_ROOT = "dam-cloud";
    public static final String SYSTEM_ROOT = "dam:system";
    public static final String SYSTEM_JOBQUEUE_FOLDER = "job-queue";
    public static final String SYSTEM_ASSETS_FOLDER = "assets";
    public static final String EMAIL_ROOT = "dam-email";
    public static final String WEB_ROOT = "dam-web";
    public static final String KEYWORDS = "dam:tags";
    public static final String METADATA = "dam:metadata";
    public static final String EXIF = "dam:exif";
    public static final String RENDITIONS = "dam:renditions";
    public static final String DAM_IMAGE = "dam:image";
    public static final String DAM_TAGGABLE = "dam:taggable";
    public static final String DAM_MUSIC = "dam:music";
    public static final String DAM_VIDEO = "dam:video";
    public static final String DAM_DATECREATED = "dam:date.created";
    public static final String DAM_DATEMODIFIED= "dam:date.modified";
    public static final String USER_DAM_SECURITY = "dam:security";

    //mixins
    public static final String MIXIN_DAM_EXTENSIBLE = "dam:extensible";
    public static final String MIXIN_DAM_USER = "dam:user";

    //security
    public static final String FAMILY_ADMIN_GROUP = "family_admin_group";
    public static final String FAMILY_GROUP = "family_group";
    public static final String JWT_TOKEN = "jwtToken";
    public static final String PUBLIC_KEY = "publicKey";
    public static final String PUBLIC_KEY_BASE64 = "publicKeyBase64";
    public static final String PRIVATE_KEY = "privateKey";
    public static final String PRIVATE_KEY_BASE64 = "privateKeyBase64";

    //Cache nodes
    public static final String CACHES = "caches";
    public static final String INDEXES = "indexes";
    public static final String PHOTO_TAGS = "photo-tags";
    public static final String PHOTO_PEOPLE = "photo-people";
    public static final String PHOTO_DATES = "photo-dates";

    //Hateoas
    public static final String HATEAOS_CONTENTTYPE = "application/hal+json";
    public static final String HATEAOS_EMBEDDED = "_embedded";
    public static final String HATEAOS_LINKS = "_links";

    //Node props
    public static final String CHILDREN = "children";
    public static final String ID = "id";
    public static final String NAME = ":name";
    public static final String FIRST_NAME = "firstName";
    public static final String LAST_NAME = "lastName";
    public static final String EMAIL = "email";
    public static final String PASSWORD = "password";
    public static final String ORDER = "order";
    public static final Object SLUG = "slug";
    public static final Object LABEL = "label";
    public static final Object PATH = "path";
    public static final Object ROLES = "roles";
    public static final Object EMBEDDED = "embedded";

    //Events
    public static final String EVENT_IMAGE_METADATA = "image.metadata";
    public static final String EVENT_IMAGE_PHASH = "image.phash";
    public static final String EVENT_IMAGE_THUMBNAIL = "image.thumbnail";
    public static final String EVENT_MP3_METADATA = "mp3.metadata";

    //status
    public static final String WAITING = "WAITING";
    public static final String PROCESSING = "PROCESSING";
    public static final String FAILED = "FAILED";

    //
    public static final String THUMBNAIL200 = "thumbnail.200";
    public static final String WEB500 = "web.500";
    public static final String WEB1024 = "web.1024";

    //headers
    public static final String XAUTHTOKEN = "X-Auth-Token";
    public static final String XAUTHTOKENPARAM = "token";



    // simple strings
    public static final String TYPE= "type";
    public static final String VALUE= "value";
    public static final String DESCRIPTION= "description";
    public static final String TITLE = "title";
    public static final String TRACK = "track";
    public static final String ARTIST = "artist";
    public static final String ALBUM = "album";
    public static final String ALBUM_ARTIST = "album_artist";
    public static final String ALBUM_IMAGE = "album_image";
    public static final String ALBUM_IMAGE_MIMETYPE = "album_image_mimetype";
    public static final String YEAR = "year";
    public static final String GENRE = "genre";
    public static final String GENRE_CODE = "genre_code";
    public static final String COMMENT = "comment";
    public static final String VERSION = "version";
    public static final String CHAPTERS = "chapters";
    public static final String CHAPTER_TOC = "chapters_toc";
    public static final String COMPOSER = "composer";
    public static final String COPYRIGHT = "copyright";
    public static final String ENCODER = "encoder";
    public static final String ITUNES_COMMENT = "itunes_comment";
    public static final String ORIGINAL_ARTIST = "original_artist";
    public static final String PUBLISHER = "publisher";
    public static final String WIDTH = "width";
    public static final String HEIGHT = "height";

}
