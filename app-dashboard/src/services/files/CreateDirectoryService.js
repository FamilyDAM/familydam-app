
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var UserActions = require('../../actions/UserActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var FileActions = require('../../actions/FileActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{GetFiles Service} subscribe");
        this.sink = DirectoryActions.createFolder.sink;
        DirectoryActions.createFolder.source.distinctUntilChanged().subscribe(this.createDirectory.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    createDirectory: function(data_)
    {
        var _this = this;
        var _name = data_.name ;
        var _dir = data_.path;
        if( _dir.trim().substr(_dir.length-1) == "/" ){
            _dir = _dir +"*"
        }else{
            _dir = _dir +"/*"
        }

        return $.ajax({
                    method: "post",
                    url: _dir,
                    data: {':name':_name, 'jcr:mixins':'dam:folder'},
                    'xhrFields': {
                        withCredentials: true
                    }
                }).then(function(data_, status_, xhr_){
                    _this.sink.onNext(data_);
                    // refresh the overall directories list
                    DirectoryActions.refreshDirectories.onNext(true);
                    FileActions.refreshFiles.onNext(true);

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
                        UserActions.alert.onNext("Error creating folder, you might now have permission");
                        //var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        //_this.sink.onError(_error);
                    }
                });


    }

};

