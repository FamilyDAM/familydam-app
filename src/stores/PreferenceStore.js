
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');

module.exports = {

    // Logged in user
    _baseUrl : "http://localhost:9000",
    //_baseUrl : "",
    _rootDirectory : "/dam:files/",
    _documentRootDirectory : "/documents/",


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