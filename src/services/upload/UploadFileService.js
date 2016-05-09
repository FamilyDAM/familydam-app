/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');
var UserActions = require("./../../actions/UserActions");
var UploadActions = require("./../../actions/UploadActions");
var PreferenceStore = require("./../../stores/PreferenceStore");
var UserStore = require("./../../stores/UserStore");

module.exports = {

    sink: undefined,

    /**
     * Setup action Listeners
     */
    subscribe:function(){
        this.sink = UploadActions.uploadFileAction.sink;
        UploadActions.uploadFileAction.source.distinctUntilChanged().subscribe( this.execute.bind(this) );
    },


    /**
     * Invoke service
     */
    execute:function(file_)
    {
        //console.log("{upload single file} " +file_.path);
        //console.dir(file_);


        var _this = this;
        var _currentFile = file_;

        //flip start flag
        _currentFile.status = "UPLOADING";
        _currentFile.percentComplete = "0";


        // short circut the check access. If the path is null we know we have to do a regular update
        if( file_.path == undefined ){
            this.uploadFile(file_);
            return;
        }


        var _action;
        // First check access, can we copy a local file (desktop mode) or do we need to upload the file)
        var _hasAccess = false;
        UploadActions.fileStatusAction.onNext(file_);
        var _checkAccess = _this.checkAccess(_currentFile)
            .then(function (result_, status_, xhr_) {
                _hasAccess = result_.visible;

                if (!_hasAccess)
                {
                    _this.uploadFile(file_);
                }else{
                    _this.copyLocalFile(file_);
                }

            }, function (result_, status_, xhr_) {
                _this.uploadFile(file_);
            });


    },



    /**
     * Check to see if the file is accessible to the embedded server, so we can do a quick copy. Instead of upload.
     * @param dir - passthrough for the next step in the sequence
     * @param path
     * @returns {HttpPromise}
     */
    checkAccess: function (file_) {
        var _this = this;

        return $.ajax({
            method: "post",
            url: "/bin/familydam/api/v1/upload/info",
            data: {'dir': file_.uploadPath, 'path': file_.path},
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                UserActions.saveToken.onNext(_token);
            }
            return data_;
        }, function(result_, status_, xhr_){
            if( xhr_.status == 401){
                AuthActions.loginRedirect.onNext(true);
            }else
            {
                var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        });
    },


    /**
     * Tell the embedded server to copy a local file, by path.
     * @param dir
     * @param path
     */
    copyLocalFile: function (file_) {
        var _this = this;

        if( file_.recursive == undefined ){
            file_.recursive = true;
        }

         return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() + "/api/import/file/copy/",
                data: {'dir': file_.uploadPath, 'path': file_.path, 'recursive': file_.recursive},
                 'xhrFields': {
                     withCredentials: true
                 }
            }).then(function(data_, status_, xhr_){

                 file_.status = "COMPLETE";
                 file_.percentComplete = "100";
                 UploadActions.fileStatusAction.onNext(file_);
                 UploadActions.removeFileAction.onNext(file_);


                 var _token = xhr_.getResponseHeader("X-Auth-Token");
                 if( _token != null && _token !== undefined ){
                     UserActions.saveToken.onNext(_token);
                 }
                 return data_;

         }, function(err_){
             if( xhr_.status == 401){
                 AuthActions.loginRedirect.onNext(true);
             }else
             {
                 var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                 _this.sink.onError(_error);
             }
         });

    },


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile: function (file_) {
        var _this = this;
        var data = new FormData();
        data.append("file", file_);
        data.append("name", file_.name);
        data.append("path", file_.uploadPath);
        //data.append("lastModified", file_.lastModified);
        //data.append("lastModifiedDate", file_.lastModifiedDate);

        return $.ajax({
            url: '/bin/familydam/api/v1/upload/',
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            headers: {
                Accept : "application/json; charset=utf-8"
            },
            xhrFields: {
                withCredentials: true,
                onprogress: function (e) {
                    if (e.lengthComputable) {
                        console.log(e.loaded / e.total * 100 + '%');
                    }
                }
            }
        }).then(function(data_, status_, xhr_){
            file_.status = "COMPLETE";
            file_.percentComplete = "100";
            UploadActions.fileStatusAction.onNext(file_);
            UploadActions.removeFileAction.onNext(file_);

            return data_;
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