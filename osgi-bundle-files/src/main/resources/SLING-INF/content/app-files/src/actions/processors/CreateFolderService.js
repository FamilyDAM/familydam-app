
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import request from 'superagent';
import AppActions from "../AppActions";

/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class CreateFolderService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.createDirectory.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    createDirectory(data_)
    {
        var _name = data_.name ;
        var _dir = data_.path +"/" +_name;

        var u = window.localStorage.getItem("u");
        var p = window.localStorage.getItem("p");
        //.set('Authorization', 'user ' +u +":" +p)

        request
            .post(_dir)
            .withCredentials()
            .field('jcr:primaryType', 'sling:Folder')
            .set('Authorization', 'user ' +u +":" +p)
            .end((err, results) => {
                if (!err) {

                    this.sink.next(results);

                }else{
                    console.log(err);
                    //send the error to the store (through the sink observer
                    //send the error to the store (through the sink observer
                    if( err.status === 401){
                        AppActions.navigateTo.next("/");
                    } else {
                        var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                        this.sink.error(_error);
                    }
                }
            });



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


export default CreateFolderService;
