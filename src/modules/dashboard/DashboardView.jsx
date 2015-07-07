/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
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

var Breadcrumb = require('../../components/breadcrumb/Breadcrumb');
var SectionTree = require('../../components/folderTree/SectionTree');

var AuthActions = require('../../actions/AuthActions');


var DashboardView = React.createClass({

        mixins: [Navigation],


        componentWillMount: function () {
            var _this = this;

            AuthActions.loginRedirect.subscribe(function () {
                this.transitionTo('login');
            }.bind(this));

        },


        componentDidMount: function () {

        },

        handleDropDownToggle: function(e){

        },

        render: function () {

            var clear_style = {clear: "left"};
            var flex_style = {width: "100%"};

            return (
                <div className="dashboardView container-fluid">
                    <div className="row">
                        <Navbar fluid={true} fixedTop={true}>
                            <Nav className="navbar-left">
                                <NavItem >FamilyD.A.M</NavItem>
                            </Nav>

                            <Nav style={clear_style}>
                                <Breadcrumb/>
                            </Nav>

                        </Navbar>
                    </div>

                    <br/>

                    <div className="row" style={{'top': '90px', 'position': 'relative'}}>
                        <RouteHandler {...this.props}/>
                    </div>
                    <div className="device-xs visible-xs"></div>
                    <div className="device-sm visible-sm"></div>
                    <div className="device-md visible-md"></div>
                    <div className="device-lg visible-lg"></div>
                </div>


            );
        }

    })
    ;

module.exports = DashboardView;
