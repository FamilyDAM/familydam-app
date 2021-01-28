/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class DeleteUserService {

    sink = new Subject();
    source = new Subject();
    isLoading = new BehaviorSubject();

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.source.subscribe(function (props_) {
            this.execute(props_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async execute(props_)
    {
        const baseUrl = AppSettings.baseHost.getValue() || "";

        var _name = props_.name ;
        var _url = baseUrl +"/api/v1/auth/user/" +props_.name;

        try {
            const req = await fetch(_url, {
                method: "DELETE",
                credentials: "include"
            });


            if (req.status == 200) {
                this.sink.next(true);
                this.isLoading.next(false);
            } else {
                this.sink.error(`(${req.status}) Error deleting user`);
            }

        } catch(err){
            //console.dir(err);
            this.sink.error(`Unknown error deleting user`);
            this.isLoading.next(false);
        }


    }

}


export default new DeleteUserService();
