
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';

import {
    TextField, Subheader, FlatButton, RaisedButton
} from 'material-ui';



var ReactIntl  = require('react-intl');
var IntlMixin  = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;


var AuthActions = require('./../../actions/AuthActions');
var UserActions = require('./../../actions/UserActions');
var UserStore = require('./../../stores/UserStore');

module.exports = React.createClass({
    
    propTypes: {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        user: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            user: {
                "firstName":"",
                "lastName":"",
                "email":"",
                "password":"",
                "confirmPassword":""
            }
        };
    },

    componentWillUnMount:function(){
        if( this.createUserSubscription !== undefined ){
            this.createUserSubscription.dispose();
        }
    },

    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleSubmit: function(event)
    {
        debugger;
        var _user = {};
        _user.username = this.refs.firstName.input.value.toLowerCase();
        _user.password = this.refs.password.input.value;
        _user.userProps = {};
        _user.userProps.firstName = this.refs.firstName.input.value;
        _user.userProps.lastName = this.refs.lastName.input.value;
        _user.userProps.email = this.refs.email.input.value;

        UserActions.createUser.source.onNext(_user);

        this.createUserSubscription = UserActions.createUser.sink.subscribe(function(data_){
            //load all the users (with our new user)
            UserActions.getUsers.source.onNext(true);
        }.bind(this), function(error_){
            alert( error_ );
        }.bind(this));
    },




    render: function() {
        var overrideStyle = {'maxWidth':'600px'};

        return (
            <div style={overrideStyle}>
                <div className="loginCardForm center-block container-fluid" >
                    <div className="row">
                        <div className="col-xs-12 col-md-7">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h2>Create First User (administrator)</h2><hr/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <TextField type="text"
                                                   ref="firstName"
                                                   floatingLabelText="First Name"/>
                                    </div>
                                    <div className="col-xs-6">
                                        <TextField type="text"
                                                   ref="lastName"
                                                   floatingLabelText="Last Name"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="email"
                                                   ref="email"
                                                   floatingLabelText="Email"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="password"
                                                   ref="password"
                                                   floatingLabelText="Password"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="password"
                                                   ref="confirmPassword"
                                                   floatingLabelText="Confirm Password"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-5">
                            <p className="center-block" style={{'padding':'20px 0px 20px 0px'}}>
                               The first thing we need to do is create an login for you that will be
                                registered as the 'Administrator' of this system.
                            </p>
                            <p className="center-block" >
                                After you login, you will be able to create accounts for each member of your family, in the User Manager.
                            </p>
                        </div>
                    </div>



                    <div className="row">
                        <div className="col-sm-12" style={{'textAlign':'right'}}>
                            <hr/>
                            <RaisedButton
                                label="Create User"
                                primary={true}
                                onClick={this.handleSubmit}></RaisedButton>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

});

