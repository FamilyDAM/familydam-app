
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

//var ImglyKit = require('imglykit-sdk');
//var ImglyKit = require('./../../assets/js/imglykit/js/imglykit.js');
//var CreativeCloudEditor = require('./../../components/creativeCloudEditor/CreativeCloudEditor');

var NavigationActions = require('./../../actions/NavigationActions');


var PhotoEditView = React.createClass({

    componentWillMount: function () {

        // update the breadcrumb
        var _pathData = {'label': 'Photo Editor', 'navigateTo': "photoEdit", 'params': {id: this.props.params.id}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);

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


        debugger;
        var image, container, kit;

        image = new Image();
        image.src = "image.jpg";

        image.onload = function () {
            container = document.querySelector("#imgCanvas");
            /**
            kit = new ImglyKit({
                image: image,
                container: container,
                assetsUrl: "/assets/js/imglykit", // Change this to where your assets are
                ui: {
                    enabled: true // UI is disabled per default
                }
            });
            kit.run();
             **/
        };

    },

    render: function() {

        return (
            <div id="imgCanvas" className="container-fluid" style="width: 640px; height: 480px;">

            </div>

        );
    }

});

module.exports = PhotoEditView;
