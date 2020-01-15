import AppSettings from '../../library/actions/AppSettings';

class SetFilePropertyService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (properties_) {
            this.execute(properties_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute(properties_)
    {
        const baseUrl = AppSettings.baseHost.getValue();

        let formData = new FormData();
        for (const key in properties_)
        {
            if( key !== "path") {
                formData.append(key, properties_[key]);
            }
        }


        fetch( baseUrl +properties_['path'], {
            method: 'PUT',
            body: formData
        })
        //check for redirect
            .then(response => {
                if(response.redirected) {
                    console.log("redirect to: " +response.url);
                    window.location = response.url
                }
                return response;
            })
            //parse json
            .then((response) => response.json())
            .then(json => {
                this.sink.next(json);
            })
            .catch(err => {
                //send the error to the store (through the sink observer
                if( err.status === 401 || err.status === 403){
                    window.location = "/";
                } else {
                    var _error = {'code': err.status, 'status': err.statusText, 'message': err.responseText||err.message};
                    this.sink.error(_error);
                }
            });
    }

};


export default SetFilePropertyService;
