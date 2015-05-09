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

'use strict';

var Rx = require('rx');
//di              = require('di');
var PreferenceStore = require('./PreferenceStore');
var UserStore = require('./UserStore');

// Logged in user



module.exports = {

    currentNode:new Rx.BehaviorSubject({}),


    init: function()
    {
        console.log("{ContentStore}.init()");

    }

    /**
     * Return all of the data for a single node
     * @param path
     * @param successCallback
     * @param errorCallback
     * @returns Object

    getNodeById: function( id )
    {
        var _searchPath = "/api/data/" +id;

        return Rx.Observable.defer(function () {
            return $.ajax({
                method: "get",
                url: PreferenceStore.getBaseUrl() +_searchPath,
                data: {},
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });
        });
    },  */


/**
    updateNodeById:function(id_, data_){

        var _data = JSON.stringify(data_);

        return Rx.Observable.defer(function () {

            return $.ajax({
                method: "post",
                data: _data,
                processData: false,
                url: PreferenceStore.getBaseUrl() +"/api/data/" +id_,
                type: 'json',
                contentType: "application/json",
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                // update the token in memory (incase expire date changes)
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });


        });
    },
**/

    /**
    deleteNodeById:function(id_){
        return Rx.Observable.defer(function () {
            //todo
            return $.ajax({
                method: "delete",
                url: PreferenceStore.getBaseUrl() +"/api/data/" +id_,
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });


        });
    },
    **/
};

//di.annotate(AuthActions, new di.Inject());


