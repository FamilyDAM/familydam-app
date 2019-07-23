
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../../library/actions/AppSettings';

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var DirectoryActions = require('../../actions/DirectoryActions');


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{GetDirectories Service} subscribe");
        this.sink = DirectoryActions.getDirectories.sink;
        //DirectoryActions.getDirectories.source.distinctUntilChanged().subscribe(this.getDirectories.bind(this));
        DirectoryActions.getDirectories.source.subscribe(this.getDirectories.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getDirectories: function(path_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();

        //console.log("{GetDirectoryService} getDirectories()" );

        if( path_ !== undefined && path_.length > 0 )
        {

            var _url = baseUrl +path_;// + ".graph.4.json/dam:folder/name,path,index,parent,links,jcr:primaryType,jcr:created,jcr:mixinTypes";

            //console.dir(UserStore.token.value);

            request
                .get(_url)
                .withCredentials()
                .field('jcr:primaryType', 'sling:Folder')
                .set('Authorization', 'Basic ' +btoa(unescape(encodeURIComponent(user +":" +pwd))))
                .end((err, results) => {
                    if( !err ){

                        //console.log("{GetDirectoriesService} getDirectories() success" );
                        //Special filter to remove the dashboard app folder
                        var filteredChildren = [];
                        var children = data_._embedded.children;
                        if( children )
                        {
                            for (var i = 0; i < children.length; i++)
                            {
                                var child = children[i];
                                if (child.path != "/content/dashboard")
                                {
                                    filteredChildren.push(child);
                                }
                            }
                        }
                        data_._embedded.children = filteredChildren;

                        this.sink.onNext(data_);

                        // update token
                        var _token = xhr_.getResponseHeader("X-Auth-Token");
                        if (_token != null && _token !== undefined)
                        {
                            AuthActions.saveToken.onNext(_token);
                        }


                    } else {
                         //send the error to the store (through the sink observer
                         if (err.status === 401) {
                             AppActions.navigateTo.next("/");
                         } else if (err.status === 403) {
                             AppActions.alert.next("You do not have permission to access these files");
                         } else {
                             var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                             this.sink.error(_error);
                         }
                     }
                });


        }
    }

};

