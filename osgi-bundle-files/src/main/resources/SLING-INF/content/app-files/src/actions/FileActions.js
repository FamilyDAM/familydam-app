/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';
var Rx = require('rx');

class FileActions {


    /**
     * Tell views to reload the files they are watching
     */
    refreshFiles = new Rx.Subject();



    /**
     * Tell views to reload the files they are watching
     */
    selectFile = new Rx.Subject();


    /**
     * Call the server to load the file list
     */
    getFiles = {'source':new Rx.Subject(),'sink':new Rx.Subject()};


};



export default withStyles(styleSheet)(FileList);

