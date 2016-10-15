
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

        //console.log("{GetUser Service} subscribe");
        this.sink = UserActions.getUser.sink;


        //refresh the list after any user data is saved
        UserActions.getUser.source.subscribe(function (user_){
            this.getUser(user_);
        }.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUser: function(user_)
    {

        return $.ajax({
                    'method':'get'
                    ,'url': PreferenceStore.getBaseUrl() +"/system/userManager/user/" +user_ +".tidy.1.json"
                    , data: {'user':user_}
                    , cache: false
                    ,'xhrFields': {
                        withCredentials: true
                    }

                }).then(function(results, status_, xhr_){

                    results.username = user_;
                    this.sink.onNext(results);

                }.bind(this), function (xhr_, status_, errorThrown_){
                    //send the error to the store (through the sink observer
                    if( xhr_.status == 401){
                        AuthActions.loginRedirect.onNext(true);
                    } else {
                        var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        this.sink.onError(_error);
                    }
                }.bind(this));

    }

};

