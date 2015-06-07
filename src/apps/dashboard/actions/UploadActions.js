/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';
var Rx = require('rx');

module.exports = {

    /**
     * TODO, figure out how to subscribe to this subject from inside the store, pull instead of push
     */
    // called when a user wants to queue up a file for upload
    addFileAction: new Rx.Subject(),
    
    // called when file from the queue
    removeFileAction: new Rx.Subject(),

    // called when a user wants to remove all queued files
    removeAllFilesAction: new Rx.Subject(),

    // called for each file that users want to upload
    uploadFileAction: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    // called when a user wants to start uploading all files in the queue
    uploadAllFilesAction: new Rx.Subject(),

    //
    uploadCompleteFileAction: new Rx.Subject(),

    // while a file is uploading it will throw multiple status messages during the process
    fileStatusAction: new Rx.Subject()

};

