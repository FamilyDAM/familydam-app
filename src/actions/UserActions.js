/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
//di              = require('di');

module.exports = {

    alert: new Rx.Subject(),

    getUsers: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    createUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    getUser: {'source':new Rx.Subject(), 'sink':new Rx.ReplaySubject(1)},

    getFamilyUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    saveUser: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    changePassword: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}

};



