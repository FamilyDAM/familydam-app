'use strict';

var Rx = require('rx');

module.exports = {

    /**
     * Current path to display in the header breadcrumb
     */
    currentPath: new Rx.Subject(),


    /**
     * Call this when you want to change the route (after login, or on logout go to login)
     */
    redirect: new Rx.Subject()

};


