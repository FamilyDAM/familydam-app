var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var FileActions = require('../../actions/FileActions');
/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
class GetFilesService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.distinctUntilChanged().subscribe(function (data_) {
            this.createUser(data_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getFiles(path_)
    {
        if( path_ !== undefined && path_.length > 0 )
        {
            //console.log("{GetFiles Service} getFiles()");

            var _this = this;
            var _url =  path_ +".graph.1.json/nt:file,sling:folder,dam:folder/name,path,index,parent,links,jcr:primaryType,jcr:created,jcr:mixinTypes";

            return $.ajax({
                'method': "get",
                'url': _url,
                'data': {'path': path_},
                'headers': {
                    Accept : "application/hal+json"
                },
                'xhrFields': {
                    withCredentials: true
                }

            }).then(function (data_, status_, xhr_) {

                //console.log("{GetFiles Service} getFiles() success");
                _this.sink.onNext(data_);


            }, function (xhr_, status_, errorThrown_){

                //send the error to the store (through the sink observer
                if( xhr_.status == 401){
                    AuthActions.loginRedirect.onNext(true);
                }else
                {
                    var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                    _this.sink.onError(_error);
                }
            });
        }
    }

};

