
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
//import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class ListPhotosService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.listPhotos.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    listPhotos(args_)
    {
        //pull out arguments
        const path_ = args_.path;
        const groupBy_ = args_.groupBy || 'date:day';

        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();

        var _dir = baseUrl +"/content/family/files.image.json";

        request
            .post(_dir)
            .withCredentials()
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' +btoa(unescape(encodeURIComponent(user +":" +pwd))))
            .send({"paths": [path_], "limit":100, "offset":0, "group":groupBy_, "order":{"field":"dam:datecreated", "direction":"desc"}})
            .end((err, results) => {

                if( !err ){

                    console.log("ListUserService: SUCCESS");
                    console.dir(results);


                    /**
                     * Update the properties required for the React Photo Gallery Component
                     */
                    for (const group of results.body) {
                        for (const child of group.children) {
                            child.thumbnail = AppSettings.baseHost.getValue() +child.path;
                            child.thumbnailWidth = child.width;
                            child.thumbnailHeight = child.height;
                            child.src = AppSettings.baseHost.getValue() +child.path;
                        }
                    }

                    //Cache for later, if we need it
                    //window.localStorage.setItem("photos", JSON.stringify(results));

                    this.sink.next(results);

                }else{
                    debugger;
                    console.log("ListUserService: ERROR");
                    console.dir(err);


                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        //AppActions.navigateTo.next("/");
                    } else {
                        //var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        //this.sink.error(_error);
                    }
                }
            });

    }

}


export default ListPhotosService;
