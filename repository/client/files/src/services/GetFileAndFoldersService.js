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
    async getFilesAndFolders(folderId_)
    {
        //console.log("loading files & folders: " +path_);

        const baseUrl = AppSettings.baseHost.getValue();
        let _url = baseUrl + '/files/api';

        if( folderId_ !== undefined && folderId_.length > 0 ) {
            _url = _url + folderId_;
        }


        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        this.isLoading.next(true);

        //Save or Create user
        const req = await fetch( _url, {
            method: 'GET',
            cache: "no-cache",
            headers: headers,
            credentials: 'include'
        });

        const response = await req.json();
        if( req.status == 200 ) {
            this.sink.next(response);
            this.isLoading.next(false);
        }else{
            console.dir(err);
            var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText};
            this.sink.error(_error);
            this.isLoading.next(false);
        }

    }

};


export default new GetFilesAndFoldersService();
