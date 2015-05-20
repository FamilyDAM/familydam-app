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

// Logged in user
var UserActions = require("./../actions/UserActions");
var AuthActions = require("./../actions/AuthActions");
var PreferenceStore = require("./../stores/PreferenceStore");


module.exports = {

    token: undefined,
    users: undefined,
    currentUser: undefined,

    subscribe: function () {
        console.log("{UserStore}.subscribe()");

        this.users = new Rx.BehaviorSubject({});
        this.currentUser = new Rx.BehaviorSubject(undefined);
        this.token = new Rx.BehaviorSubject(window.localStorage.getItem("token"));

        UserActions.getUsers.sink.subscribe(this.setUsers.bind(this));
        AuthActions.login.sink.subscribe(this.setCurrentUser.bind(this));
        AuthActions.saveToken.subscribe(this.setToken.bind(this));
    },

    setToken: function (data_) {
        this.token.onNext(data_);
        localStorage.setItem("token", data_);
    },

    setUsers: function (data_) {
        this.users.onNext(data_);
    },

    setCurrentUser: function (data_) {
        this.currentUser.onNext(data_);
    },

    /**
     * Login a single user
     * @param _username
     * @param _password
     * @returns {*}
     */
    /* deprectated
    login: function (_username, _password) {
        var _this = this;

        return Rx.Observable.defer(function ()
        {
            var _salt = new Date().getTime();
            return $.post(PreferenceStore.getBaseUrl() +'/api/users/login',
                {'username':_username, 'password':_password, 'salt':_salt}).then(function(data_, status_, xhr_){

                    var _token = xhr_.getResponseHeader("X-Auth-Token");
                    _this.setToken(_token);

                    _this.setUser(data_);
                    return data_;
                });
        });
    }, */

    /**
     * Get a list of all users, for the login screen
     * @returns {*}
     */
    /* deprectated
    listUsers: function () {

        var listUserObservable = Rx.Observable.defer(function () {
            return $.get(PreferenceStore.getBaseUrl() +'/api/users', {cache: false});
        }).map(function(results){
            var list = [];
            results.map(function(item){
                item.firstName = item.username;
                list.push(item);
            });
            return list.sort(function (a, b) { return b.username - a.username; });
        });
        return listUserObservable;

    }*/

};

