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

'use strict';

var Rx = require('rx');
var PreferenceStore = require('./PreferenceStore');
var UserStore = require('./UserStore');
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
        file_.status == "PENDING";

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
        var _this = this;
        console.log("{upload all}");

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



