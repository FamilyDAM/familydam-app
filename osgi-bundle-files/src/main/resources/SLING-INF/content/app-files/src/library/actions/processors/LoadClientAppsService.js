
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppActions from '../AppActions';
import AppSettings from '../AppSettings';
import request from 'superagent';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class LoadClientAppsService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.loadApps.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    loadApps(data_)
    {
        //var u = window.localStorage.getItem("u");
        //var p = window.localStorage.getItem("p");
        //.set('Authorization', 'user ' +u +":" +p)

        AppSettings.baseHost.subscribe( (baseUrl)=>{

            //call server get list of apps
            request.get(baseUrl +'/api/familydam/v1/core/clientapps')
                .withCredentials()
                .set('Accept', 'application/json')
                //.set('Authorization', 'Basic ' +btoa(u +":" +p))
                .end((err, res)=>{

                if( !err ){

                    //send results to the store
                    this.sink.next({
                        "primaryApps": res.body.apps.primary,
                        "secondaryApps": res.body.apps.secondary
                    });

                }else{

                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        AppActions.navigateTo.next("/");
                    } else if( err.status === 403) {
                        var _error403 = {'code': err.status,'message': "Invalid Login (todo: show toast)"};
                        this.sink.error(_error403);
                    }
                    else
                    {
                        console.dir(err);
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }

                }

            });

        });
    }

}


export default LoadClientAppsService;
