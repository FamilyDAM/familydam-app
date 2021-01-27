/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class UpdateUserService {

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

        var formData = new FormData();
        formData.append(":name", props_.name);
        formData.append("firstName", props_.firstName);
        formData.append("lastName", props_.lastName);
        formData.append("isFamilyAdmin", props_.isFamilyAdmin);

        if( props_.password ) formData.append("password", props_.password);
        if( props_.passwordConfirm ) formData.append("passwordConfirm", props_.passwordConfirm);

        if( props_.newPassword ) formData.append("password", props_.newPassword);
        if( props_.newPasswordConfirm ) formData.append("passwordConfirm", props_.newPasswordConfirm);


        try {
            const req = await fetch(_url, {
                method: "POST",
                body: formData,
                credentials: "include"
            });


            if (req.status == 200) {
                const user = await req.json();
                this.sink.next(user);
                this.isLoading.next(false);
            } else {
                throw new Error("Unexpected Code: '" +req.status +"'");//todo, send better error
            }

        } catch(err){
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
            this.isLoading.next(false);
        }


    }

}


export default new UpdateUserService();
