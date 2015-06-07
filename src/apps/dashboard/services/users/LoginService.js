
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
        AuthActions.login.source.distinctUntilChanged().subscribe(this.login.bind(this));
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
        var _url = PreferenceStore.getBaseUrl() +'/api/users/login';

        //TODO: hash the password & salt

        return $.ajax({
                    'method':'post'
                    ,'url': _url
                    ,'data':{'username':data_.username, 'password':data_.password, 'salt':_salt}
                }).then(function(data_, status_, xhr_){
                    //send results to the store
                    _this.sink.onNext(data_);

                    // update token
                    var _token = xhr_.getResponseHeader("X-Auth-Token");
                    if( _token != null && _token !== undefined ){
                        AuthActions.saveToken.onNext(_token);
                    }
                }, function (xhr_, status_, errorThrown_){

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




