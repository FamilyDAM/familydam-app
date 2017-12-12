/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {Subject, Observable} from '@reactivex/rxjs';

import request from 'superagent';
import AppActions from '../../library/actions/AppActions';
import FileActions from './../FileActions';


class UploadFileService {

    host = "http://localhost:9000";
    sink = undefined;
    fileQueue = new Subject();
    /**
     * Setup action Listeners
     */
    constructor(source_, sink_) {

        this.sink = sink_;

        source_.subscribe((file_) => {
            //debugger;
            this.fileQueue.next(file_);
            //this.uploadNextFile();

            //console.log("done");
        });


        this.fileQueue
            //.take(3)
            .flatMap(file_ => {
                if( Array.isArray(file_) ){
                    for (var i = 0; i < file_.length; i++) {
                        var file = file_[i];
                        return this.uploadNextFile(file);
                    }
                }else {
                    return this.uploadNextFile(file_);
                }
            }, null, 3)
            .subscribe(val_ => {
                //debugger;
            });
    }


    uploadNextFile(file) {

        console.log("file: " + file);
        if (file)//!file.path)
        {
            //console.log("else clause, upload");
            //debugger;
            return Observable.of(file).flatMap(req => new Promise((resolve, reject) => {
                return this.uploadFile(file)
                    .then(result=>resolve(result))
                    .catch(err => {
                        //debugger;
                        let retry = 1;
                        if( file.retry ){
                            retry=file.retry+1;
                        }
                        file.progress = 0;
                        file.retry = retry;
                        file.error = "Retrying request (" +retry +"/3)";
                        return reject(err);
                    });
            })).retry(2).catch(err => {
                //debugger;
                //var _error = {'code': err.status, 'message': err.message};
                file.error = err.status +": " +err.message;
                file.progress = 0;
                return Observable.of(err);
            });

        }

        return null;
        /**
        else
        {
            //console.log("check access");
            this.checkAccess(file).then(
                function (v0) {
                    //debugger;
                    console.log(v0);
                    if (v0.visible) {
                        //console.log("visible, copy");
                        this.copyLocalFile(file).then(
                            function (v1) {
                                this.uploadNextFile();
                            }.bind(this),
                            function (e1) {
                                this.uploadNextFile();
                            }.bind(this));
                    } else {
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
        }
         **/
    }




    /**
     * Check to see if the file is accessible to the embedded server, so we can do a quick copy. Instead of upload.
     * @param dir - passthrough for the next step in the sequence
     * @param path
     * @returns {HttpPromise}
     */
    checkAccess(file_){

        return request
            .get(this.host +'/api/familydam/v1/files/upload/info')
            .withCredentials()
            .send({path: encodeURI(file_.path).replace("&", "%26")})
            .then(data => {
                //debugger;
                return JSON.parse(data);
            }, error => {
                if (error.status === 401) {
                    AppActions.navigateTo.next('://login');
                } else {
                    var _error = {'code': error.status, 'message': error.message};
                    //file_.error = _error;
                    FileActions.uploadError.next(_error);
                }
            });
    }


    /**
     * Tell the embedded server to copy a local file, by path.
     * @param dir
     * @param path
     */
    copyLocalFile(file_) {

        if (!file_.recursive) {
            file_.recursive = true;
        }

        return request
            .post(this.host +'/api/familydam/v1/files/upload/copy')
            .withCredentials()
            .field("dir", file_.uploadPath)
            .field("path", file_.path)
            .field("recursive", file_.recursive)
            .then(data_ => {
                //debugger;
                file_.status = "COMPLETE";
                file_.percentComplete = "100";
                FileActions.uploadCompleted.next(data_);
                return JSON.parse(data_);
            });

    }


    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile(file_) {

        var filePathName = file_.uploadPath;
        if( file_.webkitRelativePath ){
            filePathName += "/" +file_.webkitRelativePath.substr(0, file_.webkitRelativePath.lastIndexOf("/"));
        }


        var formData = new FormData();
        formData.append("name", file_.name);
        formData.append("path", filePathName);
        formData.append("destination", filePathName);
        formData.append(file_.name, file_);

        var u = window.localStorage.getItem("u");
        var p = window.localStorage.getItem("p");
        //.set('Authorization', 'user ' +u +":" +p)


        console.log("Upload to:" +this.host +filePathName );
        console.dir(file_);
        return request
            .post('http://localhost:9000/api/familydam/v1/files/upload')
            .withCredentials()
            .set('Authorization', 'user ' +u +":" +p)
            .send(formData)
            .on('progress', event => {
                console.log(event);
                file_.progress = event.percent;
                FileActions.uploadProgress.next(file_);
                /* the event is:
                {
                  direction: "upload" or "download"
                  percent: 0 to 100 // may be missing if file size is unknown
                  total: // total file size, may be missing
                  loaded: // bytes downloaded or uploaded so far
                } */
            });


        /**
         .set("Content-Type", "application/octet-stream")
         .end(function(err, res){
                if( !err ){
                    UploadActions.uploadCompleted.onNext(data_);
                }else {
                    if (err.timeout) {
                        // timed out!
                    }

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
                }
            });
         **/


    }


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

}


export default UploadFileService;
