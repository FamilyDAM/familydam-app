/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;


var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            user: {}
        }
    },

    componentDidMount: function () {
        console.log("{UserManagerDetailView} componentWillMount");

    },


    componentWillUnmount: function () {

    },


    render: function () {
        var _this = this;

        return (
            <div className="row">
                <div className="col-sm-6">
                    <p>The FamilyD.A.M System allows you member of the family their own view of the data.
                    Allowing everyone to manage the files, photos, and music anyway they want. </p>
                    <p>(coming soon: ability to modify view and edit settings for each member of the family)</p>
                    <br/>
                </div>
            </div>

        );
    }

});


