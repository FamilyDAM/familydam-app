
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
                    <aside className="col-sm-3" >
                        <SectionTree title="Files" sectionNavigateTo="files"/>
                        <SectionTree title="Photos" disabled={true}/>
                        <SectionTree title="Music" disabled={true}/>
                        <SectionTree title="Movies" disabled={true}/>
                        <SectionTree title="Email Archive" disabled={true}/>
                        <SectionTree title="Web Archive" disabled={true}/>
                    </aside>

                    <div className="col-sm-9">
                        <RouteHandler {...this.props}/>
                    </div>
                </div>
            </div>

        );
    }

});

module.exports = HomeView;
