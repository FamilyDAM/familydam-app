
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../../../library/actions/AppActions';
import AppSettings from '../../../library/actions/AppSettings';
import request from 'superagent';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetUsersService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.getUser.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUser(username_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        //const user = AppSettings.basicUser.getValue();
        //const pwd = AppSettings.basicPwd.getValue();

        fetch( baseUrl +'/api/v1/auth/user/me', {
            method: 'GET'
        })
            //check for redirect
            .then(response => {
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            //debug
            .then(response => {
                console.log("getUserService: SUCCESS");
                console.dir(response);
                return response;
            })
            //parse json
            .then((response) => response.json())
            .then(json => {
                console.log("JSON");
                console.log(json);
                return json;
            })
            .then(json => {
                if (!json.firstName) {
                    json.firstName = json.username;
                }
                this.sink.next(json);
            })
            .catch(err => {
                //send the error to the store (through the sink observer
                if( err.status === 401 || err.status === 403){
                    window.location = "/";
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                    this.sink.error(_error);
                }
            });




    }

}


export default GetUsersService;
