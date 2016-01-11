
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');

module.exports = {

    /**
     * Current path to display in the header breadcrumb
     */
    currentPath: new Rx.ReplaySubject(3),


    /**
     * Call this when you want to change the route (after login, or on logout go to login)
     */
    redirect: new Rx.Subject()

};


