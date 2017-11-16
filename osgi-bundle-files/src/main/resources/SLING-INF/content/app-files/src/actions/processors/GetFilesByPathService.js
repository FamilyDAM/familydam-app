import request from 'superagent';

class GetFilesByPathService {

    sink=undefined;

    constructor(source_, sink_) {
        //console.log("{createUser Service} subscribe");
        this.sink = sink_;

        source_.subscribe(function (path_) {
            this.getFiles(path_);
        }.bind(this));
    }

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getFiles(paths_)
    {
        var u = window.localStorage.getItem("u");
        var p = window.localStorage.getItem("p");
        //.set('Authorization', 'user ' +u +":" +p)

        if( paths_ !== undefined && paths_.length > 0 )
        {
            var pathPromises = [];

            for (var i = 0; i < paths_.length; i++) {
                var path = paths_[i];

                var promise = request.get( "http://localhost:9000" +path +".1.json" )
                    .withCredentials()
                    .set('Authorization', 'user ' +u +":" +p)
                    .set('Accept', 'application/json');

                pathPromises.push(promise);
            }

            Promise.all(pathPromises).then((results)=>{

               var nodes = [];
                for (var i = 0; i < results.length; i++) {
                    var response = results[i];
                    nodes.push(response.body);
                }
               this.sink.next(nodes);
            }).catch(reason => {
                debugger;
                console.log(reason)
            });
        }
    }

};


export default GetFilesByPathService;
