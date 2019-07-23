
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';
import UserActions from "../AuthActions";


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class LoginService {

    sink=undefined;

    constructor(source_, sink_) {
        this.sink = sink_;
        source_.subscribe(this.login.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    login(data_)
    {
        //console.log("{Login Service} login(" +data_.username +"," +data_.password +")");
        const baseUrl = AppSettings.baseHost.getValue();
        //const user = AppSettings.basicUser.getValue();
        //const pwd = AppSettings.basicPwd.getValue();

        //var _salt = new Date().getTime();
        var _url = baseUrl +'/login';

        let formData = new FormData();
        formData.append('username', data_.username);
        formData.append('password', data_.password);

        fetch(_url, {
            method: "POST",
            body: formData
        })
            .then(response => {
                console.log("login success handler");
                console.dir(response);
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
            })
            .catch(e => {
                console.warn(e);
                window.location = "/";
            });

    }

}


export default LoginService;
