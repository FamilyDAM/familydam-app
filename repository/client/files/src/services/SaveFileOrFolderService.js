/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class SaveFileOrFolderService {

    sink = new Subject();
    source = new Subject();
    isLoading = new BehaviorSubject();

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.source.subscribe(function (n) {
            this.execute(n);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async execute(node_)
    {
        const baseUrl = AppSettings.baseHost.getValue() || "";

        var _name = node_.name ;
        var _url = baseUrl +node_.path;

        try {
            const req = await fetch(_url, {
                method: "PUT",
                body: JSON.stringify(node_),
                credentials: "include"
            });


            if (req.status == 200) {
                this.isLoading.next(false);
            } else {
                throw new Error("Unknown Error");//todo, send better error
            }
        } catch(err){
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
            this.isLoading.next(false);
        }

    }

}


export default new SaveFileOrFolderService();
