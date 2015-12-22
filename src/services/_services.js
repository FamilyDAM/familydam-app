'use strict';

var LoginService = require('./users/LoginService');
var GetUsersService = require('./users/GetUsersService');
var SaveUserService = require('./users/SaveUserService');
var CreateUserService = require('./users/CreateUserService');
var NodeCrudService = require('./content/NodeCrudService');
var GetFilesService = require('./files/GetFilesService');
var GetDirectoriesService = require('./files/GetDirectoriesService');
var CreateDirectoriesService = require('./files/CreateDirectoryService');
var UploadFileService = require('./upload/UploadFileService');
var GetBase64UrlService = require('./images/GetBase64UrlService');
var PhotoTagsListService = require('./photos/PhotoTagsListService');
var PhotoPeopleListService = require('./photos/PhotoPeopleListService');
var PhotoDateTreeService = require('./photos/PhotoDateTreeService');
var PhotoSearchService = require('./photos/PhotoSearchService');

module.exports = {
    subscribe:function()
    {
        LoginService.subscribe();
        GetUsersService.subscribe();
        SaveUserService.subscribe();
        CreateUserService.subscribe();
        NodeCrudService.subscribe();
        GetFilesService.subscribe();
        GetDirectoriesService.subscribe();
        CreateDirectoriesService.subscribe();
        UploadFileService.subscribe();
        GetBase64UrlService.subscribe();
        PhotoTagsListService.subscribe();
        PhotoPeopleListService.subscribe();
        PhotoDateTreeService.subscribe();
        PhotoSearchService.subscribe();
    }
};