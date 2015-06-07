
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var DirectoryActions = require('../../actions/DirectoryActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        console.log("{GetFiles Service} subscribe");
        this.sink = DirectoryActions.getDirectories.sink;
        DirectoryActions.getDirectories.source.distinctUntilChanged().subscribe(this.getDirectories.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getDirectories: function(path_)
    {
        console.log("{GetDirectoryService} getDirectories()" );

        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +"/api/directory/";

        console.dir(UserStore.token.value);

        return $.ajax({
            method: "get",
            url: PreferenceStore.getBaseUrl() +"/api/directory/",
            data: {'path':path_},
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){

            console.log("{GetDirectoriesService} getDirectories() success" );

            _this.sink.onNext(data_);

            // update token
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                UserActions.saveToken.onNext(_token);
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

