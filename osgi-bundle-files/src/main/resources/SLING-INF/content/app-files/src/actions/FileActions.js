/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import {Subject} from '@reactivex/rxjs';

import GetFilesAndFoldersService from './processors/GetFileAndFoldersService';
import GetFilesByPathService from "./processors/GetFilesByPathService";
import UploadFileService from "./processors/UploadFileService";
import DeleteFileOrFolderService from "./processors/DeleteFileOrFolderService";
import CreateFolderService from "./processors/CreateFolderService";

class FileActions {


    constructor() {
        this.getFilesAndFoldersService = new GetFilesAndFoldersService(this.getFileAndFolders.source, this.getFileAndFolders.sink);
        this.getFilesByPathService = new GetFilesByPathService(this.getFilesByPath.source, this.getFilesByPath.sink);
        this.uploadFileService = new UploadFileService(this.uploadFile.source, this.uploadFile.sink);
        this.deleteFileOrFolderService = new DeleteFileOrFolderService(this.deleteFileOrFolder.source, this.deleteFileOrFolder.sink);
        this.createFolderService = new CreateFolderService(this.createFolder.source, this.createFolder.sink);
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
     * Upload a files
     */
    uploadFile = {source:new Subject(), sink:new Subject()};

    /**
     * Delete a File
     */
    deleteFileOrFolder = {source:new Subject(), sink:new Subject()};


    /**
     * Create a Folder
     */
    createFolder = {source:new Subject(), sink:new Subject()};


    /**
     * local event called when upload is complete
     */
    uploadProgress = new Subject();
    uploadCompleted = new Subject();
    uploadError = new Subject();

};



export default new FileActions();

