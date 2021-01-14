import {Subject} from '@reactivex/rxjs';
import LogoutService from "./processors/LogoutService";

class AppActions {

    constructor() {
        this.logoutService = new LogoutService(this.logout.source, this.logout.sink);
    }


    //Use this to navigation around the app Or outside
    navigateTo = new Subject();

    logout = {'source':new Subject(), 'sink':new Subject()};

}

export default new AppActions();
