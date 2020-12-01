import {Subject} from '@reactivex/rxjs';

import LoadClientAppsService from './processors/LoadClientAppsService';
import LogoutService from "./processors/LogoutService";

class AppActions {

    constructor() {
        this.loadClientAppsService = new LoadClientAppsService(this.loadClientApps.source, this.loadClientApps.sink);
        this.logoutService = new LogoutService(this.logout.source, this.logout.sink);
    }


    //Use this to navigation around the app Or outside
    navigateTo = new Subject();

    logout = {'source':new Subject(), 'sink':new Subject()};

    //used to call repository to get list of installed apps
    loadClientApps = {source:new Subject(), sink: new Subject()};

}

export default new AppActions();
