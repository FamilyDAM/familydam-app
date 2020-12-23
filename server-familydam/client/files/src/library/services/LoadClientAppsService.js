
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from "../actions/AppSettings";
import {BehaviorSubject, Subject} from "@reactivex/rxjs";


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class LoadClientAppsService {

    isLoading=new BehaviorSubject(false);
    source=new Subject();
    sink=new Subject();


    constructor() {
        //console.log("{GetUsers Service} subscribe");
        this.source.subscribe(this.loadApps.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    async loadApps(data_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        const _url = baseUrl +'/core/api/apps';

        const headers = new Headers();
        headers.append('Accept', 'application/json');

        this.isLoading.next(true);

        //Save or Create user
        const apps = await fetch( _url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers,
            credentials: 'include'
        });

        const response = await apps.json();
        if( apps.status == 200 && response._embedded.applications ){
            const primaryApps = [];
            const secondaryApps = [];
            response._embedded.applications.forEach( (app)=>{
                if( app.isPrimaryApp ){
                    primaryApps.push(app);
                    return;
                }
                secondaryApps.push(app);
            });
            this.sink.next({"primaryApps":primaryApps, "secondaryApps":secondaryApps});
        }else{
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
        }

    }

}


export default new LoadClientAppsService();
