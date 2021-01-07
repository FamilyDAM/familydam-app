import AppActions from '../library/actions/AppActions.js';
import AppSettings from '../library/actions/AppSettings.js';
import {Subject,BehaviorSubject} from '@reactivex/rxjs';

class GetFilesAndFoldersService {

    isLoading = new BehaviorSubject(false);
    sink = new Subject();
    source = new Subject();

    constructor() {
        //console.log("{createUser Service} subscribe");
        this.source.subscribe(function (path_) {
            this.getFilesAndFolders(path_);
        }.bind(this));


    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    async getFilesAndFolders(path_)
    {
        //console.log("loading files & folders: " +path_);

        const baseUrl = AppSettings.baseHost.getValue();

        let _url = baseUrl +'/content/';
        if( path_  && path_.length > 1 ) {
            _url = baseUrl + path_;// + ".graph.1.json/nt:file,sling:file,nt:folder,sling:folder,dam:file,dam:folder/name,index,parent,links,path,jcr:primaryType,jcr:created,jcr:mixinTypes&t=1";
        }
            
        const headers = new Headers();
        headers.append('Accept', 'application/hal+json');

        this.isLoading.next(true);

        //Save or Create user
        const req = await fetch(_url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers,
            credentials: 'include'
        });

        const json = await req.json();
        if (req.status == 200 ) {
            if( json._embedded ) {
                var _nodes = json._embedded.nodes.filter(f => !f.name.startsWith("."));
                this.sink.next(_nodes);
            }else{
                this.sink.next([]);
            }

            this.isLoading.next(false);
        } else {
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
            this.isLoading.next(false);
        }


    }


    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getFilesAndFoldersOld(path_)
    {
        //console.log("loading files & folders: " +path_);

        const baseUrl = AppSettings.baseHost.getValue();


        if( path_ !== undefined && path_.length > 0 )
        {

            //console.log("{GetFiles Service} getFiles()");
            //"http://localhost:9000/"
            var _url = baseUrl +path_;// + ".graph.1.json/nt:file,sling:file,nt:folder,sling:folder,dam:file,dam:folder/name,index,parent,links,path,jcr:primaryType,jcr:created,jcr:mixinTypes&t=1";


            request.get(_url)
                .withCredentials()
                .set('Accept', 'application/json')
                .end((err, res) => {

                    if (!err) {

                        var _nodes = [];
                        if (res.body) {
                            _nodes = res.body.filter(f => !f.name.toString().startsWith("."));
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


export default new GetFilesAndFoldersService();
