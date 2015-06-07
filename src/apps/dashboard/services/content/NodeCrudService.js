
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var AuthActions = require('../../actions/AuthActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('../../stores/UserStore');
var PreferenceStore = require('../../stores/PreferenceStore');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    getSink:undefined,
    createSink:undefined,
    updateSink:undefined,
    deleteSink:undefined,

    subscribe : function(){
        console.log("{Node CRUD Service} subscribe");

        this.getSink = NodeActions.getNode.sink;
        this.createSink = NodeActions.createNode.sink;
        this.updateSink = NodeActions.updateNode.sink;
        this.deleteSink = NodeActions.deleteNode.sink;

        NodeActions.getNode.source.distinctUntilChanged().subscribe(this.getNode.bind(this));
        NodeActions.createNode.source.distinctUntilChanged().subscribe(this.createNode.bind(this));
        NodeActions.updateNode.source.distinctUntilChanged().subscribe(this.updateNode.bind(this));
        NodeActions.deleteNode.source.subscribe(this.deleteNode.bind(this));
    },

    /**
     * Return all of the data for a single node
     * @param val_
     * @returns {*}
     */
    getNode: function(id_)
    {
        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +"/api/data/" +id_;


        return $.ajax({
            method: "get",
            url: _url,
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){

            _this.getSink.onNext(data_);

            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                UserActions.saveToken.onNext(_token);
            }
        }, function (xhr_, status_, errorThrown_){
            //send the error to the store (through the sink observer
            if( xhr_.status == 401){
                AuthActions.loginRedirect.onNext(true);
            }else
            {
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    },


    createNode: function(data_) {
        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +"/api/data/" +data_.id;
        var _data = JSON.stringify(data_);

        return $.ajax({
            method: "post",
            url: _url,
            data: _data,
            processData: false,
            type: 'json',
            contentType: "application/json",
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){

            _this.createSink.onNext(data_);

            // refresh the overall directories list
            DirectoryActions.refreshDirectories.onNext(true);
            FileActions.refreshFiles.onNext(true);


            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                UserActions.saveToken.onNext(_token);
            }

        }, function (xhr_, status_, errorThrown_){
            //send the error to the store (through the sink observer
            if( xhr_.status == 401){
                AuthActions.loginRedirect.onNext(true);
            }else
            {
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    },


    updateNode: function(data_) {
        var _this = this;
        var _data = JSON.stringify(data_);
        var _url =  PreferenceStore.getBaseUrl() +"/api/data/" +data_.id;

        return Rx.Observable.defer(function () {

            return $.ajax({
                method: "post",
                data: _data,
                processData: false,
                url: _url,
                type: 'json',
                contentType: "application/json",
                headers: {
                    "X-Auth-Token":  UserStore.token.value
                }
            }).then(function(data_, status_, xhr_){


                _this.updateSink.onNext(data_);

                // refresh the overall directories list
                DirectoryActions.refreshDirectories.onNext(true);
                FileActions.refreshFiles.onNext(true);


                // update the token in memory (incase expire date changes)
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserActions.saveToken.onNext(_token);
                }

            }, function (xhr_, status_, errorThrown_){
                //send the error to the store (through the sink observer
                if( xhr_.status == 401){
                    AuthActions.loginRedirect.onNext(true);
                }else
                {
                    var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                    _this.sink.onError(_error);
                }
            });


        });
    },


    deleteNode: function(data_) {
        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +"/api/data/" +data_.id;


        return $.ajax({
            method: "delete",
            url: _url,
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){

            _this.deleteSink.onNext(data_);

            //trigger refresh
            FileActions.refreshFiles.onNext(true);
            DirectoryActions.refreshDirectories.onNext(true);

            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                UserActions.saveToken.onNext(_token);
            }
        }, function (xhr_, status_, errorThrown_){

            //send the error to the store (through the sink observer
            if( xhr_.status == 401){
                AuthActions.loginRedirect.onNext(true);
            }else
            {
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    }
};




