
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

        
        if( data_._embedded.children === undefined ){
            this.files.onNext([]);
        }else
        {
            var _objects = [];
            var _children = data_._embedded.children;
            for (var i = 0; i < _children.length; i++)
            {
                var obj = _children[i];
                if (obj['jcr:uuid'] !== undefined)
                {
                    obj.id = obj['jcr:uuid'];
                } else
                {
                    obj.id = obj.path;
                }

                _objects.push(obj);
            }
            this.files.onNext(_objects);
        }
    }


};



