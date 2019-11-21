
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import AppSettings from '../../library/actions/AppSettings';
import AppActions from "../../library/actions/AppActions";


/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class ListFoldersService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{GetUsers Service} subscribe");
        this.sink = sink_;
        source_.subscribe(this.listResults.bind(this));
    }

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    listResults(args_)
    {
        //pull out arguments
        const path_ = args_.path;
        const groupBy_ = args_.groupBy || 'path';

        const baseUrl = AppSettings.baseHost.getValue();
        //const user = AppSettings.basicUser.getValue();
        //const pwd = AppSettings.basicPwd.getValue();

        var _url = baseUrl +"/search";

        var formData = new FormData();
        formData.append("path", path_);
        formData.append("type", "nt:folder");
        formData.append("limit", 100);
        formData.append("offset", 0);
        formData.append("group", groupBy_);
        formData.append("order.field", "name");
        formData.append("order.direction", "asc");


        debugger;
        fetch( _url, {
            "method":"post",
            body: formData
        })
            .then(response => {
                console.log("Folder Search Success handler");
                console.dir(response);
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            .then((response) => response.json())
            .then(json => {
                //Build a nested tree of nodes
                var nodes = {};
                nodes[path_] = {};
                nodes[path_].children = [];
                nodes[path_].name = "Family"; //todo: localize
                nodes[path_].path = path_;

                for (const node of json) {
                    const _parent = node.path.substr(0, node.path.lastIndexOf('/'));
                    nodes[node.path] = node;
                    nodes[node.path].parent = _parent;

                    if( nodes[_parent] ){
                        if( !nodes[_parent].children ) nodes[_parent].children = [];
                        nodes[_parent].children.push(nodes[node.path]);
                    }
                }


                nodes[path_].children = nodes[path_].children.sort(function (a, b) {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                });
                //console.dir(nodes[path_]);
                this.sink.next([nodes[path_]]);//return as Array in case we ever want to add more
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


export default ListFoldersService;
