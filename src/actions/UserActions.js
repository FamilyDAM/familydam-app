/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
//di              = require('di');

module.exports = {

    getUsers: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    createUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    loadUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    saveUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}

};



