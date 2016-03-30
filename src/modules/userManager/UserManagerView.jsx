/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
import { Router, Link } from 'react-router';

var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Modal = require('react-bootstrap').Modal;
var ModalHeader = require('react-bootstrap').Modal.Header;
var ModalTitle = require('react-bootstrap').Modal.Title;
var ModalBody = require('react-bootstrap').Modal.Body;
var ModalFooter = require('react-bootstrap').Modal.Footer;


var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');

var SidebarSection = require('../../components/sidebarSection/SidebarSection.jsx');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            users: [],
            'showCreateUserModal': false
        }
    },

    componentDidMount: function () {
        console.log("{UserManagerView} componentWillMount");

        // update the breadcrumb
        var _pathData = {'label': 'User Manager', 'navigateTo': "users", 'params': {}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);

        // handle get all users
        this.getUsersSubscription = UserActions.getUsers.sink.subscribe(function (data_) {
            this.state.users = data_;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));

        // after a user has been created, add them to the array
        this.createUsersSubscription = UserActions.createUser.sink.subscribe(function (data_) {
            this.closeCreateUser();
            //refresh user list
            UserActions.getUsers.source.onNext(true);
        }.bind(this));


        // request user list
        UserActions.getUsers.source.onNext(true);

    },


    componentWillUnmount: function () {
        if (this.getUsersSubscription !== undefined) this.getUsersSubscription.dispose();
        if (this.createUsersSubscription !== undefined) this.createUsersSubscription.dispose();
    },

    handleAddUser: function (event_) {
        this.openCreateUser();
    },

    closeCreateUser(){
        this.setState({showCreateUserModal: false});
    },

    openCreateUser(){
        this.setState({showCreateUserModal: true});
    },

    handleCreateUser: function (event_) {

        var _username = this.refs.username.value;
        var _password = this.refs.password.value;
        var _userProps = {'firstName':_username};

        UserActions.createUser.source.onNext({
            'username': _username,
            'password': _password,
            'userProps': _userProps
        });
    },

    render: function () {
        var _this = this;

        var _this = this;
        var tableClass = "card main-content col-xs-8 col-sm-9 col-md-9 col-lg-10";
        var asideClass = "box body-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2";
        var asideRightClass = "card hidden col-xs-4 col-sm-3 col-md-3";

        if (false)
        {
            tableClass = "card main-content col-xs-8 col-sm-9 col-md-6 col-lg-7";
            asideClass = "box body-sidebar hidden-xs hidden-sm col-md-3 col-lg-2";
            asideRightClass = "card hidden-xs hidden-sm col-md-3 col-lg-3";
        }


        var asideStyle = {};
        var sectionStyle = {};

        return (

            <div className="usersView container-fluid">
                <div className="row">

                    <aside className={asideClass} style={asideStyle}>
                        <div>
                            <SidebarSection label="Users" showAddFolder={true} open={true} onAddFolder={this.handleAddUser}/>
                            <div style={{'clear':'left'}}>
                                <ul style={{'listStyle':'none'}}>
                                    {this.state.users.map(function (user, index) {
                                        return <li key={user.username}><Link to={'users/' +user.username}>{user.firstName} {user.lastName}</Link></li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <section className={tableClass} style={sectionStyle}>
                        <div className="container-fluid photo-body">
                            {this.props.children}
                        </div>
                    </section>



                    <div id="fab-button-group"
                         style={{'position':'absolute','top': '150px','right': '0px', 'display':'none'}}>
                        <div className="fab  show-on-hover dropup">
                            <div data-toggle="tooltip" data-placement="left" title="Compose">
                                <button type="button" className="btn btn-danger btn-io dropdown-toggle"
                                        data-toggle="dropdown">
                                        <span className="fa-stack fa-2x">
                                            <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                             <Glyphicon glyph="plus"
                                                        className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                        style={{'fontSize': '24px'}}></Glyphicon>
                                            <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                        </span>
                                </button>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                <li>Add User</li>
                            </ul>
                        </div>
                    </div>


                    <Modal title="Add User" show={this.state.showCreateUserModal} onHide={this.closeCreateUser}>
                        <div className="modal-body">
                            <table>
                                <tr>
                                    <td><h4>First Name (username)*</h4></td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" ref="username" label="User Name"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><h4>Password*</h4></td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="password" ref="password" label="Password"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div className="modal-footer">
                            <ButtonGroup>
                                <Button onClick={this.closeCreateUser}>Close</Button>
                                <Button onClick={this.handleCreateUser}>Create</Button>
                            </ButtonGroup>
                        </div>
                    </Modal>
                </div>

            </div>
        );
    }

});


