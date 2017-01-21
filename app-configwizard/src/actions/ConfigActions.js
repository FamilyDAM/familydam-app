/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');

module.exports = {

    // trigged after settings validation
    settingsValid: new Rx.Subject(),

    // trigged at the end to send a message to the electon main process, which will write the json as a local file.
    saveSettings: new Rx.Subject(),

    // trigger when a user selects a new email
    changeLocale: new Rx.Subject(),


    // triggered on email change
    emailChange: new Rx.Subject(),

    // triggered on family name change. This is a processing action, that will call the primary server first
    familyNameChange: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    // triggered on email change
    storageFolderChange: new Rx.Subject(),

    // triggered when new user has been added
    addUser: new Rx.Subject(),

    // triggered when user has been removed
    removeUser: new Rx.Subject()
};


