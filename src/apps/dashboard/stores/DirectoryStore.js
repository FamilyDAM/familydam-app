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
var DirectoryActions = require('./../actions/DirectoryActions');
var UserStore = require('./UserStore');
var SearchStore = require('./SearchStore');
var PreferenceStore = require('./PreferenceStore');
//di = require('di');

module.exports = {

    root: "/dam:files/",

    /**
     * the last folder selected by a user in the sidebar folder tree.
     * A simple property, stored in a behavior subject.
     * Note: the value is pushed from the DirectoryAction
     */
    getLastSelectedFolder: new Rx.BehaviorSubject( {'path':"/dam:files/"} ),


    createFolder:function(dir_, name_){
        return Rx.Observable.defer(function () {
            //todo
            return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() +"/api/directory/",
                data: {'path':dir_, 'name':name_},
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


    
    /**
     * List all directories visible to a user
     * @returns {*}
     */
    getDirectories: function(rootPath_)
    {
        if( rootPath_ == undefined ){
            rootPath_ = this.root;

        }


        return Rx.Observable.defer(function () {
            return $.ajax({
                method: "get",
                url: PreferenceStore.getBaseUrl() +"/api/directory/",
                data: {'path':rootPath_},
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


    getFilesInDirectory: function(path_)
    {
        return Rx.Observable.defer(function () {
            return $.ajax({
                method: "get",
                url: PreferenceStore.getBaseUrl() +"/api/files",
                data: {'path':path_},
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
        }).map(function(results_){
            SearchStore.setResults(results_);
            return results_;
        });
    }


};

//di.annotate(AuthActions, new di.Inject());


