import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';

class DeleteFileOrFolderService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (path_) {
            this.deleteFileOrFolder(path_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    deleteFileOrFolder(path_)
    {
        const baseUrl = AppSettings.baseHost.getValue();
        const user = AppSettings.basicUser.getValue();
        const pwd = AppSettings.basicPwd.getValue();


        if( path_ !== undefined && path_.length > 0 )
        {
            var _url =  baseUrl +path_ ;

            request.delete(_url)
                .withCredentials()
                .set('Accept', 'application/json')
                .set('Authorization', 'Basic ' +btoa(unescape(encodeURIComponent(user +":" +pwd))))
                .end((err, res)=>{

                    if( !err ){

                        this.sink.next(true);

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


export default DeleteFileOrFolderService;
