/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';
var Rx = require('rx');

class DirectoryActions {


    /**
     * Store selectedFolder as a simple property (subject) in the store.
     */
    selectFolder = new BehaviorSubject();


    /**
     * Get all of the directories under a root
     */
    getDirectories = {'source':new Rx.Subject(),'sink':new Rx.Subject()};


    /**
     * Create new folder
     */
    createFolder = {'source':new Rx.Subject(), 'sink': new Rx.Subject()};

};



