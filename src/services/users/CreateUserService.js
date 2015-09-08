
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
        console.log("{CreateUser Service} subscribe");
        this.sink = UserActions.createUser.sink;
        UserActions.createUser.source.subscribe(this.createUser.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    createUser: function(data_)
    {
        var _this = this;

        var _username = data_.username;
        var _password = data_.password;
        var _userProps = JSON.stringify(data_.userProps);

        var _data = {'username':_username,  'password': _password, 'userProps': _userProps};

        return $.ajax({
                    'method':'post'
                    ,'url': PreferenceStore.getBaseUrl() +'/api/users'
                    , cache: false
                    , data: _data
                }).then(function(results, status_, xhr_){
                    _this.sink.onNext(results);

                    var _token = xhr_.getResponseHeader("X-Auth-Token");
                    if( _token != null && _token !== undefined ){
                        AuthActions.saveToken.onNext(_token);
                    }
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

