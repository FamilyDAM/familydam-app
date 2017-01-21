/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');

module.exports = {

    saveToken: new Rx.Subject(),

    /**
     * Clear Auth cache & redirect a user back to login, from anywhere in the code.
     * @param observer
     * @returns {*}
     */
    logout: new Rx.Subject(),
    loginRedirect: new Rx.Subject(),
    checkAuth:  {'source':new Rx.Subject(), 'sink':new Rx.Subject()},


    /**
     * Call service to login the user
     */
    login: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}
    
};


