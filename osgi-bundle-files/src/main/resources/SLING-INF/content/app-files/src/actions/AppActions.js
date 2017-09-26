import {Subject} from '@reactivex/rxjs';

class AppActions {

    navigateTo = new Subject();

}

export default new AppActions();
