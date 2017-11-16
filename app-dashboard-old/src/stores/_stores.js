/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var ContentStore = require('./ContentStore');
var DirectoryStore = require('./DirectoryStore');
var FileStore = require('./FileStore');
var PhotoStore = require('./PhotoStore');
var PreferenceStore = require('./PreferenceStore');
var SearchStore = require('./SearchStore');
var UploadStore = require('./UploadStore');
var UserStore = require('./UserStore');

module.exports = {
    subscribe:function()
    {
        ContentStore.subscribe();
        DirectoryStore.subscribe();
        FileStore.subscribe();
        PhotoStore.subscribe();
        PreferenceStore.subscribe();
        SearchStore.subscribe();
        UploadStore.subscribe();
        UserStore.subscribe();
    }
};