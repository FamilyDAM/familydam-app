
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

//var Rx = require('rx');
//var PreferenceStore = require('./PreferenceStore');
//var UserStore = require('./UserStore');
var UploadActions = require("./../actions/UploadActions");
//di = require('di');

module.exports = {

    _files: [],
    folders: [],


    subscribe: function() {
        console.log("{UploadStore}.init()");

        UploadActions.addFileAction.subscribe(this.addFile.bind(this));
        UploadActions.removeFileAction.subscribe(this.removeFile.bind(this));
        UploadActions.removeAllFilesAction.subscribe(this.removeAllFiles.bind(this));
        UploadActions.uploadAllFilesAction.subscribe(this.uploadAllFiles.bind(this));
        UploadActions.uploadFileAction.sink.subscribe(this.handleFileUpload.bind(this), this.handleFileUploadError.bind(this));
    },



    getFiles: function () {
        return this._files;
    },


    getFolders: function () {
        return this._folders;
    },


    addFile: function (file_) {
        console.dir(file_);
        file_.status = "PENDING";

        this._files.push(file_);
    },


    removeFile: function (file_) {
        var _pos = this._files.indexOf(file_);
        if (_pos > -1)
        {
            this._files.splice(_pos, 1);
        }
        return file_;
    },


    removeAllFiles: function (file_) {
        this._files = [];
    },



    uploadAllFiles: function (dir_) {
        //var _this = this;
        console.log("{upload all files}");

        this._files.forEach(function (file_) {
            //_this.uploadSingleFile(dir_, file_);
            UploadActions.uploadFileAction.source.onNext(file_);
        });
    },


    handleFileUpload: function(file_){
        UploadActions.removeFileAction.onNext(file_);
    },

    handleFileUploadError: function(err_){

    }


};



