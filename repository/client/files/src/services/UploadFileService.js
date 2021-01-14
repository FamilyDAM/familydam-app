/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject, BehaviorSubject, Observable} from '@reactivex/rxjs';
import { mergeMap } from 'rxjs/operators';
import request from "superagent";
import FileActions from "../actions/FileActions";

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class UploadFileService {

    sink = new Subject();
    source = new Subject();
    isLoading = new BehaviorSubject();

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.source.pipe(mergeMap(file_ => {
            if( Array.isArray(file_) ){
                for (var i = 0; i < file_.length; i++) {
                    var file = file_[i];
                    return this.uploadNextFile(file_);
                }
            }else {
                return this.uploadNextFile(file_);
            }
        }, 3)).subscribe(console.debug);
    }



    uploadNextFile(props_) {

        //console.log("file: " + file);

        if (props_.file)//!file.path)
        {
            //console.log("else clause, upload");
            //debugger;
            return Observable
                .of(props_)
                .flatMap(req => new Promise((resolve, reject) => {
                    return this.uploadFile(props_)
                        .then(result=>resolve(result))
                        .catch(err => {
                            //debugger;
                            let retry = 1;
                            if( props_.retry ){
                                retry=props_.retry+1;
                            }
                            props_.progress = 0;
                            props_.retry = retry;
                            props_.errorMsg = "Retrying request (" +retry +"/3)";
                            return reject(err);
                        });
                })).retry(2).catch(err => {
                    //debugger;
                    //var _error = {'code': err.status, 'message': err.message};
                    props_.errorMsg = err.status +": " +err.message;
                    props_.progress = 0;
                    return Observable.of(err);
                });

        }

        return null;
    }



    /**
     * The server can't access the file locally, or we are in a browser.
     * So this method will do a regular AJAX file upload
     * @param dir
     * @param path
     */
    uploadFile(props_) {

        var filePathName = props_.path;
        if( props_.file.webkitRelativePath ){
            filePathName = props_.file.webkitRelativePath;
        }else if( props_.file.relativePath ){
            filePathName += props_.file.relativePath.substr(0, props_.file.relativePath.lastIndexOf("/"));
        }


        var formData = new FormData();
        formData.append("name", props_.file.name);
        formData.append("path", filePathName);
        formData.append("destination", filePathName);
        formData.append("file", props_.file);
        formData.append("type", props_.file.type);
        formData.append("size", props_.file.size);
        formData.append("jcr:primaryType", "nt:file");
        formData.append("dam:date.created", props_.file.lastModified);
        formData.append("dam:date.modified", props_.file.lastModified);



        console.log("Upload to:" +baseUrl +filePathName );
        //console.dir(file_);
        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +props_.path

        return request
            .post(_url)
            .withCredentials()
            .charset('UTF-8')
            .send(formData)
            .parse(({ text }) => {
                if( props_.onSuccess ) props_.onSuccess(null, props_.file);
            })
            .on('progress', event => {
                //console.log(event);
                props_.progress = event.percent;
                if( props_.onProgress ) props_.onProgress({ percent: event.percent });

                //the event is:
                //{direction: "upload" or "download"
                //  percent: 0 to 100 // may be missing if file size is unknown
                //  total: // total file size, may be missing
                //  loaded: // bytes downloaded or uploaded so far}
            });

    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async execute(props_)
    {
        const baseUrl = AppSettings.baseHost.getValue();

        const _name = props_.file.name ;
        const _url = baseUrl +props_.path;


        const contentType = props_.file.type;
        let relativePath = "/";
        if( props_.file.webkitRelativePath ) {
            relativePath = props_.file.webkitRelativePath;
        }



        var formData = new FormData();
        formData.append("name", _name);
        formData.append("path", props_.path);
        formData.append("destination", relativePath);
        formData.append("file", props_.file);
        formData.append("type", props_.file.type);
        formData.append("size", props_.file.size);
        formData.append("jcr:primaryType", "nt:file");
        formData.append("dam:date.created", props_.file.lastModified);
        formData.append("dam:date.modified", props_.file.lastModified);



        try {
            const response = await fetch(_url, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const reader = response.body.getReader();
            let bytesReceived = 0;
            while (true) {
                const result = await reader.read();
                if (result.done) {
                    console.log('Fetch complete');
                    if( props_.onSuccess ) props_.onSuccess(null, props_.file);
                    this.isLoading.next(false);
                    break;
                }
                //todo, change ajax library. This is not supported by fetch()
                bytesReceived += result.value.length;
                console.log('Received', bytesReceived, '/', props_.file.size, 'bytes of data so far | ', props_.file.name);
                if( props_.onProgress ) props_.onProgress({ percent: (bytesReceived / props_.file.size) * 100 });
            }
        }catch(err){
            if(props_.onError) props_.onError(err);
            console.dir(err);
            const _error = {'code': err.status, 'status': err.statusText, 'error':err.message};
            this.sink.error(_error);
            this.isLoading.next(false);
        }


    }

}


export default new UploadFileService();
