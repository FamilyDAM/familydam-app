import {BehaviorSubject} from '@reactivex/rxjs';

class AppSettings {

    baseHost = new BehaviorSubject("");
}

export default new AppSettings();
