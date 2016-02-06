/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';
var Rx = require('rx');

module.exports = {



    /**
     * Tell views to reload the directories they are watching
     */
    refreshDirectories: new Rx.Subject(),

    /**
     * Store selectedFolder as a simple property (subject) in the store.
     */
    selectFolder: new Rx.Subject(),


    //todo:document or remove
    uploadCompleteFileAction: new Rx.Subject(),


    /**
     * Get all of the directories under a root
     */
    getDirectories: {'source':new Rx.Subject(),'sink':new Rx.Subject()},


    /**
     * Create new folder
     */
    createFolder: {'source':new Rx.Subject(), 'sink': new Rx.Subject()}

};



