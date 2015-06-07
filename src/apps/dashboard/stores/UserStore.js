
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
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

        this.users = new Rx.BehaviorSubject([]);
        this.currentUser = new Rx.BehaviorSubject(undefined);
        this.token = new Rx.BehaviorSubject(window.localStorage.getItem("token"));

        UserActions.getUsers.sink.subscribe(this.setUsers.bind(this));
        AuthActions.login.sink.subscribe(this.setCurrentUser.bind(this));
        AuthActions.saveToken.subscribe(this.setToken.bind(this));
        AuthActions.logout.subscribe(function(){
            this.setToken(null);
        }.bind(this));
    },

    setToken: function (data_) {
        this.token.onNext(data_);
        if( data_ != null && data_ != undefined )
        {
            localStorage.setItem("token", data_);
        }else{
            localStorage.removeItem("token");
        }

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

