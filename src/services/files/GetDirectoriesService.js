
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

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
        console.log("{GetDirectories Service} subscribe");
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
        console.log("{GetDirectoryService} getDirectories()" );

        if( path_ !== undefined && path_.length > 0 )
        {

            var _url = path_ + ".graph.-1.json/nt:folder,sling:Folder/name,path,index,parent,links,jcr:primaryType,jcr:created,jcr:mixinTypes";

            //console.dir(UserStore.token.value);

            return $.ajax({
                method: "get",
                url: _url,
                data: {'path': path_},
                'xhrFields': {
                    withCredentials: true
                }
            }).then(function (data_, status_, xhr_) {

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
                    UserActions.saveToken.onNext(_token);
                }

            }.bind(this), function (xhr_, status_, errorThrown_) {

                //send the error to the store (through the sink observer
                if (xhr_.status == 401)
                {
                    AuthActions.loginRedirect.onNext(true);
                } else
                {
                    var _error = {'code': xhr_.status, 'status': xhr_.statusText, 'message': xhr_.responseText};
                    this.sink.onError(_error);
                }
            }.bind(this));

        }
    }

};

