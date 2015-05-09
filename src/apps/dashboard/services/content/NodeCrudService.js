/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

var Rx = require('rx');
var AuthActions = require('../../actions/AuthActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
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

    subscribe : function(getAction_, createAction_, updateAction_, deleteAction_){
        console.log("{Node CRUD Service} subscribe");
        this.getSink = getAction_.sink;
        this.createSink = createAction_.sink;
        this.updateSink = updateAction_.sink;
        this.deleteSink = deleteAction_.sink;

        getAction_.source.subscribe(this.getNode.bind(this));
        createAction_.source.subscribe(this.createNode.bind(this));
        updateAction_.source.subscribe(this.updateNode.bind(this));
        deleteAction_.source.subscribe(this.deleteNode.bind(this));
    },

    /**
     * Return all of the data for a single node
     * @param val_
     * @returns {*}
     */
    getNode: function(path_)
    {
        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +path_;


        return $.ajax({
            method: "get",
            url: _url,
            headers: {
                "X-Auth-Token":  UserStore.token.getValue()
            }
        }).then(function(data_, status_, xhr_){

            _this.getSink.onNext(data_);

            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                AuthActions.saveToken.onNext(_token);
            }
            return data_;
        }, function (xhr_, status_, errorThrown_){
            //send the error to the store (through the sink observer
            var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
            _this.sink.onError(_error);
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
                "X-Auth-Token":  UserStore.token.getValue()
            }
        }).then(function(data_, status_, xhr_){

            _this.createSink.onNext(data_);

            // refresh the overall directories list
            DirectoryActions.refreshDirectories.onNext(true);
            FileActions.refreshFiles.onNext(true);


            // update the token in memory (incase expire date changes)
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                AuthActions.saveToken.onNext(_token);
            }
            return data_;
        }, function (xhr_, status_, errorThrown_){
            //send the error to the store (through the sink observer
            var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
            _this.sink.onError(_error);
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
                    "X-Auth-Token":  UserStore.token.getValue()
                }
            }).then(function(data_, status_, xhr_){


                _this.updateSink.onNext(data_);

                // refresh the overall directories list
                DirectoryActions.refreshDirectories.onNext(true);
                FileActions.refreshFiles.onNext(true);


                // update the token in memory (incase expire date changes)
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    AuthActions.saveToken.onNext(_token);
                }
                return data_;

            }, function (xhr_, status_, errorThrown_){
                //send the error to the store (through the sink observer
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
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
                AuthActions.saveToken.onNext(_token);
            }


        }, function (xhr_, status_, errorThrown_){

            //send the error to the store (through the sink observer
            var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
            _this.sink.onError(_error);
        });

    }
};




