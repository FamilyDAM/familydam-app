
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var AuthActions = require('../../actions/AuthActions');
var UserActions = require('../../actions/UserActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{Login Service} subscribe");
        this.sink = AuthActions.checkAuth.sink;
        AuthActions.checkAuth.source.subscribe(this.checkAuth.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     */
    checkAuth: function(data_)
    {
        //console.log("{Check Auth Service}");
        var _this = this;
        var _url = '/bin/familydam/api/v1/auth/validate';


        //TODO: hash the password & salt
        return $.ajax({
                    'method':'get'
                    ,'url': _url

                }).then(function(result_, status_, xhr_){
            
                    //send results to the store
                    //this.sink.onNext(data_);

                }.bind(this), function (xhr_, status_, errorThrown_){

                    //send the error to the store (through the sink observer
                    if( xhr_.status == 401){
                        UserActions.alert.onNext("Session has expired, log in again");
                        AuthActions.loginRedirect.onNext(true);
                    }else
                    {
                        var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        _this.sink.onError(_error);
                    }
                });

    }
};




