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
            //console.log("{UserStore}.subscribe()");

            this.currentUser = new Rx.BehaviorSubject(this.getCurrentUser());
            this.users = new Rx.BehaviorSubject(undefined);
            this.token = new Rx.BehaviorSubject(window.localStorage.getItem("token"));

            UserActions.getUsers.sink.subscribe(this.setUsers.bind(this));
            UserActions.getUser.sink.subscribe(this.setCurrentUser.bind(this));
            AuthActions.saveToken.subscribe(this.setToken.bind(this));
            AuthActions.logout.subscribe(function () {
                this.currentUser.onNext(null);
                window.localStorage.setItem("currentUser", undefined);
                this.setToken(null);
            }.bind(this));


            try
            {
                UserActions.getUser.source.subscribe(function (data_) {
                    this.users.forEach(function (users_) {
                        if( users_ ) {
                            for (var i = 0; i < users_.length; i++) {
                                var _u = users_[i];
                                if (_u.id === data_) {
                                    UserActions.loadUser.sink.onNext(_u);
                                }
                            }
                        }
                    }, this);
                }.bind(this));
            }catch(err_){
                console.dir(err_);
            }
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

    getCurrentUser:function(){
        var _user = window.localStorage.getItem("currentUser");
        if( _user === null  || _user === undefined || _user === "undefined" ){ return undefined; }
        return JSON.parse(_user);
    },

    setCurrentUser: function (data_) {
        window.localStorage.setItem("currentUser", JSON.stringify(data_));
        this.currentUser.onNext(data_);
    }

};

