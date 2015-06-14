
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var ButtonLink = require('react-router-bootstrap').ButtonLink;

module.exports = React.createClass({

    componentDidMount: function(){
        console.log("WelcomeView");
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        //if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    render: function () {

        return (
            <div>
                <div className="main-section">

                    <span className="intro">
                        Before we can start the application we need to know a few things. The first, is a place to
                        store all of the files we are going to manage. This could be a large hard drive, a USB drive, or a
                        network drive. The second item are the members of the family who will be using this application.
                    </span>

                    <br/><br/>
                    <div>
                        <label>Select a Language:</label><br/>
                        <select>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left" >
                        </div>
                        <div className="right" >
                            <ButtonLink to="register">Next</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
