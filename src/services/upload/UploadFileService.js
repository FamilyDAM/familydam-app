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
    fileQueue: [],

    /**
     * Setup action Listeners
     */
    subscribe: function () {
        this.sink = UploadActions.uploadFileAction.sink;

        var source = UploadActions.uploadFileAction.source.subscribe((files_)=> {
            this.fileQueue = files_;
            this.uploadFileQueue(3);
        });
        /**
         var pauser = new Rx.Subject();
         var source = UploadActions.uploadFileAction.source
         .map(function (file_) {
                console.log("start");
                pauser.onNext(false);
                this.uploadFile(file_).then(
                    function (v) {
                        console.log("complete");
                        pauser.onNext(true);
                        return v;
                    }.bind(this),
                    function (e) {
                        debugger;
                        pauser.onNext(true);
                        return new Error(e);
                    }.bind(this));
            }.bind(this))
         .catch(function(err_){
                debugger;
                console.log(err_);
            })
         .subscribe(function (result) {
            },function (result) {
                debugger;
            });

         source.subscribe(function noop(){});
         pauser.onNext(true);
         **/

        /**
         UploadActions.uploadFileAction.source
         .first()
         .flatMap(function (file_) {
                debugger;
                return Rx.Observable.fromPromise(this.uploadFile(file_).then(
                    function (v) {
                        debugger;
                        return v;
                    },
                    function (e) {
                        debugger;
                        return new Error(e);
                    }));
            }.bind(this))
         .catch(function(err_){
                debugger;
            })
         .repeat()
         .subscribe(function (result) {
                debugger
            },function (result) {
                debugger
            });
         **/
        /**
         UploadActions.uploadFileAction.source
         .subscribe( (file_) => {
                setTimeout(this.uploadFile(file_), 0);
            });
         **/


        /**
         UploadActions.uploadFileAction.source
         .bufferWithCount(1)
         .subscribe( (files_) => {
                for (var i = 0; i < files_.length; i++)
                {
                    var _file = files_[i];
                    this.uploadFile(_file);
                }
            });
         **/


        /**
         UploadActions.uploadFileAction.source.map(function(file_){
            return Rx.Observable.defer(function () {
                return Rx.Observable.return(this.uploadFile(file_));
            }.bind(this));
        })
         .concatAll() // consume each inner observable in sequence
         .subscribe(function (result) {
        }, function (error) {
            console.log("error", error);
        }, function () {
            console.log("complete");
        });
         **/

    },


    /**
     * Invoke service
     */
    execute: function (file_) {
        //console.log("{upload single file} " +file_.path);
        //console.dir(file_);


        var _this = this;
        var _currentFile = file_;

        //flip start flag
        _currentFile.status = "UPLOADING";
        _currentFile.percentComplete = "0";


        // short circut the check access. If the path is null we know we have to do a regular update
        if (file_.path == undefined)
        {
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
                } else
                {
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
                "X-Auth-Token": UserStore.token.value
            }
        }).then(function (data_, status_, xhr_) {
            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if (_token != null && _token !== undefined)
            {
                UserActions.saveToken.onNext(_token);
            }
            return data_;
        }, function (result_, status_, xhr_) {
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
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

        if (file_.recursive == undefined)
        {
            file_.recursive = true;
        }

        return $.ajax({
            method: "post",
            url: PreferenceStore.getBaseUrl() + "/api/import/file/copy/",
            data: {'dir': file_.uploadPath, 'path': file_.path, 'recursive': file_.recursive},
            'xhrFields': {
                withCredentials: true
            }
        }).then(function (data_, status_, xhr_) {

            file_.status = "COMPLETE";
            file_.percentComplete = "100";
            UploadActions.fileStatusAction.onNext(file_);
            UploadActions.removeFileAction.onNext(file_);

            return data_;

        }, function (err_) {
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
        }).promise();

    },


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path

    uploadFile: function (file_) {
        var _this = this;
        var _dataFile = file_;
        var data = new FormData();
        data.append("file", file_);
        data.append("name", file_.name);
        data.append("path", file_.uploadPath);
        //data.append("lastModified", file_.lastModified);
        //data.append("lastModifiedDate", file_.lastModifiedDate);

        UploadActions.uploadStarted.onNext(file_);

        return $.ajax({
            url: '/bin/familydam/api/v1/upload/',
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            xhrFields: {
                withCredentials: true,
                onprogress: function (e) {
                    if (e.lengthComputable)
                    {
                        console.log(e.loaded / e.total * 100 + '%');
                    }
                }
            }
        }).then(function (data_, status_, xhr_) {

            UploadActions.uploadCompleted.onNext(file_);
            UploadActions.removeFileAction.onNext(file_);

            return this;
        }, function (xhr_, status_, errorThrown_) {

            debugger;
            UploadActions.uploadError.onNext(file_);
            //send the error to the store (through the sink observer
            if (xhr_.status == 401)
            {
                AuthActions.loginRedirect.onNext(true);
            }
            if (xhr_.status == 403)
            {
                UserActions.alert.onNext("You do not have permission to upload to this folder");
            } else
            {
                var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                _this.sink.onError(_error);
            }
            return this;
        }).promise();
    },
     */


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload for each file in the file queue
     * @param dir
     * @param path
     */
    uploadFileQueue: function (threads_) {

        var deferredPromises = [];
        for (var i = 0; i < threads_; i++)
        {
            if (this.fileQueue.length == 0) break;

            var _this = this;
            var _dataFile = this.fileQueue.pop();

            if( _dataFile.retry && _dataFile.retry > 1 ){
                continue;
            }


            var data = new FormData();
            data.append("file", _dataFile);
            data.append("name", _dataFile.name);
            data.append("path", _dataFile.uploadPath);
            //data.append("lastModified", file_.lastModified);
            //data.append("lastModifiedDate", file_.lastModifiedDate);

            UploadActions.uploadStarted.onNext(_dataFile);

            var _uploadPromise = $.ajax({
                url: '/bin/familydam/api/v1/upload/',
                type: 'POST',
                data: data,
                cache: false,
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                xhrFields: {
                    withCredentials: true,
                    onProgress: function (e) {
                        if (e.lengthComputable)
                        {
                            console.log(e.loaded / e.total * 100 + '%');
                        }
                    }
                }
            }).then(function (data_, status_, xhr_) {

                UploadActions.uploadCompleted.onNext(_dataFile);
                UploadActions.removeFileAction.onNext(_dataFile);

            }.bind(this), function (xhr_, status_, errorThrown_) {

                UploadActions.uploadError.onNext(_dataFile);
                //send the error to the store (through the sink observer
                if (xhr_.status == 401)
                {
                    AuthActions.loginRedirect.onNext(true);
                }else
                {
                    if (xhr_.status == 403)
                    {
                        UserActions.alert.onNext("You do not have permission to upload to this folder");
                    } else
                    {
                        var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                        _this.sink.onError(_error);

                        //put the file back in the queue and retry, we might need to add a retry count to the file object
                        _dataFile.retry = 1;
                        this.fileQueue.push(_dataFile)
                    }
                }
                return this;
            }.bind(this));

            deferredPromises.push(_uploadPromise);
        }

        if(deferredPromises.length>0)
        {
            $.when(deferredPromises).then(function (arg1) {
                // rerun to get the next file in the queue
                this.uploadFileQueue(3);
            }.bind(this));
        }

    }

};