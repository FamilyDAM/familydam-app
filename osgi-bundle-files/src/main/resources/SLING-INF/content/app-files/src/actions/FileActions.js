/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {Subject} from '@reactivex/rxjs';

import GetFilesAndFoldersService from './processors/GetFileAndFoldersService';
import GetFilesByPathService from "./processors/GetFilesByPathService";

class FileActions {


    constructor() {
        this.getFilesAndFoldersService = new GetFilesAndFoldersService(this.getFileAndFolders.source, this.getFileAndFolders.sink);
        this.getFilesByPathService = new GetFilesByPathService(this.getFilesByPath.source, this.getFilesByPath.sink);
    }

    /**
     * Call the server to load the file list
     */
    getFileAndFolders = {source:new Subject(), sink:new Subject()};

    /**
     * Get the file nodes for all files, using an array of paths
     */
    getFilesByPath = {source:new Subject(), sink:new Subject()};


    /**
     * Tell views to reload the files they are watching
     */
    //refreshFiles = new Subject();



    /**
     * Tell views to reload the files they are watching
     */
    //selectFile = new Subject();

};



export default new FileActions();

