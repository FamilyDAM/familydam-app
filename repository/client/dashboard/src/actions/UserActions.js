import {Subject, BehaviorSubject} from '@reactivex/rxjs';

import LoginService from './processors/LoginService';
import CreateUserService from './processors/CreateUserService';
import GetUserService from './../library/actions/processors/GetUserService';
import GetAllUsersService from './../library/actions/processors/GetAllUsersService';

class UserActions {

    constructor() {
        this.loginService = new LoginService(this.login.source, this.login.sink, this.getUser.source);
        //todo: call processor for logout
        // [GET] /system/sling/logout
        this.createUserService = new CreateUserService(this.createUser.source, this.createUser.sink);
        this.getUserService = new GetUserService(this.getUser.source, this.getUser.sink);
        this.getAllUsersService = new GetAllUsersService(this.getAllUsers.source, this.getAllUsers.sink);
    }

    login = {'source':new Subject(), 'sink':new Subject()};
    createUser = {'source':new Subject(), 'sink':new Subject()};
    getUser = {'source':new Subject(), 'sink':new BehaviorSubject( JSON.parse(window.localStorage.getItem("user")) )};
    getAllUsers = {'source':new Subject(), 'sink':new BehaviorSubject()};
}

export default new UserActions();
