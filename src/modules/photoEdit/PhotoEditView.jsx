
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

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

    },

    render: function() {

        return (
            <div className="container-fluid">
                <iframe
                    name="picozu-disable-x-frame-options"
                    src="https://www.picozu.com/editor/?workspace=0&theme=galaxy&key=c6esIt58tZxx4ANc&i=https://www.picozu.com/u/generic.jpg" width="1172" height="800"></iframe>
            </div>

        );
    }

});

module.exports = PhotoEditView;
