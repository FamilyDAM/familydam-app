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

        try
        {
            console.log("{UserStore}.subscribe()");

            this.users = new Rx.BehaviorSubject([]);
            this.currentUser = new Rx.BehaviorSubject(undefined);
            this.token = new Rx.BehaviorSubject(window.localStorage.getItem("token"));

            UserActions.getUsers.sink.subscribe(this.setUsers.bind(this));
            AuthActions.login.sink.subscribe(this.setCurrentUser.bind(this));
            AuthActions.saveToken.subscribe(this.setToken.bind(this));
            AuthActions.logout.subscribe(function () {
                this.setToken(null);
            }.bind(this));


            UserActions.loadUser.source.subscribe(function (data_) {
                this.users.forEach(function (users_) {
                    for (var i = 0; i < users_.length; i++)
                    {
                        var _u = users_[i];
                        if( _u.id === data_){
                            UserActions.loadUser.sink.onNext(_u);
                        }
                    }
                }, this);

            }.bind(this));
        }
        catch (err_)
        {
            console.dir(err_);
        }
    },

    setToken: function (data_) {
        this.token.onNext(data_);
        if (data_ !== null && data_ !== undefined)
        {
            localStorage.setItem("token", data_);
        } else
        {
            localStorage.removeItem("token");
        }

    },

    setUsers: function (data_) {
        this.users.onNext(data_);
    },

    setCurrentUser: function (data_) {
        this.currentUser.onNext(data_);
    }

};

