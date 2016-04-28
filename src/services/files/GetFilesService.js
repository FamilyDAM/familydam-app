var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var FileActions = require('../../actions/FileActions');
/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
module.exports = {

    sink:undefined,

    subscribe : function(){
        console.log("{GetFiles Service} subscribe");
        this.sink = FileActions.getFiles.sink;
        FileActions.getFiles.source.distinctUntilChanged().subscribe(this.getFiles.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getFiles: function(path_)
    {
        if( path_ !== undefined )
        {
            console.log("{GetFiles Service} getFiles()");

            var _this = this;
            var _url =  path_ +".graph.1.json/nt:file,nt:folder,sling:Folder/name,path,index,parent,links,jcr:primaryType,jcr:created,jcr:mixinTypes";

            return $.ajax({
                'method': "get",
                'url': _url,
                'data': {'path': path_},
                'xhrFields': {
                    withCredentials: true
                }

            }).then(function (data_, status_, xhr_) {
                
                //console.log("{GetFiles Service} getFiles() success");
                _this.sink.onNext(data_);

                // update token
                var _token = xhr_.getResponseHeader("X-Auth-Token");
                if( _token != null && _token !== undefined ){
                    AuthActions.saveToken.onNext(_token);
                }

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

