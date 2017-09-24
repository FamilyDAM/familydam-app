
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../AppActions';
import request from 'superagent';


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
        //var _salt = new Date().getTime();
        var _url = 'http://localhost:9000/j_security_check?';
        //var _data = {'j_username':data_.username, 'j_password':data_.password, 'j_validate':'true', 'form.auth.timeout':120, 'form.onexpire.login':true};


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

                    window.localStorage.setItem("user", JSON.stringify(data_));
                    this.getUserSource.next(data_.username);
                    //send results to the store
                    //_this.sink.onNext(data_);

                    //this.sink.next(_sortedUsers);

                }else{

                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        AppActions.navigateTo.next("/");
                    }else
                    {
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }

                }
            });

    }

}


export default LoginService;
