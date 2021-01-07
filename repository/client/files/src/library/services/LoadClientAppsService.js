
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
        const _url = baseUrl +'/api/v1/apps/'; //+'/core/api/apps';

        const headers = new Headers();
        headers.append('Accept', 'application/hal+json');

        this.isLoading.next(true);

        //Save or Create user
        const apps = await fetch( _url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers,
            credentials: 'include'
        });

        const response = await apps.json();
        if( apps.status == 200 && response._embedded && response._embedded.apps ){
            const primaryApps = [];
            const secondaryApps = [];
            response._embedded.apps.forEach( (app)=>{
                if( app.primary ){
                    primaryApps.push(app);
                    return;
                }
                secondaryApps.push(app);
            });

            var _primaryApps = primaryApps.sort((a,b)=>a.order - b.order)
            var _secondaryApps = secondaryApps.sort((a,b)=>a.order - b.order)
            this.sink.next({"primaryApps":_primaryApps, "secondaryApps":_secondaryApps});
        }

    }

}


export default new LoadClientAppsService();
