
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
var UserStore = require('./../../stores/UserStore');

var intlData = require("./../../locales/en-us");

module.exports = React.createClass({
    mixins : [IntlMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

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
                "email":""
            },
            mode: "inactive",
            locales: intlData.locales,
            messages: intlData.messages
        };
    },


    componentDidMount: function() {
        var _this = this;
    },


    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleLogin: function(event)
    {

        var _this = this;
        var _username = this.props.user.username;
        var _password = this.state.password;

        AuthActions.login.source.onNext({'username':_username, 'password':_password});

        UserStore.currentUser.subscribe(function(data_){
            // redirect to dashboard
            if( data_ )
            {
                //_this.transitionTo("dashboard");
                this.context.router.push({pathname: '/dashboard'});


                mixpanel.identify(data_['jcr:uuid']);
                mixpanel.register({
                    "locale": "en_us",
                    "source": "desktop"
                });
                //todo: set source if desktop or drobo
                //todo: set version #
                mixpanel.track("login");
            }
        }.bind(this));

    },

    /**
     * Select an inactive user
     * @param event
     */
    handleSelect: function(event){
        //event.target = this.getDOMNode();
        this.props.onSelect(this.props.user);
    },

    /**
     * cancel active user
     * @param event
     */
    handleCancel: function(event){
        this.props.onCancel(this.props.user);
    },



    render: function() {

        var overrideStyle = {};

        var activeView;
        if (this.props.mode !== "active") {
            activeView = <div
                            className="personCard panel center-block"
                            onTouchEnd={this.handleSelect}
                            onClick={this.handleSelect}>
                            <div className="box">&nbsp;</div>
                            <h2>{this.props.user.firstName}</h2>
                        </div>;
        } else {
            overrideStyle = {width:"100%"};

            activeView= <div className="loginCard container" style={{'backgroundColor':'#fff', 'width':'500px', 'height':'250px'}}>
                            <div className="row">
                                <div className="col-xs-12 col-sm-4">
                                    <div className="box">&nbsp;</div>
                                    <h2>{this.props.user.firstName}</h2>
                                </div>
                                <div className="col-xs-12 col-sm-8" style={{'textAlign':'center'}}>
                                    <Subheader>{this.props.user.username}</Subheader>
                                    <br/>
                                    <div>
                                        <TextField
                                            ref="pwdField"
                                            type="password"
                                            floatingLabelText={this.getIntlMessage('password')}
                                            onChange={(e) => {this.setState({'password': e.target.value})}}
                                        />

                                    </div>
                                    <div>
                                        <FlatButton onClick={this.handleCancel} label={this.getIntlMessage('cancel')} />
                                        <RaisedButton onClick={this.handleLogin} onTouch={this.handleSubmit} label={this.getIntlMessage('login')}/>
                                    </div>
                                </div>
                            </div>
                        </div>;
        }

        return (
            <div style={overrideStyle}>{activeView}</div>
        )
    }

});

