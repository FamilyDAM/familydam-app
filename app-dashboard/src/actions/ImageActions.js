/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');

module.exports = {

    addFilter: new Rx.Subject(),
    removeFilter: new Rx.Subject(),
    selectImage: new Rx.Subject(), // triggered when item is clicked in photoview

    //processors
    search: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    getBase64Url: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    tagsList: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    peopleList: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},
    dateTree: {'source':new Rx.Subject(), 'sink':new Rx.Subject()}

};



