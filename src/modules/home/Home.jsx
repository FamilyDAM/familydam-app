
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
var NavItem = require('react-bootstrap').NavItem;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;

var SectionTree = require('../../components/folderTree/SectionTree');
var NavigationActions = require('../../actions/NavigationActions');

var AppSidebar = require('../../components/appSidebar/AppSidebar');

var HomeView = React.createClass({

    componentDidMount: function(){
        // update the breadcrumb
        var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    render: function () {

        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-xs-3" >

                        <AppSidebar style="list"/>

                    </aside>

                    <div className="col-xs-9">
                        <RouteHandler {...this.props}/>
                    </div>
                </div>
            </div>

        );
    }

});

module.exports = HomeView;
