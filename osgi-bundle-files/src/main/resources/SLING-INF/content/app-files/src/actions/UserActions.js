import {Subject, BehaviorSubject} from '@reactivex/rxjs';

import GetUserService from './processors/GetUserService';

class UserActions {

    constructor() {
        this.getUserService = new GetUserService(this.getUser.source, this.getUser.sink);
    }

    getUser = {'source':new Subject(), 'sink':new BehaviorSubject( JSON.parse(window.localStorage.getItem("user")) )};
}

export default new UserActions();
