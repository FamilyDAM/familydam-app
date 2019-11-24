
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../../library/actions/AppSettings';
import AppActions from "../../library/actions/AppActions";


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
        //const user = AppSettings.basicUser.getValue();
        //const pwd = AppSettings.basicPwd.getValue();

        var _url = baseUrl +"/search";

        var formData = new FormData();
        formData.append("path", path_);
        formData.append("type", "dam:image");
        formData.append("limit", 10000);
        formData.append("offset", 0);
        formData.append("group", groupBy_);
        formData.append("order.field", "dam:date.created");
        formData.append("order.direction", "desc");



        fetch( _url, {
            "method":"post",
            body: formData
        })
            .then(response => {
                console.log("Image Search Success handler");
                console.dir(response);
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            .then((response) => response.json())
            .then(json => {
                //Update the properties required for the React Photo Gallery Component
                for (const node of json) {
                    node.src = node._links.self;
                    node.isSelected = false;
                    node.thumbnail = node._links.thumb;
                    node.thumbnailWidth = node.width;
                    node.thumbnailHeight = node.height;
                }
                this.sink.next(json);
            })
            .catch(err => {
                console.warn(err);
                //send the error to the store (through the sink observer
                if (err.status === 401) {
                    AppActions.navigateTo.next("/");
                }
                else if (err.status === 409) {
                    // User already exists
                    AppActions.alert.next("User already exists");
                }
                else if (err.status === 403) {
                    AppActions.alert.next("You do not have permission to add a new user");
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                    this.sink.error(_error);
                }
            });
    }

}


export default ListPhotosService;
