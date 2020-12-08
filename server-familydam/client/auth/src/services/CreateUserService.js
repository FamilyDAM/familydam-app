/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../library/actions/AppActions';
import AppSettings from '../library/actions/AppSettings';
import request from 'superagent';
import {Subject, BehaviorSubject} from "@reactivex/rxjs";

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class CreateUserService {

    isLoading=new BehaviorSubject(false);
    source=new Subject()
    sink=new Subject();

    constructor() {
        //console.log("{createUser Service} subscribe");
        this.source.subscribe(function (data_) {
            this.createUser(data_);
        }.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    createUser(data_) {

        //flip flag
        this.isLoading.next(true);

        const _data = {};

        const formData = new FormData();
        formData.append("name", data_.name);
        formData.append("lastName", data_.lastName);
        formData.append("password", data_.password);
        formData.append("pwdConfirm", data_.passwordConfirm);
        formData.append("email", data_.email);



        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +'/core/api/users';

        fetch(_url, {
            method: "POST",
            body: formData
        })
            .then(response => {
                //console.log("CreateUser success handler");
                //continue on
                this.isLoading.next(false);
                this.sink.next(true);
            })
            .catch(err => {
                console.warn(err);
                this.isLoading.next(false);

                //send the error to the store (through the sink observer
                if (err.status === 401) {
                    AppActions.navigateTo.next("/");
                }
                else if (err.status === 409) {
                    // User already exists
                    AppActions.alert.next("User already exists");
                }
                else if (err.status === 403) {
                    AppActions.alert.next("You do not have permission to add a new user");
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                    this.sink.error(_error);
                }
            });

    }

}

export default new CreateUserService();

