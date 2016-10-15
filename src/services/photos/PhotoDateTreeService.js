/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');
var ImageActions = require('../../actions/ImageActions');
/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{PhotoDateTree Service} subscribe");
        this.sink = ImageActions.dateTree.sink;
        ImageActions.dateTree.source.subscribe(this.execute.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute: function(id_)
    {
        if( id_ !== undefined )
        {
            //console.log("{PhotoDateTree Service} execute()");

            var _this = this;
            var _url = '/content.datetree.json';

            return $.ajax({
                'method': "get",
                'url': _url,
                'contentType':"application/json; charset=utf-8",
                'dataType':"json",
                'xhrFields': {
                    withCredentials: true
                }

            }).then(function (data_, status_, xhr_) {
                _this.sink.onNext(data_);

            }, function (xhr_, status_, errorThrown_){

                //send the error to the store (through the sink observer
                if( xhr_.status == 401){
                    AuthActions.loginRedirect.onNext(true);
                }else
                {
                    var _error = {'code':xhr_.status, 'status':xhr_.statusText, 'message': xhr_.responseText};
                    _this.sink.onError(_error);
                }
            });
        }

    }

};

