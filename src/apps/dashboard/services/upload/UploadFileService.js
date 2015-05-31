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
        console.log("{upload single file} " +file_.path);
        console.dir(file_);
        debugger;

        var _this = this;
        var _currentFile = file_;

        //flip start flag
        _currentFile.status = "UPLOADING";
        _currentFile.percentComplete = "0";
        UploadActions.fileStatusAction.onNext(file_);

        var _action;
        // First check access, can we copy a local file (desktop mode) or do we need to upload the file)
        var _hasAccess = false;
        var _checkAccess = _this.checkAccess(_currentFile)
            .then(function (result_) {
                debugger;
                _hasAccess = result_.visible;

                if (!_hasAccess)
                {
                    _this.uploadFile(file_);
                }else{
                    _this.copyLocalFile(file_);
                }

            }, function (result_) {
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
        return $.ajax({
            method: "post",
            url: PreferenceStore.getBaseUrl() + "/api/import/info/",
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
        }, function(err_){
            return err_;
        });
    },


    /**
     * Tell the embedded server to copy a local file, by path.
     * @param dir
     * @param path
     */
    copyLocalFile: function (file_) {
         return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() + "/api/import/copy/",
                data: {'dir': file_.uploadPath, 'path': file_.path_, 'recursive': true},
                headers: {
                    "X-Auth-Token":  UserStore.token.value
                }
            }).then(function(data_, status_, xhr_){


                 _currentFile.status = "COMPLETE";
                 _currentFile.percentComplete = "100";
                 UploadActions.fileStatusAction.onNext(file_);


                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserActions.saveToken.onNext(_token);
                }
                return data_;
            });

    },


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile: function (file_) {
        debugger;
        var data = new FormData();
        data.append("path", file_.uploadPath);
        data.append("file", file_);

        return $.ajax({
            url: PreferenceStore.getBaseUrl() + "/api/import/file/upload/?format=json",
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            headers: {
                "X-Auth-Token":  UserStore.token.value,
                Accept : "application/json; charset=utf-8"
            },
            xhrFields: {
                onprogress: function (e) {
                    if (e.lengthComputable) {
                        console.log(e.loaded / e.total * 100 + '%');
                    }
                }
            }
        }).then(function(data_, status_, xhr_){
            debugger;
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
            console.dir(err_);
        });

    }

};