
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../../library/actions/AppSettings';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class SaveUserService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.getUser.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUser(user_)
    {
        const baseUrl = AppSettings.baseHost.getValue();

        const formData = new FormData();
        Object.keys(user_)
                .filter(key=> key != "pwdConfirm")
                .forEach(key => formData.append(key, user_[key]));

        //Create system name prop, from first name and last name
        formData.append(":name", user_['firstName']);
        formData.append("isFamilyAdmin", true);

        var _url = baseUrl +'/api/v1/auth/user';

        if( user_ && user_.id ){
            _url = baseUrl +'/api/v1/auth/user/' +user_.id;
        }

        //Save or Create user
        fetch( _url, {
            method: 'POST',
            body: formData
        })
            //check for redirect
            .then(response => {
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            //parse json
            .then((response) => response.json())
            .then( (json) => this.sink.next(json))
            .catch(err => {
                //send the error to the store (through the sink observer
                if( err.status === 401 || err.status === 403){
                    window.location = "/";
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText||err.message};
                    this.sink.error(_error);
                }
            });


    }

}


export default SaveUserService;
