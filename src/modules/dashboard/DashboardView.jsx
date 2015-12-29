/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var History = require('react-router').History;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;

var Breadcrumb = require('../../components/breadcrumb/Breadcrumb');
var SectionTree = require('../../components/folderTree/SectionTree');

var AuthActions = require('../../actions/AuthActions');


module.exports = React.createClass({

    componentWillMount: function () {
        var _this = this;

        AuthActions.loginRedirect.subscribe(function () {
            this.props.history.pushState(null, '/', null);
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
                    {this.props.children}
                </div>
                <div className="device-xs visible-xs"></div>
                <div className="device-sm visible-sm"></div>
                <div className="device-md visible-md"></div>
                <div className="device-lg visible-lg"></div>
            </div>

        );
    }
});


