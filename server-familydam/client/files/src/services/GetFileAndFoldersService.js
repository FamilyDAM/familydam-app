import AppActions from '../library/actions/AppActions.js';
import AppSettings from '../library/actions/AppSettings.js';


class GetFilesAndFoldersService {

    sink=new Subject();
    source=new Subject();

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


        if( path_ !== undefined && path_.length > 0 )
        {

            //console.log("{GetFiles Service} getFiles()");
            const baseUrl = AppSettings.baseHost.getValue();
            const _url = baseUrl +'/files/api/files?path=' +path_;

            const headers = new Headers();
            headers.append('Accept', 'application/json');

            this.isLoading.next(true);

            //Save or Create user
            const apps = await fetch( _url, {
                method: 'GET',
                cache: "no-cache",
                headers: headers,
                credentials: 'include'
            });

            const response = await apps.json();
            if( apps.status == 200 && response._embedded.files ){
                this.sink.next(response._embedded.files);
            }else{
                console.dir(err);
                var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
                this.sink.error(_error);
            }


            request.get(_url)
                .withCredentials()
                .set('Accept', 'application/json')
                .end((err, res) => {

                    if (!err) {

                        var _nodes = [];
                        if (res.body) {
                            _nodes = res.body.filter(f => !f.name.toString().startsWith("."));
                        }

                        //fix arrays that serialize as a csv list in an array of 1
                        for (const node of _nodes) {
                            if( node['dam:tags'] && node['dam:tags'].length == 1){
                                node['dam:tags'] = node['dam:tags'][0].split(',');
                            }
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
