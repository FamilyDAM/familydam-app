/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
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




