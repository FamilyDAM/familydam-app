
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');
var FileActions = require('./../actions/FileActions');


module.exports = {

    files: new Rx.BehaviorSubject([]),

    subscribe: function(){
        console.log("{FileStore} init()");

        FileActions.getFiles.sink.subscribe(this.setFiles.bind(this));
    },

    setFiles: function(data_){
        
        if( data_.__children__ === undefined ){
            this.files.onNext([]);
        }else
        {
            for (var i = 0; i < data_.__children__.length; i++)
            {
                var obj = data_.__children__[i];
                if (obj['jcr:uuid'] !== undefined)
                {
                    obj.id = obj['jcr:uuid'];
                } else
                {
                    obj.id = obj.path;
                }
            }
            this.files.onNext(data_);
        }
    }


};



