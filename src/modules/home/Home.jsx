
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
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;

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

        var asideClass = "col-xs-3 box";
        var asideStyle = {};


        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className={asideClass} style={asideStyle}>


                        <ButtonGroup className="boxRow header">
                            <ButtonLink to="home" bsSize='medium' bsStyle="link"><Glyphicon glyph='home'/></ButtonLink>
                            <ButtonLink to="userManager" bsSize='medium' bsStyle="link"><Glyphicon
                                glyph='user'/></ButtonLink>
                            <ButtonLink to="home" bsSize='medium' bsStyle="link"><Glyphicon
                                glyph='search'/></ButtonLink>


                            <Dropdown id='dropdown-custom-1'>
                                <Dropdown.Toggle>
                                    <Glyphicon glyph='cog' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='super-colors'>
                                    <MenuItemLink eventKey="1" to="userManager">User Manager</MenuItemLink>
                                    <MenuItemLink eventKey="2" to="login">Logout</MenuItemLink>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonGroup>

                        <div className="boxRow content" style={{'minHeight':'200px'}}>
                            <SectionTree title="Apps"/>
                            <AppSidebar style="list"/>
                        </div>


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
