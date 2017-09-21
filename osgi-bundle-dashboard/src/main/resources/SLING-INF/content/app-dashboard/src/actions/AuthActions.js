import {Subject} from '@reactivex/rxjs';

class AuthActions {

    login = {'source':new Subject(), 'sink':new Subject()}

}

export default new AuthActions();
