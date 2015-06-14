/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;

module.exports = React.createClass({

    componentDidMount: function () {
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
        console.log("MainView");
        $.material.init();
    },

    componentWillUnmount: function () {
        //if (this.navigationActions !== undefined) this.navigationActions.dispose();
    },


    render: function () {

        return (
            <div className="container-fluid">
                <div className="row header">
                    <div className="col-xs-12">
                        <h3>FamilyD.A.M.  Setup Wizard</h3>
                    </div>
                </div>

                <div className="row main">
                    <aside >
                        <ul>
                            <li><Link to="welcome">Welcome</Link></li>
                            <li><Link to="familyName">Family Name</Link></li>
                            <li><Link to="storage">Storage</Link></li>
                            <li><Link to="accounts">Accounts</Link></li>
                        </ul>
                    </aside>

                    <div className="main-body">
                        <RouteHandler {...this.props}/>
                    </div>


                </div>


            </div>

        );
    }
});

