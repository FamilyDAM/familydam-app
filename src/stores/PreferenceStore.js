
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');

module.exports = {

    locale:new Rx.BehaviorSubject("en_us"),

    // Logged in user
    //_baseUrl : "http://localhost:9000",
    _baseUrl : "",

    //_baseUrl : "",
    _rootFileDirectory : "/content/dam-files/",

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
        return this._rootFileDirectory;
    },


    getLocale: function(){
        var _locale = window.localStorage.getItem("locale");
        if( _locale === undefined || _locale === null ){
            _locale = "en_us";
        }
        return _locale;
    },


    getSimpleLocale: function(){
        var _locale = window.localStorage.getItem("locale");
        if( _locale === undefined || _locale === null ){
            _locale = "en";
        }
        return _locale.substr(0,2);
    },


    setLocale: function(data_){
        window.localStorage.setItem("locale", data_);
        this.locale.onNext(data_);
    }

};