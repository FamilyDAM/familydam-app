
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');

module.exports = {

    // Logged in user
    //_baseUrl : "http://localhost:9000",
    _baseUrl : "",

    //_baseUrl : "",
    _rootDirectory : "/content/dam-files/",
    _documentRootDirectory : "/documents/",

    //logged in user, start with default admin/admin 
    //admin/admin is changed on the system after the first user has been created so 
    //this will be reset after user login
    username : "admin",
    password : "admin",

    subscribe: function() {
        console.log("{PreferenceStore}.init()");
    },

    getBaseUrl: function () {
        return this._baseUrl;
    },

    getRootDirectory: function () {
        return this._rootDirectory;
    },

    getDocumentRootDirectory: function () {
        return this._rootDirectory +this._documentRootDirectory;
    }

};