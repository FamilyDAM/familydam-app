/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
//di              = require('di');

module.exports = {

    getBase64Url: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}

};

//di.annotate(AuthActions, new di.Inject());


