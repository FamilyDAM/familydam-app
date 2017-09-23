import {Subject, BehaviorSubject} from '@reactivex/rxjs';

import CreateUserService from './processors/CreateUserService';
import GetAllUsersService from './processors/GetAllUsersService';

class UserActions {

    constructor() {
        this.createUserService = new CreateUserService(this.createUser.source, this.createUser.sink);
        this.getAllUsersService = new GetAllUsersService(this.getAllUsers.source, this.getAllUsers.sink);
    }

    login = {'source':new Subject(), 'sink':new Subject()};
    logout = {'source':new Subject(), 'sink':new Subject()};
    createUser = {'source':new Subject(), 'sink':new Subject()};
    getAllUsers = {'source':new Subject(), 'sink':new BehaviorSubject()};
}

export default new UserActions();
