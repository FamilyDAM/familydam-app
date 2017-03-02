/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var SocialActions = require('../../actions/SocialActions');
/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{PhotoSearch Service} subscribe");
        this.sink = SocialActions.authTwitter.sink;
        SocialActions.authTwitter.source.subscribe(this.execute.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute: function(args_)
    {
        var user = UserStore.getCurrentUser();

        var _url = "http://localhost:8080/api/v1/social/twitter/auth?token=" +user.jwtToken;

        if( electronRequire ) {
            electronRequire("electron").shell.openExternal(_url);// +UserStore.getCurrentUser().getId());
        }else{
            window.open(_url, "_blank");
        }

    }

};

