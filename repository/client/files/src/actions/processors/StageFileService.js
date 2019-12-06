
import AppActions from '../../library/actions/AppActions';
import AppSettings from '../../library/actions/AppSettings';
import request from 'superagent';

class StageFileService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (path_) {
            this.execute(path_);
        }.bind(this));


    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute(file_)
    {
        console.log("loading files & folders: " +path_);


        var worker = new Worker("./file-cache-worker.js");
        worker.addEventListener('message', function(e) {
            console.log('Message from Worker: ' + e.data);
        });
        worker.postMessage("Hello World");
    }
};


export default StageFileService;
