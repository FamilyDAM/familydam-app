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
    _folders: [],


    init: function() {
        console.log("{UploadStore}.init()");
    },


    addFile: function (file_) {
        console.dir(file_);
        file_.status == "PENDING";

        this._files.push(file_);
        UploadActions.addFileAction.onNext(file_);
    },


    removeFile: function (file_) {
        var _pos = this._files.indexOf(file_);
        if (_pos > -1)
        {
            this._files.splice(_pos, 1);
            UploadActions.removeFileAction.onNext(file_);
        }
        return file_;
    },


    addFolder: function (folder_) {
        this._folders.push(folder_);
    },


    removeFolder: function (folder_) {
        var _pos = this._folders.indexOf(folder_);
        if (_pos > -1)
        {
            this._folders.splice(_pos, 1);
        }
    },


    removeAll: function () {
        console.log("{remove all}");
        this._files = [];

        //send no since it's not for a specific file
        UploadActions.removeFileAction.onNext(null);
    },


    getFiles: function () {
        return this._files;
    },


    getFolders: function () {
        return this._folders;
    },


    uploadSingleFile: function (dir_, file_) {
        console.log("{upload single file}");
        console.dir(file_);

        var _this = this;
        var _dir = dir_;
        var _currentFile = file_;

        //flip start flag
        _currentFile.status = "UPLOADING";
        UploadActions.fileStatusAction.onNext(file_);

        // start upload
        var _hasAccess = false;
        var _checkAccess = _this.checkAccess(dir_, _currentFile.name)
            .subscribe(function (result_) {
                _hasAccess = result_.visible;

                if (!_hasAccess)
                {
                    _this.uploadFile(_dir, file_).subscribe(
                        function (uploadResult_) {

                            for (var i = 0; i < _this._files.length; i++)
                            {
                                var obj = _this._files[i];
                                if (obj.id == _currentFile.id)
                                {
                                    _this._files.splice(i, 1);
                                    break;
                                }
                            }

                            console.log("in subscribe");
                            console.dir(uploadResult_)

                            _currentFile.status = "COMPLETE";
                            UploadActions.fileStatusAction.onNext(_currentFile);

                            return uploadResult_;
                        }, function (uploadError_) {
                            _currentFile.status = "ERROR";
                            UploadActions.fileStatusAction.onNext(_currentFile);

                            console.log("in subscribe error");
                            console.dir(uploadError_)

                            return uploadError_;
                        });
                }
            });


    },


    uploadAllFiles: function (dir_) {
        var _this = this;
        console.log("{upload all}");

        this._files.forEach(function (file_) {
            _this.uploadSingleFile(dir_, file_);
        });
    },


    /**
     * Check to see if the file is accessible to the embedded server, so we can do a quick copy. Instead of upload.
     * @param dir - passthrough for the next step in the sequence
     * @param path
     * @returns {HttpPromise}
     */
    /* deprectated */
    checkAccess: function (dir_, path_) {
        return Rx.Observable.defer(function () {
            //todo
            return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() + "/api/import/info/",
                data: {'dir': dir_, 'path': path_},
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });
        });

    },


    /**
     * Tell the embedded server to copy a local file, by path.
     * @param dir
     * @param path
     */
    /* deprectated */
    copyLocalFile: function (dir, path_) {
        return Rx.Observable.defer(function () {
            //todo
            return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() + "/api/import/copy/",
                data: {'dir': dir_, 'path': path_, 'recursive': true},
                headers: {
                    "X-Auth-Token":  UserStore.getToken()
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });
        });
    },


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    /* deprectated */
    uploadFile: function (dir_, file_) {
        return Rx.Observable.defer(function () {

            var data = new FormData();
            data.append("path", dir_);
            data.append("file", file_);

            return $.ajax({
                url: PreferenceStore.getBaseUrl() + "/api/import/file/upload/?format=json",
                type: 'POST',
                data: data,
                cache: false,
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                headers: {
                    "X-Auth-Token":  UserStore.getToken(),
                    Accept : "application/json; charset=utf-8"
                }
            }).then(function(data_, status_, xhr_){
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    UserStore.setToken(_token);
                }
                return data_;
            });
        });
    }

};

//di.annotate(AuthActions, new di.Inject());


