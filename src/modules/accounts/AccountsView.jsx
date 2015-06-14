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
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var ButtonLink = require('react-router-bootstrap').ButtonLink;

module.exports = React.createClass({

    componentDidMount: function () {
        console.log("WelcomeView");
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function () {
        //if (this.navigationActions !== undefined) this.navigationActions.dispose();
    },

    addUser: function () {

    },

    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        At least one user account needs to be created. This will be the primary <strong>ADMIN</strong> account.
                        You can create accounts for every member of your family here or do it later in the application.
                    </div>

                    <br/><br/>
                    <table>
                        <tr>
                            <td style={{'width':'200px', 'verticalAlign':'top', 'display':'none'}}>
                                <label>Users</label>
                                <select style={{'height':'125px', width:'180px'}} multiple="multiple">
                                </select>
                                <br/>
                                <div className="btn-group" style={{'textAlign':'left'}}>
                                    <a href="javascript:void(0)" className="btn btn-default btn-sm btn-block" style={{'padding':'0px', 'margin':'0px'}}>- remove</a>
                                </div>
                            </td>
                            <td>
                                <table>
                                    <tr>
                                        <td>
                                            <label>First Name:</label><br/>
                                            <input type="text" style={{'width':'127px'}}/>
                                        </td>
                                        <td>
                                            <label>Last Name:</label><br/>
                                            <input type="text" style={{'width':'127px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <label>Password:</label><br/>
                                            <input type="text" style={{'width':'260px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <label>Confirm Password:</label><br/>
                                            <input type="text" style={{'width':'260px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" style={{'textAlign':'center'}}>
                                            <button className="btn btn-default" onClick={this.addUser}>Add User</button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left">
                            <ButtonLink to="storage">Back</ButtonLink>
                        </div>
                        <div className="right">
                            <ButtonLink to="welcome">Save</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
