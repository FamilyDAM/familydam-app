
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
        //console.log("{saveUser Service} subscribe");
        this.sink = UserActions.saveUser.sink;
        UserActions.saveUser.source.subscribe(function(data_){
            this.saveUser(data_);
        }.bind(this));
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
        var _props = {
            'firstName':data_.firstName,
            'lastName':data_.lastName,
            'email':data_.email
        };

        var _this = this;
        return $.ajax({
            'method':'post'
            ,'url': PreferenceStore.getBaseUrl() +"/system/userManager/user/" +_data.username +".update.json"
            , 'data': _props
            , cache: false
            ,'xhrFields': {
                withCredentials: true
            }
        }).then(function(results, status_, xhr_){

            this.sink.onNext(true);

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

