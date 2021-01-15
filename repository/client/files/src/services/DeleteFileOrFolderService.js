/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


/**
 * Since most logic needs to invoke this service and wait for results, this class
 * does not use RX sink/source for an async process. Instead code will invoke execute() method
 * directly, using await command.
 *
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class DeleteFileOrFolderService {

    isLoading = new BehaviorSubject();

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async execute(path_)
    {
        const baseUrl = AppSettings.baseHost.getValue() || "";

        var _url = baseUrl +path_;
    ;

        try {
            this.isLoading.next(true);

            const req = await fetch(_url, {
                method: "DELETE",
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


export default new DeleteFileOrFolderService();
