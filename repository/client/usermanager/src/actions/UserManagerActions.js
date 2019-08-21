import {Subject} from '@reactivex/rxjs';

import SaveUserService from './processors/SaveUserService';

class UserManagerActions {

    constructor() {
        this.saveUserService = new SaveUserService(this.saveUser.source, this.saveUser.sink);
    }

    saveUser = {'source':new Subject(), 'sink':new Subject() };

}

export default new UserManagerActions();
