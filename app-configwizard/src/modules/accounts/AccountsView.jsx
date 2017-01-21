/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var IntlMixin = require('react-intl');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var ButtonLink = require('react-router-bootstrap').ButtonLink;

var ConfigActions = require("./../../actions/ConfigActions");
var SettingsStore = require("./../../stores/SettingsStore");

module.exports = React.createClass({

    mixins: [IntlMixin],

    getInitialState:function(){
        return {'isValid':false, users:[]};
    },


    componentDidMount: function () {
        //console.log("AccountsView");
        this.userSubscription = SettingsStore.users.subscribe(function(data_){
            this.state.users = data_;
            if( this.isMounted() ) this.forceUpdate();
        }.bind(this));


        this.isValidSubscription = SettingsStore.isValid.subscribe(function(data_){
            this.state.isValid = data_;
            if( this.isMounted() ) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function () {
        if( this.userSubscription !== undefined ) this.userSubscription.dispose();
        if( this.isValidSubscription !== undefined ) this.isValidSubscription.dispose();
    },

    addUser: function () {
        var _fName = $(this.refs.firstName.getDOMNode()).val();
        var _lName = $(this.refs.lastName.getDOMNode()).val();
        var _password = $(this.refs.password.getDOMNode()).val();
        var _confimPassword = $(this.refs.confirmPassword.getDOMNode()).val();

        if( _fName.length == 0 ){
            alert("First Name is required");
        }else if( _password.length == 0 ){
            alert("Password is required");
        }else if( _password != _confimPassword ){
            alert("Passwords don't match");
        }

        else
        {
            var _user = {};
            _user.firstName = _fName;
            _user.lastName = _lName;
            _user.password = _password;
            ConfigActions.addUser.onNext(_user);

            this.clearForm();
        }
    },

    clearForm:function(){
        $(this.refs.firstName.getDOMNode()).val("");
        $(this.refs.lastName.getDOMNode()).val("");
        $(this.refs.password.getDOMNode()).val("");
        $(this.refs.confirmPassword.getDOMNode()).val("");
    },

    removeUser: function(){
        var _selectedUsers = $(this.refs.userList.getDOMNode()).val();

        for (var i = 0; i < _selectedUsers.length; i++)
        {
            var user = _selectedUsers[i];
            ConfigActions.removeUser.onNext(user);
        }
    },


    handleSave:function(){
        ConfigActions.saveSettings.onNext(true);
    },

    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        {this.getIntlMessage('accounts.intro1')}
                        <strong>{this.getIntlMessage('accounts.labels.admin')}</strong>
                        {this.getIntlMessage('accounts.intro2')}
                    </div>

                    <br/><br/>
                    <table>
                        <tr>
                            <td style={{'width':'200px', 'verticalAlign':'top'}}>
                                <label>{this.getIntlMessage('users')}</label><br/>
                                <select ref="userList" style={{'height':'125px', width:'150px'}} multiple="multiple">
                                    {this.state.users.map(function(data_, indx){
                                        return (<option key={indx} value={data_.firstName +"|" +data_.lastName}>{data_.firstName +" " +data_.lastName}</option>);
                                    })}
                                </select>
                                <br/>
                                <div className="btn-group" style={{'textAlign':'left'}}>
                                    <a href="javascript:void(0)"
                                       className="btn btn-default btn-sm btn-block"
                                       onClick={this.removeUser}
                                       style={{'padding':'0px', 'margin':'0px'}}>- {this.getIntlMessage('accounts.labels.remove')}</a>
                                </div>
                            </td>
                            <td>
                                <table>
                                    <tr>
                                        <td>
                                            <label>{this.getIntlMessage('accounts.labels.firstName')}:</label><br/>
                                            <input type="text" ref="firstName" style={{'width':'127px'}}/>
                                        </td>
                                        <td>
                                            <label>{this.getIntlMessage('accounts.labels.lastName')}:</label><br/>
                                            <input type="text" ref="lastName" style={{'width':'127px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'textAlign':'right'}}>
                                            <label>{this.getIntlMessage('accounts.labels.password')}:</label>
                                        </td>
                                        <td>
                                            <input ref="password" type="password" style={{'width':'126px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'textAlign':'right'}}>
                                            <label>{this.getIntlMessage('accounts.labels.confirmPassword')}:</label>
                                        </td>
                                        <td>
                                            <input ref="confirmPassword" type="password" style={{'width':'126px'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" style={{'textAlign':'center'}}>
                                            <button className="btn btn-default" onClick={this.addUser}>{this.getIntlMessage('accounts.labels.addUser')}</button>
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
                            <ButtonLink to="storage">{this.getIntlMessage('back')}</ButtonLink>
                        </div>
                        <div className="right">
                            {this.state.isValid ?
                            <button onClick={this.handleSave}>{this.getIntlMessage('save')}</button>
                            :
                            <button disabled="disabled">{this.getIntlMessage('save')}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
