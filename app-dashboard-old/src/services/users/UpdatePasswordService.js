
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{changePassword Service} subscribe");
        this.sink = UserActions.changePassword.sink;
        UserActions.changePassword.source.subscribe(this.saveUser.bind(this));
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
        _data.userProps = {
            'newPwd':data_.password
        };

        var _this = this;
        return $.ajax({
            'method':'post'
            ,'url': PreferenceStore.getBaseUrl() +"/bin/familydam/api/v1/user/password"
            , 'data': _data
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
            }
            else if (xhr_.status == 403)
            {
                UserActions.alert.onNext("You do not have permission to change the password");
            }
            else {
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                this.sink.onError(_error);
            }
        }.bind(this));

    }

};

