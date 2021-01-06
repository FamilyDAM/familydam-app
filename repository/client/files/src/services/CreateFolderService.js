/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

import AppSettings from '../library/actions/AppSettings';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class CreateFolderService {

    sink = new Subject();
    source = new Subject();
    isLoading = new BehaviorSubject();

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.source.subscribe(function (props_) {
            this.createDirectory(props_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async createDirectory(props_)
    {
        const baseUrl = AppSettings.baseHost.getValue();

        var _name = data_.name ;
        var _url = baseUrl +data_.path +"/" +_name;

        var formData = new FormData();
        formData.append("name", data_.username);
        formData.append("contentType", "application/folder");

        const req = await fetch(_url, {
            method: "POST",
            body: formData
        });

        const response = await req.json();

        if( apps.status == 200 ) {
            this.sink.next(response);
            this.isLoading.next(false);
        }else{
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
            this.isLoading.next(false);
        }

        /**
            .then(response => {
                console.info("CreateFolder success handler");
                if(response.redirected) {
                    console.debug("redirect to: " +response.url);
                    window.location = response.url
                }
                //continue on
                this.sink.next(true);
            })
            .then((response) => response.json())
            .then(json => {
                if (!json.firstName) {
                    json.firstName = json.username;
                }
                this.sink.next(json);
            })
            .catch(err => {
                console.warn(err);
                //send the error to the store (through the sink observer
                if (err.status === 401) {
                    AppActions.navigateTo.next("/");
                }
                else if (err.status === 403) {
                    AppActions.alert.next("You do not have permission to add a new user");
                } else {
                    console.error(err);
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                    this.sink.error(_error);
                }
            });
         **/


        /**
        return $.ajax({
                    method: "post",
                    url: _dir,
                    data: {':name':_name, 'jcr:mixins':'dam:folder'},
                    'xhrFields': {
                        withCredentials: true
                    }
                }).then(function(data_, status_, xhr_){
                    _this.sink.onNext(data_);
                    // refresh the overall directories list
                    DirectoryActions.refreshDirectories.onNext(true);
                    FileActions.refreshFiles.onNext(true);

                    // update token
                    var _token = xhr_.getResponseHeader("X-Auth-Token");
                    if( _token != null && _token !== undefined ){
                        AuthActions.saveToken.onNext(_token);
                    }

                }, function (xhr_, status_, errorThrown_){

                    //send the error to the store (through the sink observer
                    if( xhr_.status == 401){
                        AuthActions.loginRedirect.onNext(true);
                    }else
                    {
                        UserActions.alert.onNext("Error creating folder, you might now have permission");
                        //var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                        //_this.sink.onError(_error);
                    }
                });
         **/


    }

}


export default new CreateFolderService();
