
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');
var DirectoryActions = require('./../actions/DirectoryActions');

module.exports = {

    root: "/dam:files/",

    /**
     * List of directories
     */
    directories: new Rx.BehaviorSubject([]),

    /**
     * the last folder selected by a user in the sidebar folder tree.
     * A simple property, stored in a behavior subject.
     * Note: the value is pushed from the DirectoryAction
     */
    currentFolder: new Rx.BehaviorSubject( {'path':"/dam:files/"} ),


    subscribe: function() {
        console.log("{DirectoryStore}.init()");

        DirectoryActions.selectFolder.subscribe( this.setCurrentFolder.bind(this) );
        DirectoryActions.getDirectories.sink.subscribe( this.setDirectories.bind(this) );
    },


    setCurrentFolder: function(data_){
        this.currentFolder.onNext(data_);
    },

    setDirectories: function(data_){
        this.directories.onNext(data_);
    }


};


