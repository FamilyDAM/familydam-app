/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


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
        this.source.subscribe(function (props_) {
            this.uploadFile(props_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async uploadFile(props_)
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
