import {BehaviorSubject} from '@reactivex/rxjs';

class AppSettings {

    baseHost = new BehaviorSubject("http://localhost:9000");
    basicUser = new BehaviorSubject(window.localStorage.getItem("u"));
    basicPwd = new BehaviorSubject(window.localStorage.getItem("p"));

}

export default new AppSettings();
