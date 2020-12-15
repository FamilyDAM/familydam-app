
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../AppSettings';
import {BehaviorSubject, Subject} from "@reactivex/rxjs";


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetUsersService {

    isLoading=new BehaviorSubject(false); //todo, wire up
    source = new Subject();
    sink = new Subject();


    constructor() {
        //console.log("{GetUsers Service} subscribe");
        this.source.subscribe(this.getUser.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUser(username_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +'/core/api/users/' +username_;

        const headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');

        this.isLoading.next(true);

        fetch( _url, {
            method: 'GET',
            mode: 'no-cors',
            cache: "no-cache",
            headers: headers,
            credentials: "include"
        })
            //check for redirect
            .then(response => {
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            //parse json
            .then((response) => response.json())
            .then(json => {
                this.sink.next(json);
            })
            .catch(err => {
                //send the error to the store (through the sink observer
                if( err.status === 401 || err.status === 403){
                    window.location = "/";
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText||err.message};
                    this.sink.error(_error);
                }
            });

    }

}


export default new GetUsersService();
