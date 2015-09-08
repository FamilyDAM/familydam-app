
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
        console.log("{saveUser Service} subscribe");
        this.sink = UserActions.saveUser.sink;
        UserActions.saveUser.source.subscribe(this.saveUser.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    saveUser: function(data_)
    {
        var _data = {};
        _data.username = data_.username;
        _data.userProps = JSON.stringify({
            'firstName':data_.firstName,
            'lastName':data_.lastName,
            'email':data_.email
        });

        var _this = this;
        return $.ajax({
            'method':'post'
            ,'url': PreferenceStore.getBaseUrl() +'/api/users/' +data_.username
            , 'data': _data
            , cache: false
        }).then(function(results, status_, xhr_){

            _this.sink.onNext(true);

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

