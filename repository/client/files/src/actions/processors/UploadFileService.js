/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {Observable} from '@reactivex/rxjs';

import request from 'superagent';
import AppSettings from '../../library/actions/AppSettings';
import FileActions from './../FileActions';
require('superagent-charset')(request);

class UploadFileService {

    sink = undefined;
    /**
     * Setup action Listeners
     */
    constructor(source_, sink_) {

        this.sink = sink_;

        const baseUrl = AppSettings.baseHost.getValue();

        source_
            .mergeMap(file_ => {
                if( Array.isArray(file_) ){
                    for (var i = 0; i < file_.length; i++) {
                        var file = file_[i];
                        return this.uploadNextFile(baseUrl, file);
                    }
                }else {
                    return this.uploadNextFile(baseUrl, file_);
                }
            }, 3)
            .subscribe(console.debug);
    }


    uploadNextFile(baseUrl, file) {

        //console.log("file: " + file);

        if (file)//!file.path)
        {
            //console.log("else clause, upload");
            //debugger;
            return Observable
                .of(file)
                .flatMap(req => new Promise((resolve, reject) => {
                    return this.uploadFile(baseUrl, file)
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
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile(baseUrl, file_) {

        var filePathName = file_.uploadPath;
        if( file_.webkitRelativePath ){
            filePathName += "/" +file_.webkitRelativePath.substr(0, file_.webkitRelativePath.lastIndexOf("/"));
        }else if( file_.relativePath ){
            filePathName += file_.relativePath.substr(0, file_.relativePath.lastIndexOf("/"));
        }


        var formData = new FormData();
        formData.append("name", file_.name);
        formData.append("path", filePathName);
        formData.append("destination", filePathName);
        formData.append("file", file_);
        formData.append("type", file_.type);
        formData.append("size", file_.size);
        formData.append("jcr:primaryType", "nt:file");
        formData.append("dam:date.created", file_.lastModified);
        formData.append("dam:date.modified", file_.lastModified);



        //console.log("Upload to:" +baseUrl +filePathName );
        //console.dir(file_);

        return request
            .post(baseUrl +filePathName)
            .withCredentials()
            .charset('UTF-8')
            .send(formData)
            .parse(({ text }) => {
                if( text.length === 0 ) return {};
                return JSON.parse(text)
            })
            .on('progress', event => {
                //console.log(event);
                file_.progress = event.percent;
                FileActions.uploadProgress.next(file_);
                //the event is:
                //{direction: "upload" or "download"
                //  percent: 0 to 100 // may be missing if file size is unknown
                //  total: // total file size, may be missing
                //  loaded: // bytes downloaded or uploaded so far}
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
     * Check to see if the file is accessible to the embedded server, so we can do a quick copy. Instead of upload.
     * @param dir - passthrough for the next step in the sequence
     * @param path
     * @returns {HttpPromise}

    checkAccess(file_){

        const baseUrl = AppSettings.baseHost.getValue();

        return request
            .get(baseUrl +'/api/familydam/v1/files/upload/info')
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
    }*/


    /**
     * Tell the embedded server to copy a local file, by path.
     * @param dir
     * @param path

    copyLocalFile(baseUrl, file_) {

        if (!file_.recursive) {
            file_.recursive = true;
        }

        return request
            .post(baseUrl +'/api/familydam/v1/files/upload/copy')
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

    }*/



}


export default UploadFileService;
