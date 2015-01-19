/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @jsx React.DOM */
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

var DashboardView = React.createClass({


    render: function () {

        var clear_style = {clear: "left"};
        var flex_style = {width: "100%"};

        return (
            <div className="dashboardView container-fluid">
                <div className="row">
                    <Navbar>
                        <Nav className="navbar-left">
                            <NavItem>FamilyD.A.M</NavItem>
                        </Nav>
                        <Nav className="navbar-right">
                            <NavItemLink eventKey={1} to="files">Files</NavItemLink>
                            <NavItemLink eventKey={2} to="photos">Photos</NavItemLink>
                            <DropdownButton eventKey={3} title="">
                                <MenuItemLink eventKey="1" to="login">Logout</MenuItemLink>
                            </DropdownButton>
                        </Nav>
                        <Nav style={clear_style}>
                            <ol className="breadcrumb">
                                <li>
                                    <Link to="dashboard">Home</Link>
                                </li>
                                <li>
                                    <Link to="files">Files</Link>
                                </li>
                                <li className="active">DCS-0001.jpg</li>
                            </ol>
                        </Nav>
                    </Navbar>

                    <div id="fab-button-group">
                        <div className="fab  show-on-hover dropup">
                            <div data-toggle="tooltip" data-placement="left" title="Compose">
                                <button type="button" className="btn btn-danger btn-io dropdown-toggle" data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                        <Link to="upload" style={{'color':'#fff'}}>
                                        <Glyphicon glyph="plus" className="fa fa-plus fa-stack-1x fa-inverse fab-primary" style={{'fontSize': '24px;'}}></Glyphicon>
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
                <RouteHandler {...this.props}/>
            </div>


        );
    }

});

module.exports = DashboardView;
