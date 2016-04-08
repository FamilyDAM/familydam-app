
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
        console.log("{Login Service} subscribe");
        this.sink = AuthActions.login.sink;
        AuthActions.login.source.subscribe(this.login.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     */
    login: function(data_)
    {
        console.log("{Login Service} login(" +data_.username +"," +data_.password +")");
        var _this = this;
        var _salt = new Date().getTime();
        var _url = PreferenceStore.getBaseUrl() +'/j_security_check?';

        //TODO: hash the password & salt
        return $.ajax({
                    'method':'post'
                    ,'url': _url
                    ,'data':{'j_username':data_.username, 'j_password':data_.password, 'j_validate':'true'}
                
                }).then(function(result_, status_, xhr_){

                    UserActions.getUser.source.onNext(data_.username);
                    //send results to the store
                    //_this.sink.onNext(data_);

                }.bind(this), function (xhr_, status_, errorThrown_){

                    //send the error to the store (through the sink observer
                    if( xhr_.status == 401){
                        AuthActions.loginRedirect.onNext(true);
                    }else
                    {
                        var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        _this.sink.onError(_error);
                    }
                });

    }
};




