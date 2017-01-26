/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
//di              = require('di');

module.exports = {

    alert: new Rx.Subject(),

    authFacebook: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

};



