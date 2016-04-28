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

    getSink: undefined,
    createSink: undefined,
    updateSink: undefined,
    deleteSink: undefined,

    subscribe: function () {
        console.log("{Node CRUD Service} subscribe");

        this.getSink = NodeActions.getNode.sink;
        this.createSink = NodeActions.createNode.sink;
        this.updateSink = NodeActions.updateNode.sink;
        this.deleteSink = NodeActions.deleteNode.sink;

        NodeActions.getNode.source.subscribe(this.getNode.bind(this));
        NodeActions.createNode.source.subscribe(this.createNode.bind(this));
        NodeActions.updateNode.source.subscribe(this.updateNode.bind(this));
        NodeActions.deleteNode.source.subscribe(this.deleteNode.bind(this));
    },

    /**
     * Return all of the data for a single node
     * @param val_
     * @returns {*}
     */
    getNode: function (path_) {
        
        var _this = this;
        var _url = path_ +".graph.-1.json/nt:file/jcr:uuid,name,path,index,parent,links,jcr:primaryType,jcr:created,jcr:mixinTypes,dam:metadata,dam:tags,dam:people,dam:note,dam:rating";


        $.ajax({
            method: "get",
            url: _url,
            'xhrFields': {
                withCredentials: true
            }
        }).then(function (data_, status_, xhr_) {

            _this.getSink.onNext(data_);

            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                UserActions.saveToken.onNext(_token);
            }
        }, function (xhr_, status_, errorThrown_) {
            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    },


    createNode: function (data_) {
        var _this = this;
        var _url = data_.path;
        var _data = JSON.stringify(data_);

        $.ajax({
            method: "post",
            url: _url,
            data: _data,
            processData: false,
            type: 'json',
            contentType: "application/json",
            'xhrFields': {
                withCredentials: true
            }
        }).then(function (data_, status_, xhr_) {

            _this.createSink.onNext(data_);

            // refresh the overall directories list
            DirectoryActions.refreshDirectories.onNext(true);
            FileActions.refreshFiles.onNext(true);


            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                UserActions.saveToken.onNext(_token);
            }

        }, function (xhr_, status_, errorThrown_) {
            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    },


    updateNode: function (data_) {
        var _this = this;
        var _url = data_.path;
        
        $.ajax({
            method: "post",
            url: data_.path,
            data: $.param(data_.props, true),
            processData: false,
            'xhrFields': {
                withCredentials: true
            }

        }).then(function (data_, status_, xhr_) {

            _this.updateSink.onNext(data_);

            // refresh the overall directories list
            DirectoryActions.refreshDirectories.onNext(true);
            FileActions.refreshFiles.onNext(true);


            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                UserActions.saveToken.onNext(_token);
            }

        }, function (xhr_, status_, errorThrown_) {
            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });


    },


    deleteNode: function (data_) {
        var _this = this;
        var _url = data_.path;


        return $.ajax({
            method: "delete",
            url: _url,
            'xhrFields': {
                withCredentials: true
            }
        }).then(function (data_, status_, xhr_) {


            //trigger refresh
            FileActions.refreshFiles.onNext(true);
            DirectoryActions.refreshDirectories.onNext(true);

            _this.deleteSink.onNext(data_);

            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                UserActions.saveToken.onNext(_token);
            }
        }, function (xhr_, status_, errorThrown_) {

            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });

    }
};




