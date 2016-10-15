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

        var source = UploadActions.uploadFileAction.source
            .subscribe((d)=>{

                for (var i = 0; i < d.length; i++)
                {
                    var file = d[i];
                    this.fileQueue.push(file);
                }

                for (var i = 0; i < Math.min(this.fileQueue.length, 3); i++)
                {
                    this.uploadNextFile();
                }

                //console.log("done");
            }, (e)=>{
                debugger;
                //console.log("error");
            });

    },





    uploadNextFile:function () {
        if( this.fileQueue.length > 0 )
        {
            var file = this.fileQueue.pop();
            if(file)
            {
                console.dir(file);
                if( file.path ){
                    //console.log("check access");
                    this.checkAccess(file).then(
                        function (v0) {
                                                                                                                                                                                                                               console.log(v0);
                            if( v0.visible )
                            {
                                //console.log("visible, copy");
                                this.copyLocalFile(file).then(
                                    function (v1) {
                                        this.uploadNextFile();
                                    }.bind(this),
                                    function (e1) {
                                        this.uploadNextFile();
                                    }.bind(this));
                            }else{
                                //console.log("not visible, upload");
                                this.uploadFile(file).then(
                                    function (v2) {
                                        this.uploadNextFile();
                                    }.bind(this),
                                    function (e2) {
                                        this.uploadNextFile();
                                    }.bind(this));
                            }
                        }.bind(this),
                        function (e0) {
                            //console.log("error");
                            this.uploadNextFile();
                        }.bind(this));
                }else
                {
                    //console.log("else clause, upload");
                    this.uploadFile(file).then(
                        function (v) {
                            this.uploadNextFile();
                        }.bind(this),
                        function (e) {
                            this.uploadNextFile();
                        }.bind(this));
                }
            }
        }
    },



    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile: function (file_) {

        var _this = this;
        var _dataFile = file_;
        var data = new FormData();
        data.append("file", file_);
        data.append("id", file_.id);
        data.append("name", file_.name);
        data.append("path", file_.path);
        data.append("destination", file_.uploadPath);
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

            //this.uploadNextFile();
            UploadActions.uploadCompleted.onNext(data_);
            //UploadActions.removeFileAction.onNext(data_);

            return this;
        }.bind(this), function (xhr_, status_, errorThrown_) {

            //this.uploadNextFile();

            // handle the error
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
        }.bind(this)).promise();
    },




    /**
     * Invoke service

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
     */


    /**
     * Check to see if the file is accessible to the embedded server, so we can do a quick copy. Instead of upload.
     * @param dir - passthrough for the next step in the sequence
     * @param path
     * @returns {HttpPromise}
     */
    checkAccess: function (file_) {
        var _this = this;
        return $.ajax({
            method: "get",
            url: "/bin/familydam/api/v1/upload/info?path=" +encodeURI(file_.path).replace("&", "%26"),
            headers: {
                "X-Auth-Token": UserStore.token.value
            }
        }).then(function (data_, status_, xhr_) {
            return JSON.parse(data_);
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

        if ( !file_.recursive )
        {
            file_.recursive = true;
        }
        return $.ajax({
            method: "post",
            url: "/bin/familydam/api/v1/upload/copy",
            data: {'dir': file_.uploadPath, 'path': file_.path, 'recursive': true},
            'xhrFields': {
                withCredentials: true,
                onprogress: function (e) {
                    var indx = e.target.responseText.substr(0, e.target.responseText.length-1).lastIndexOf("\n");
                    var lastLine = e.target.responseText.substr(indx);

                    UploadActions.uploadMessage.onNext(lastLine);
                }
            }
        }).then(function (data_, status_, xhr_) {
            file_.status = "COMPLETE";
            file_.percentComplete = "100";
            //UploadActions.fileStatusAction.onNext(file_);
            //UploadActions.removeFileAction.onNext(file_);
            UploadActions.uploadCompleted.onNext(data_);

            return JSON.parse(data_);

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

    }



};
