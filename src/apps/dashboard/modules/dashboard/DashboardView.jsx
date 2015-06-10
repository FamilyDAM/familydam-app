

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
                            <Nav className="navbar-right">
                                <NavItemLink eventKey={1} to="files">Files</NavItemLink>
                                <NavItemLink eventKey={1} to="files">Photos</NavItemLink>
                                <NavItemLink eventKey={1} to="files">Music</NavItemLink>
                                <NavItemLink eventKey={1} to="files">Movies</NavItemLink>
                                <NavItemLink eventKey={1} to="files">Email Archive</NavItemLink>
                                <NavItemLink eventKey={1} to="files">Web Archive</NavItemLink>
                                <DropdownButton eventKey={3} title="">
                                    <MenuItemLink eventKey="1" to="login">Logout</MenuItemLink>
                                </DropdownButton>
                            </Nav>
                            <Nav style={clear_style}>
                                <Breadcrumb/>
                            </Nav>
                        </Navbar>

                        <div id="fab-button-group" style={{'zIndex':2000}}>
                            <div className="fab  show-on-hover dropup">
                                <div data-toggle="tooltip" data-placement="left" title="Compose">
                                    <button type="button" className="btn btn-danger btn-io dropdown-toggle"
                                            data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                        <Link to="upload" style={{'color':'#fff'}}>
                                            <Glyphicon glyph="plus"
                                                       className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                       style={{'fontSize': '24px;'}}></Glyphicon>
                                        </Link>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                    </span>
                                    </button>
                                </div>
                                <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                </ul>
                            </div>
                        </div>
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
