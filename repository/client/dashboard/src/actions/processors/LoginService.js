
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';
import UserActions from "../UserActions";


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class LoginService {

    sink=undefined;

    constructor(source_, sink_, getUserSource_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        this.getUserSource = getUserSource_;
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
        var _url = baseUrl +'/j_security_check?';


        request
            .post(_url)
            .type("form")
            .send('j_username=' +data_.username)
            .send('j_password=' +data_.password)
            .send('j_validate=true')
            .send('form.auth.timeout:120')
            .send('form.onexpire.login:true')
            .end((err, results) => {
                if( !err ){
                    console.log("LoginService Security Check: SUCCESS");
                    window.localStorage.setItem("user", JSON.stringify(data_));
                    UserActions.getUser.source.next(data_.username);

                    AppSettings.basicUser.next(data_.username);
                    AppSettings.basicPwd.next(data_.password);
                    window.localStorage.setItem("u", data_.username);
                    window.localStorage.setItem("p", data_.password);

                    //send results to the store
                    //this.sink.next(_sortedUsers);

                }else{

                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        AppActions.navigateTo.next("/");
                    } else if( err.status === 403) {
                        var _error403 = {'code': err.status,'message': "Invalid Login (todo: show toast)"};
                        this.sink.error(_error403);
                    }
                    else
                    {
                        console.dir(err);
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }

                }
            });

    }

}


export default LoginService;
