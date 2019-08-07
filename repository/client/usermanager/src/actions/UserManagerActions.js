import {Subject} from '@reactivex/rxjs';

import SaveUserService from './processors/SaveUserService';
import CreateUserService from './processors/CreateUserService';

class UserManagerActions {

    constructor() {
        this.saveUserService = new SaveUserService(this.saveUser.source, this.saveUser.sink);
        this.createUserService = new CreateUserService(this.createUser.source, this.createUser.sink);
    }

    saveUser = {'source':new Subject(), 'sink':new Subject() };
    createUser = {'source':new Subject(), 'sink':new Subject(  )};

}

export default new UserManagerActions();
