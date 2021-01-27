import {Subject} from '@reactivex/rxjs';

class AppActions {

    //Use this to navigation around the app Or outside
    navigateTo = new Subject();

    //todo delete
    logout = {'source':new Subject(), 'sink':new Subject()};

}

export default new AppActions();
