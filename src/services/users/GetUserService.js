
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserActions = require('../../actions/UserActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        console.log("{GetUser Service} subscribe");
        this.sink = UserActions.getUser.sink;


        //refresh the list after any user data is saved
        UserActions.getUser.source.subscribe(function (user_){
            this.getUsers(user_);
        }.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUsers: function(user_)
    {
        var _this = this;
        var _url = "/home/users/" +user_.substr(0,1) +"/" +user_  +".tidy.-1.json";

        return $.ajax({
                    'method':'get'
                    ,'url': _url
                    , cache: false
                    ,'xhrFields': {
                        withCredentials: true
                    }

                }).then(function(results, status_, xhr_){

                    results.username = user_;
                    _this.sink.onNext(results);

                }, function (xhr_, status_, errorThrown_){
            
                    //send the error to the store (through the sink observer
                    if( xhr_.status == 401){
                        AuthActions.loginRedirect.onNext(true);
                    } else {
                        var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        _this.sink.onError(_error);
                    }
                });

    }

};

