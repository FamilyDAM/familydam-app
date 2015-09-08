
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

    render: function() {

        return (
            <div className="container-fluid">
                Photo Edit!
            </div>

        );
    }

});

module.exports = PhotoEditView;
