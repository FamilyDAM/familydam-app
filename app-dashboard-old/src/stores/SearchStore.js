
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');
var UserStore = require('../stores/UserStore');
//di              = require('di');

// Logged in user

var PreferenceStore = require("./PreferenceStore");
var FileActions = require("./../actions/FileActions");

module.exports = {

    results : new Rx.BehaviorSubject([]),

    subscribe: function() {
        //console.log("{SearchStore}.init()");

        FileActions.getFiles.sink.distinctUntilChanged().subscribe(function(data_){
            this.results.onNext(data_);
        }.bind(this));
    }



    /**
     * Search all files with limit/offset paging support, used by the grid view.
     * @param path
     * @param successCallback
     * @param errorCallback
     * @returns {*|Array|Object|Mixed|promise|HTMLElement}

    @deprectated
    searchImages : function(limit, offset, filterPath, filterTags, filterDateFrom, filterDateTo )
    {
        //todo: add support for these
        console.log(filterPath);
        console.log(filterTags);
        console.log(filterDateFrom);
        console.log(filterDateTo);

        return Rx.Observable.defer(function () {
            $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() +"/api/search/images",
                data: {
                    "limit":limit,
                    "offset":offset,
                    "orderBy": "jcr:lastModified"
                },
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token !== null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });
        });
    }
    **/

};



