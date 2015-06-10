
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

'use strict';

var Rx = require('rx');
//di              = require('di');
var PreferenceStore = require('./PreferenceStore');
var UserStore = require('./UserStore');
var NodeActions = require('./../actions/NodeActions');

// Logged in user



module.exports = {

    currentNode:new Rx.BehaviorSubject({}),


    subscribe: function()
    {
        console.log("{ContentStore}.init()");

        NodeActions.getNode.sink.subscribe(this.setCurrentNode.bind(this));
    },

    setCurrentNode: function(data_){
        this.currentNode.onNext( data_ );
    }


};

//di.annotate(AuthActions, new di.Inject());


