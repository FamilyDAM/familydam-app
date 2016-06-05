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
        console.log("{PhotoSearch Service} subscribe");
        this.sink = ImageActions.search.sink;
        ImageActions.search.source.subscribe(this.execute.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute: function(filters_)
    {
        if( filters_ !== undefined )
        {
            var _this = this;
            var _url = "/content.image.search.json?type=dam:image&limit=100&offset=0";

            return $.ajax({
                'method': "POST",
                'url': _url,
                'contentType': "application/json",
                'data':  JSON.stringify(filters_),
                'headers': {
                    'X-Auth-Token': UserStore.token.value
                }

            }).then(function (data_, status_, xhr_) {

                var sortedGroups = [];
                for(var key in data_)
                {
                    sortedGroups.push(data_[key]);
                    // update the images
                    for (var i = 0; i < data_[key].children.length; i++)
                    {
                        var img = data_[key].children[i];
                        var index = img.path.lastIndexOf(".");
                        img.src = PreferenceStore.getBaseUrl() + img.path.substr(0, index) +".resize.250" +img.path.substr(index) ;
                        img.aspectRatio = img.width / img.height

                    }

                }

                _this.sink.onNext(sortedGroups.sort(function(a,b){
                    return b.label - a.label;
                }));


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

