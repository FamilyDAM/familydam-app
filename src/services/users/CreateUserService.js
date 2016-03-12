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

    sink: undefined,

    subscribe: function () {
        console.log("{CreateUser Service} subscribe");
        this.sink = UserActions.createUser.sink;
        UserActions.createUser.source.subscribe(this.createUser.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    createUser: function (data_) {
        var _this = this;

        //var _username = data_.username;
        //var _password = data_.password;
        //var _userProps = JSON.stringify(data_.userProps);
        //var _data = {'name':_username, 'pwd': _password, 'pwdConfirm': _password, 'isRootAdmin': true, 'userProps': _userProps};


        var _data = data_.userProps;
        _data[':name'] = data_.username;
        _data['pwd'] = data_.password;
        _data['pwdConfirm'] = data_.password;
        _data['isSuperAdmin'] = true;

        //, 'url': PreferenceStore.getBaseUrl() + '/system/userManager/user.create.json'

        return $.ajax({
            'method': 'post'
            , 'url': PreferenceStore.getBaseUrl() + '/familydam/api/v1/users'
            , cache: false
            , dataType: "json"
            , data: _data
        }).then(function (results, status_, xhr_) {

            debugger;
            _this.sink.onNext(results);

            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                AuthActions.saveToken.onNext(_token);
            }

        }, function (xhr_, status_, errorThrown_) {

            debugger;
            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });


    }

};

