import {Subject, BehaviorSubject} from '@reactivex/rxjs';

import LoadClientAppsService from './processors/LoadClientAppsService';

class AppActions {

    constructor() {
        this.loadClientAppsService = new LoadClientAppsService(this.loadClientApps.source, this.loadClientApps.sink);
    }

    logout = {'source':new Subject(), 'sink':new Subject()};

    //Use this to navigation around the app Or outside
    navigateTo = new Subject();

    //used to call reposity to get list of installed apps
    loadClientApps = {source:new Subject(), sink: new BehaviorSubject()};

}

export default new AppActions();
