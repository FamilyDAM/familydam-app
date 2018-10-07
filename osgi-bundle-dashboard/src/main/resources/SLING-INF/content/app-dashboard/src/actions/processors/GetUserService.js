
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {AppActions, AppSettings} from '@FamilyDAM/lib-client';
import request from 'superagent';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetAllUsersService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.getUsers.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUsers(username_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();

        request
            .get(baseUrl +'/api/familydam/v1/dashboard/user')
            .query({'username':username_})
            .withCredentials()
            .set('Accept', 'application/json')
            .set('Authorization', 'user ' +user +":" +pwd)
            .end((err, results) => {

                if( !err ){

                    console.log("getUserService: SUCCESS");
                    console.dir(results);


                    var item = results.body;

                    if (item.firstName === undefined) {
                        item.firstName = item.username;
                    }

                    window.localStorage.setItem("user", JSON.stringify(item));
                    this.sink.next(item);

                }else{

                    console.log("getUserService: ERROR");
                    console.dir(err);


                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        AppActions.navigateTo.next("/");
                    } else {
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }
                }
            });

    }

}


export default GetAllUsersService;
