
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
        console.log("{GetUsers Service} subscribe");
        this.sink = UserActions.getUsers.sink;
        UserActions.getUsers.source.subscribe(this.getUsers.bind(this));

        //refresh the list after any user data is saved
        UserActions.saveUser.sink.subscribe(this.getUsers.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUsers: function()
    {
        var _this = this;

        return $.ajax({
                    'method':'get'
                    ,'url': PreferenceStore.getBaseUrl() +'/system/userManager/user.tidy.1.json'
                    , cache: false

                }).then(function(results, status_, xhr_){
                    var list = [];

                    for(var key in results)
                    {
                        if( key != "admin" && key != "anonymous" )
                        {
                            var item = results[key];
                            item.username = key;
                            if (item.firstName === undefined)
                            {
                                item.firstName = item.username;
                            }
                            list.push(item);
                        }
                    }

                    var _sortedUsers = list.sort(function (a, b) { return b.username - a.username; });
                    _this.sink.onNext(_sortedUsers);

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

