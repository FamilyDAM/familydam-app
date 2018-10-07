/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {AppActions, AppSettings} from '@FamilyDAM/lib-client';
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

        var _props = {
            ':name': data_.username,
            'pwd': data_.password,
            'pwdConfirm': data_.password,
            'firstName': data_.userProps.firstName,
            'lastName': data_.userProps.lastName,
            'email': data_.userProps.email,
            'isFamilyAdmin': data_.isFamilyAdmin
        };


        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();


        request
            .post( baseUrl +'/api/familydam/v1/dashboard/user/create')
            .send(_props)
            .withCredentials()
            .set('Accept', 'application/json')
            .set('Authorization', 'user ' +user +":" +pwd)
            .end((err, res)=>{

                if( !err ){
                    this.sink.next(true);
                }else{
                    //send the error to the store (through the sink observer
                    if (err.status === 401)
                    {
                        AppActions.navigateTo.next("/");
                    }
                    else if (err.status === 409)
                    {
                        // User already exists
                        AppActions.alert.next("User already exists");
                    }
                    else if (err.status === 403)
                    {
                        AppActions.alert.next("You do not have permission to add a new user");
                    }
                    else
                    {
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }
                }
            });



    }

}

export default CreateUserService;

