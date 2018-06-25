
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../../library/actions/AppActions';
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
        source_.subscribe(this.getUsers.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUsers(username_)
    {
        var u = window.localStorage.getItem("u");
        var p = window.localStorage.getItem("p");
        //.set('Authorization', 'user ' +u +":" +p)

        request
            .get('http://localhost:9000/api/familydam/v1/dashboard/user')
            .query({'username':username_})
            .withCredentials()
            .set('Accept', 'application/json')
            .set('Authorization', 'user ' +u +":" +p)
            .end((err, results) => {

                if( !err ){


                    var list = [];

                    for (var i = 0; i < results.body.length; i++) {
                        var item = results.body[i];

                        if (item.firstName === undefined) {
                            item.firstName = item.username;
                        }
                        list.push(item);
                        window.localStorage.setItem("user", JSON.stringify(item));
                    }


                    var _sortedUsers = list.sort(function (a, b) {
                        if (a.username > b.username) return 1;
                        if (a.username < b.username) return -1;
                        return 0;
                    });

                    this.sink.next(_sortedUsers);

                }else{
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


export default GetUsersService;
