
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


    addFile: function (files_) {
        for (var i = 0; i < files_.length; i++)
        {
            var obj = files_[i];
            this._files.push(obj);
        }
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
        console.log("{upload all files} count=" +this._files.length);

        UploadActions.startUpload.onNext({count:this._files.length});
        UploadActions.uploadFileAction.source.onNext(this._files);
    },


    handleFileUpload: function(file_){
        UploadActions.startUpload.onNext({count:1});

        var _files = [];
        _files.push(file_);
        UploadActions.removeFileAction.onNext(_files);
    },

    handleFileUploadError: function(err_){

    }


};



