import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';

class GetFilesAndFoldersService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (path_) {
            this.getFilesAndFolders(path_);
        }.bind(this));


    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getFilesAndFolders(path_)
    {
        console.log("loading files & folders: " +path_);

        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();


        if( path_ !== undefined && path_.length > 0 )
        {

            //console.log("{GetFiles Service} getFiles()");
            //"http://localhost:9000/"
            var _url = baseUrl +path_ + ".graph.1.json/nt:file,sling:file,nt:folder,sling:folder,dam:file,dam:folder/name,index,parent,links,path,jcr:primaryType,jcr:created,jcr:mixinTypes&t=1";


            request.get(_url)
                .withCredentials()
                .set('Accept', 'application/json')
                .set('Authorization', 'Basic ' +btoa(unescape(encodeURIComponent(user +":" +pwd))))
                .end((err, res) => {

                    if (!err) {

                        var _nodes = [];
                        if (res.body.children) {
                            _nodes = res.body.children.filter(f => !f.name.toString().startsWith("."));
                        }
                        this.sink.next(_nodes);

                    } else {
                        //send the error to the store (through the sink observer
                        if (err.status === 401) {
                            AppActions.navigateTo.next("/");
                        } else if (err.status === 403) {
                            AppActions.alert.next("You do not have permission to access these files");
                        } else {
                            var _error = {
                                'code': err.status,
                                'status': err.statusText,
                                'message': err.responseText
                            };
                            this.sink.error(_error);
                        }
                    }

                });

        }
    }

};


export default GetFilesAndFoldersService;
