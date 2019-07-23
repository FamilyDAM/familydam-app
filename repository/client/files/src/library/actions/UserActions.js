import {Subject, BehaviorSubject} from '@reactivex/rxjs';

import GetUserService from './processors/GetUserService';
import GetAllUsersService from './processors/GetAllUsersService';

class UserActions {

    constructor() {
        this.getUserService = new GetUserService(this.getUser.source, this.getUser.sink);
        this.getAllUsersService = new GetAllUsersService(this.getAllUsers.source, this.getAllUsers.sink);
    }

    getUser = {'source':new Subject(), 'sink':new Subject() };
    getAllUsers = {'source':new Subject(), 'sink':new Subject(  )};

}

export default new UserActions();
