
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';

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
        var _user = {};
        _user.username = this.refs.firstName.value.toLowerCase();
        _user.password = this.refs.password.value;
        _user.userProps = {};
        _user.userProps.firstName = this.refs.firstName.value;
        _user.userProps.lastName = this.refs.lastName.value;
        _user.userProps.email = this.refs.email.value;

        UserActions.createUser.source.onNext(_user);

        this.createUserSubscription = UserActions.createUser.sink.subscribe(function(data_){
            //load all the users (with our new user)
            UserActions.getUsers.source.onNext(true);
        }.bind(this), function(error_){
            alert( error_ );
        }.bind(this));
    },




    render: function() {
        var overrideStyle = {width:"100%"};

        return (
            <div style={overrideStyle}>
                <div className="loginCardForm center-block container-fluid" style={{'width':'70%', 'maxWidth':'600px'}}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h2>Create First User (administrator)</h2><hr/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <h4>First Name</h4>
                                        <input type="text" ref="firstName" label="First Name"/>
                                    </div>
                                    <div className="col-xs-6">
                                        <h4>Last Name</h4>
                                        <input type="text" ref="lastName" label="Last Name"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h4>Email</h4>
                                        <input type="email" ref="email" label="Email"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h4>Password</h4>
                                        <input type="password" ref="password" label="password"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h4>Confirm Password</h4>
                                        <input type="password" ref="confirmPassword" label="password"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <p className="center-block" style={{'padding':'20px 0px 20px 0px'}}>
                               The first thing we need to do is create an login for you that will be
                                registered as the 'Administrator' of this FamilyDAM system.
                            </p>
                            <p className="center-block" >
                                After you login, you will be able to create accounts for each member of your family, in the User Manager.
                            </p>
                        </div>
                    </div>



                    <div className="row">
                        <div className="col-sm-12" style={{'textAlign':'right'}}>
                            <hr/>
                            <button className="btn btn-primary" onClick={this.handleSubmit} onTouch={this.handleSubmit}>create</button>
                        </div>
                    </div>
                </div>;

            </div>
        )
    }

});

