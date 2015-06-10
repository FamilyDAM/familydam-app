
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
        this.files.onNext(data_);
    }


};



