/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
//di              = require('di');

module.exports = {

    getNode: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    createNode: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    updateNode: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    deleteNode: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}

};



