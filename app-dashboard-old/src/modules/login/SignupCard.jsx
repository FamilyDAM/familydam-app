
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';

import {
    TextField,
    Subheader,
    FlatButton,
    RaisedButton,
    SvgIcon
} from 'material-ui';


var ReactIntl  = require('react-intl');
var IntlMixin  = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;


var AuthActions = require('./../../actions/AuthActions');
var UserActions = require('./../../actions/UserActions');
var UserStore = require('./../../stores/UserStore');



const LoadingIcon = (props) => (
    <SvgIcon {...props}>
        <svg width='24px' height='24px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
             preserveAspectRatio="xMidYMid" className="uil-default">
            <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(0 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(30 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(60 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(90 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(120 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(150 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(180 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(210 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(240 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(270 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(300 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#ffffff'
                  transform='rotate(330 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s'
                         repeatCount='indefinite'/>
            </rect>
        </svg>
    </SvgIcon>
);



module.exports = React.createClass({
    
    propTypes: {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        user: React.PropTypes.object
    },

    getInitialState: function(){
        return {
            isLoading: false
        };
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


    componentDidMount:function(){
        $(".loginCardForm").bind('keypress',function(e){
            if(e.keyCode === 13)
            {
                this.handleSubmit(e);
                //put button.click() here
            }
        }.bind(this));
    },

    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleSubmit: function(event)
    {
        var _user = {};
        _user.username = this.refs.firstName.input.value.toLowerCase();
        _user.password = this.refs.password.input.value;
        _user.isFamilyAdmin = true;
        _user.userProps = {};
        _user.userProps.firstName = this.refs.firstName.input.value;
        _user.userProps.lastName = this.refs.lastName.input.value;
        _user.userProps.email = this.refs.email.input.value;


        this.setState({isLoading:true});
        UserActions.createUser.source.onNext(_user);

        this.createUserSubscription = UserActions.createUser.sink.subscribe(function(data_){
            //load all the users (with our new user)
            this.setState({isLoading:false});
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
                                        <h2>Create First User</h2><hr/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <TextField type="text"
                                                   ref="firstName"
                                                   floatingLabelText="First Name"
                                                    style={{'width':'100%'}}/>
                                    </div>
                                    <div className="col-xs-6">
                                        <TextField type="text"
                                                   ref="lastName"
                                                   floatingLabelText="Last Name"
                                                   style={{'width':'100%'}}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="email"
                                                   ref="email"
                                                   floatingLabelText="Email"
                                                   style={{'width':'100%'}}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="password"
                                                   ref="password"
                                                   floatingLabelText="Password"
                                                   style={{'width':'100%'}}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField type="password"
                                                   ref="confirmPassword"
                                                   floatingLabelText="Confirm Password"
                                                   style={{'width':'100%'}}/>
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
                            <RaisedButton
                                label="Create User"
                                primary={true}
                                onClick={this.handleSubmit}
                                icon={this.state.isLoading?<LoadingIcon style={{'width':'25px', 'height':'25px'}}/>:<span/>}/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

});

