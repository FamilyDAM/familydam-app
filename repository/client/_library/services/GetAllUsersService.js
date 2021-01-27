/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../actions/AppSettings';
import {Subject, BehaviorSubject} from "@reactivex/rxjs";

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetAllUsersService {

    isLoading = new BehaviorSubject(true);
    source = new Subject();
    sink = new Subject();


    constructor() {
        //console.log("{GetUsers Service} subscribe");
        this.source.subscribe(this.getUsers.bind(this));

        //refresh the list after any user data is saved
        //saveUserSink_.subscribe(this.getUsers.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    async getUsers()
    {
        const baseUrl = AppSettings.baseHost.getValue() || "";
        const _url = baseUrl +'/api/v1/auth/users';

        const headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');

        this.isLoading.next(true);

        //Save or Create user
        const users = await fetch( _url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers,
            credentials: "include"
        })
        //parse json
        .then(async (response) => response.json())
        .then( (users) => {
            var list = [];
            if( users && users._embedded ) {
                for (var i = 0; i < users._embedded.users.length; i++) {
                    var item = users._embedded.users[i];
                    list.push(item);
                }
            }
            //sort by username (friendly first name0
            var _sortedUsers = list.sort(function (a, b) {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            });

            return _sortedUsers;
        })
        .then( (users) => {
            //flip flag
            this.isLoading.next(false);
            return users;
        })
        .catch(err => {
            //send the error to the store (through the sink observer
            if( err.status === 401 || err.status === 403){
                window.location = "/";
            } else {
                var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText||err.message};
                console.warn(_error);
                //this.sink.error(_error);
                //reload
                setTimeout(()=>{
                    this.source.next(true);
                }, 500);

            }
        });

        if( users ) {
            this.sink.next(users);
        }
    }

}


export default new GetAllUsersService();
