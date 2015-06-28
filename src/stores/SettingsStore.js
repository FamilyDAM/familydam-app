
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';
var electronRequire = require;
var ipc = electronRequire('ipc');

var Rx = require('rx');
var ConfigActions = require('../actions/ConfigActions');

module.exports = {

    isValid:new Rx.BehaviorSubject(false),
    locale:new Rx.BehaviorSubject("en_us"),
    email:new Rx.BehaviorSubject(undefined),
    storageLocation:new Rx.BehaviorSubject(undefined),
    users:new Rx.BehaviorSubject([]),
    json:new Rx.BehaviorSubject({}),


    subscribe: function()
    {
        console.log("{SettingStore}.init()");

        this.locale.onNext(this.getLocale());

        ConfigActions.changeLocale.distinctUntilChanged().subscribe(this.setLocale.bind(this));

        //configuration fields
        ConfigActions.emailChange.subscribe( this.setEmail.bind(this) );
        //ConfigActions.familyNameChange.sink
        ConfigActions.storageFolderChange.subscribe( this.setStorageLocation.bind(this) );
        ConfigActions.addUser.subscribe( this.addUser.bind(this) );
        ConfigActions.removeUser.subscribe( this.removeUser.bind(this) );


        ConfigActions.saveSettings.subscribe( function(){
            var result = ipc.sendSync('saveConfig', this.buildJson());
            console.log("RESULT=" +result);
        }.bind(this) );

    },


    getLocale: function(){
        var _locale = window.localStorage.getItem("locale");
        if( _locale === undefined || _locale === null ){
            _locale = "en_us";
        }
        return _locale;
    },


    setLocale: function(data_){
        window.localStorage.setItem("locale", data_);
        this.locale.onNext(data_);
    },


    setEmail: function( data_ ){
        this.email.onNext(data_);
        this.checkValidState();
    },


    setStorageLocation: function( data_ ){
        this.storageLocation.onNext(data_);
        this.checkValidState();
    },


    addUser: function( data_ ){
        var _users = this.users.value;
        _users.push(data_);
        this.users.onNext(_users);
        this.checkValidState();
    },


    removeUser: function( data_ ){
        var _users = this.users.value.filter(
            function(u){
                var fName = data_.split("|")[0];
                var lName = data_.split("|")[1];
                return u.firstName !== fName || u.lastName !== lName;
            }
        );


        this.users.onNext(_users);
        this.checkValidState();
    },


    checkValidState: function()
    {
        var isEmailValid = false;
        var isFamilyNameValid = true; //todo
        var isStorageLocationValid = false;
        var isUserListValid = false;

        if( this.email.value !== undefined && this.email.value.length > 0 ){
            isEmailValid = true;
        }

        if( this.storageLocation.value !== undefined && this.storageLocation.value.length > 0 ){
            isStorageLocationValid = true;
        }

        if( this.users.value !== undefined && this.users.value.length > 0 ){
            isUserListValid = true;
        }

        if( isEmailValid && isFamilyNameValid && isStorageLocationValid && isUserListValid ){
            //generate new json packet of valid data
            this.json.onNext( this.buildJson() );
            // flip the isValid flag
            this.isValid.onNext(true);
        }else{
            this.isValid.onNext(false);
        }
    },


    buildJson:function()
    {
        var settings = {};
        settings.version = "1.0.0";
        settings.license = "";
        settings.state = "READY";
        settings.port = "9000";
        settings.defaultLocale = this.locale.value;
        settings.storageLocation = this.storageLocation.value;
        settings.users = this.users.value;

        return JSON.stringify(settings);
    }

};
