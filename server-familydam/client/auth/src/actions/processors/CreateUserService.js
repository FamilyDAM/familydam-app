/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class CreateUserService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (data_) {
            this.createUser(data_);
        }.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    createUser(data_) {

        var _data = {};
        if( !data_.username ){
            data_.username = data_.userProps.firstName.toLowerCase();
        }
        _data.username = data_.username;

        var formData = new FormData();
        formData.append(":name", data_.username);
        formData.append("pwd", data_.password);
        formData.append("pwdConfirm", data_.password);
        formData.append("firstName", data_.userProps.firstName);
        formData.append("lastName", data_.userProps.lastName);
        formData.append("email", data_.userProps.email);
        formData.append("isFamilyAdmin", data_.isFamilyAdmin);


        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +'/api/v1/auth/user';

        fetch(_url, {
            method: "POST",
            body: formData
        })
            .then(response => {
                console.log("CreateeUser success handler");
                console.dir(response);
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }

                //continue on
                this.sink.next(true);
            })
            .catch(err => {
                console.warn(err);
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

export default CreateUserService;

