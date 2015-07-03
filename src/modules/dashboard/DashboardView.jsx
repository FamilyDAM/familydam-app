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
            $(".dropdown").bind('DOMSubtreeModified', function (evnt) {
                debugger;
                if (evnt.attributeName == "class")
                { // which attribute you want to watch for changes
                    if (evnt.newValue.search(/open/i) == -1)
                    { // "open" is the class name you search for inside "class" attribute
                        $("#fab-button-group").style("right:100px;");
                    } else
                    {
                        $("#fab-button-group").style("right:0px;");
                    }
                }
            });

        },


        handleDropDownToggle: function(e){
            debugger;
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
                            <Nav className="navbar-right hidden-xs">
                                <NavItemLink eventKey={1} to="files">Files</NavItemLink>
                                <NavItemLink eventKey={2} to="files">Photos</NavItemLink>
                                <NavItemLink eventKey={3} to="files">Music</NavItemLink>
                                <NavItemLink eventKey={4} to="files">Movies</NavItemLink>
                                <NavItemLink eventKey={5} to="files">Email Archive</NavItemLink>
                                <NavItemLink eventKey={6} to="files">Web Archive</NavItemLink>
                                <DropdownButton ref="dropDownSettings" eventKey={7} title="">
                                    <MenuItemLink eventKey="1" to="userManager">User Manager</MenuItemLink>
                                    <MenuItemLink eventKey="2" to="login">Logout</MenuItemLink>
                                </DropdownButton>
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
