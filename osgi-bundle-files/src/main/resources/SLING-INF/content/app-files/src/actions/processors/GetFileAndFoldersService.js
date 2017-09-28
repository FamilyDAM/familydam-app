import AppActions from '../AppActions';
import request from 'superagent';

class GetFilesAndFoldersService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.distinctUntilChanged().subscribe(function (path_) {
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
        if( path_ !== undefined && path_.length > 0 )
        {
            //console.log("{GetFiles Service} getFiles()");
            var _url =  "http://localhost:9000/" +path_ +".graph.1.json/nt:file,sling:file,nt:folder,sling:folder,dam:file,dam:folder/name,index,parent,links,path,jcr:primaryType,jcr:created,jcr:mixinTypes";

            request.get(_url)


                .withCredentials()
                .set('Accept', 'application/json')
                .end((err, res)=>{

                    if( !err ){

                        var _nodes = [];
                        if( res.body.children ){
                            _nodes = res.body.children.filter(f=>!f.name.toString().startsWith("."));
                        }
                        this.sink.next(_nodes);

                    }else{
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


export default GetFilesAndFoldersService;
