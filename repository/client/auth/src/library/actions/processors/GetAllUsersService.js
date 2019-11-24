/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import UserActions from '../UserActions';
import AppSettings from '../../../library/actions/AppSettings';

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetAllUsersService {

    sink=undefined;

    constructor(source_, sink_, saveUserSink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.getUsers.bind(this));

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
        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +'/api/v1/auth/users';

        const headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');


        //Save or Create user
        const users = await fetch( _url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers
        })
        //parse json
        .then((response) => response.json())
        .then( (users) => {
            var list = [];
            for (var i = 0; i < users.length; i++) {
                var item = users[i];
                if (item.firstName === undefined) {
                    item.firstName = item.username;
                }
                list.push(item);
            }
            //sort by username (friendly first name0
            var _sortedUsers = list.sort(function (a, b) {
                if (a.username > b.username) return 1;
                if (a.username < b.username) return -1;
                return 0;
            });

            return _sortedUsers;
        })
        .catch(err => {
            //send the error to the store (through the sink observer
            if( err.status === 401 || err.status === 403){
                window.location = "/";
            } else {
                var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText||err.message};
                this.sink.error(_error);
                //reload
                UserActions.getAllUsers.source.next(true);
            }
        });

        if( users ) {
            this.sink.next(users);
        }
    }

}


export default GetAllUsersService;
