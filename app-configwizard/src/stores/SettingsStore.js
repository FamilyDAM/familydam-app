
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';
//var electronRequire = require;
//import {ipcRenderer} from 'electron';
var electronRequire = require;
var ipcRenderer = electronRequire('electron').ipcRenderer;
//var ipcRenderer = require('electron').ipcRenderer
//const electron = require('electron').app;
//const ipcRenderer = electron.ipcRenderer;

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
        ConfigActions.addUser.subscribe( this.addUser );
        ConfigActions.removeUser.subscribe( this.removeUser );


        ConfigActions.saveSettings.subscribe( function(){
            var _json = this.buildJson();
            console.log("Calling Save Config : " +_json);
            var result = ipcRenderer.send('saveConfig', _json );
            console.log("{saveSettings} RESULT=" +result);
        }.bind(this));

        ipcRenderer.on("saveConfigComplete", function(event){
            console.log("{saveConfigComplete} RESULT=" +event);
        }.bind(this));

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


    checkValidState: function()
    {
        var isEmailValid = true;//todo
        var isFamilyNameValid = true; //todo
        var isStorageLocationValid = false;

        if( this.email.value !== undefined && this.email.value.length > 0 ){
            //isEmailValid = true;
        }

        if( this.storageLocation.value !== undefined && this.storageLocation.value.length > 0 ){
            isStorageLocationValid = true;
        }

        if( isEmailValid && isFamilyNameValid && isStorageLocationValid ){
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
        settings.version = "0.1.0";
        settings.license = "";
        settings.state = "READY";
        settings.host = "localhost";
        settings.port = "9000";
        settings.profile = "test";
        settings.defaultLocale = this.locale.value;
        settings.storageLocation = this.storageLocation.value;

        return JSON.stringify(settings);
    }

};
