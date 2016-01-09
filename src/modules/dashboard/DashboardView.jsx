/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History;


var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var SectionHeader = require('../../components/breadcrumb/SectionHeader');
var SectionTree = require('../../components/folderTree/SectionTree');

var AuthActions = require('../../actions/AuthActions');


module.exports = React.createClass({

    componentWillMount: function () {
        var _this = this;

        AuthActions.loginRedirect.subscribe(function () {
            this.props.history.pushState(null, '/', null);
        }.bind(this));

    },



    handleDropDownToggle: function(e){

    },

    render: function () {

        var clear_style = {clear: "left"};
        var flex_style = {width: "100%"};

        try
        {
            return (

                <div id="wrapper" className="dashboardView container-fluid">

                    <div className="row">
                        <aside ref="headerSidebar" className="header-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2">
                            <div className="box">
                                <span className="name text-center">MIKE NIMER</span>
                            </div>
                        </aside>

                        <section className="col-xs-8 col-sm-9 col-md-9 col-lg-10">
                            <div className="header-body row">
                                <div className="pull-left title">
                                    <SectionHeader/>
                                </div>

                                <div className="pull-right title-link">
                                    <Link to="/">logout</Link>
                                </div>
                            </div>
                            <div className="header-alternative row">

                                <div className="pull-right title-link">
                                    <LinkContainer to="/dashboard">
                                        <Button style={{'padding':'10px'}} disabled={true}><Glyphicon glyph='search'/></Button>
                                    </LinkContainer>

                                    <Dropdown id="settings" pullRight >
                                        <Dropdown.Toggle style={{'padding':'10px'}}>
                                            <Glyphicon glyph='cog'/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='super-colors'>
                                            <MenuItem eventKey="1" to="userManager">User Manager</MenuItem>
                                            <MenuItem eventKey="2" to="login">Logout</MenuItem>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="row dashboardBody">
                        <div className="container-fluid child-content">
                            {this.props.children}
                        </div>
                        <div className="device-xs visible-xs"></div>
                        <div className="device-sm visible-sm"></div>
                        <div className="device-md visible-md"></div>
                        <div className="device-lg visible-lg"></div>
                    </div>
                </div>

            );
        }catch(err){
            debugger;
            console.log(err);
        }
    }
});


