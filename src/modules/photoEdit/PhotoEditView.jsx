
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';

//var CreativeCloudEditor = require('./../../components/creativeCloudEditor/CreativeCloudEditor');

var NavigationActions = require('./../../actions/NavigationActions');
var NodeActions = require('./../../actions/NodeActions');


var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var ContentStore = require('./../../stores/ContentStore');



module.exports = React.createClass({

    getInitialState:function(){
        return {
            photo: undefined
        }
    },

    componentWillMount: function () {

        // update the breadcrumb
        var _pathData = {'label': 'Photo Editor', 'navigateTo': "photoEdit", 'params': {id: this.props.params.id}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);


        // load the node from the jcr
        NodeActions.getNode.source.onNext(this.props.params.id);


        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (data_) {
            this.state.photo = data_;

            var imagePath = PreferenceStore.getBaseUrl() + data_['jcr:path'] + "?token=" + UserStore.token.value + "&rendition=web.1024";
            this.state.imageSrc = imagePath;

            if( this.isMounted() ) this.forceUpdate();
        }.bind(this));

    },


    componentDidMount: function() {

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
            // always check if the origin is the Picozu domain, https included.
            if (e.origin === 'https://www.picozu.com') {
                // e.data contains the image properties, and you can construct the URL as following:
                console.log('https://www.picozu.com/v/' + e.data.dir + e.data.code + '.' + e.data.format);
            }
        }, false);

    },


    componentDidUpdate:function(){

        if(  this.state.photo !== undefined )
        {
            var image, container, kit;
            image = new Image();
            image.src = this.state.imageSrc;

            image.onload = function () {
                container = document.querySelector("#imgCanvas");

                kit = new ImglyKit({
                    image: image,
                    container: container,
                    assetsUrl: "./assets/js/imglykit/assets",
                    ui: {
                        enabled: true, // UI is disabled per default
                        showExportButton:true,
                        showWebcamButton: false,
                        language: 'en',
                        export: {
                            type: ImglyKit.ImageFormat.JPEG
                        }
                    }
                });
                kit.run();
            };


            /**
            var button = document.querySelector("#render");
            button.addEventListener("onExportClick", function () {
                kit.render("data-url", "image/png")
                    .then(function (image_) {

                        //todo post image_ to server and save as rendition

                        var imageTag = new Image();
                        imageTag.src = image_;
                        imageTag.width = 300;

                        document.body.appendChild(imageTag);
                    });
            });
             **/

        }
    },



    componentWillUnmount: function (nextProps) {
        this.state.photo=undefined;

        if( this.currentNodeSubscription !== undefined ){
            this.currentNodeSubscription.dispose();
        }
    },




    render: function() {

        return (
            <div>
                <br clear="left"/>
                <br clear="left"/>
                <div id="imgCanvas" className="container-fluid" style={{width: $(window).width() * .8, height: ($(window).height() - 200) + 'px'}}></div>
            </div>

        );
    }

});

