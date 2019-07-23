import {Subject} from '@reactivex/rxjs';

import LoginService from './processors/LoginService';
import CreateUserService from './processors/CreateUserService';
import GetUserService from './../library/actions/processors/GetUserService';
import GetAllUsersService from './../library/actions/processors/GetAllUsersService';

class AuthActions {

    constructor() {
        this.loginService = new LoginService(this.login.source, this.login.sink);
        this.createUserService = new CreateUserService(this.createUser.source, this.createUser.sink);
    }

    login = {'source':new Subject(), 'sink':new Subject()};
    createUser = {'source':new Subject(), 'sink':new Subject()};
}

export default new AuthActions();
