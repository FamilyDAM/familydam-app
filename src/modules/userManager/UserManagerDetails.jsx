/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
import { Router, Link } from 'react-router';


var Button = require('react-bootstrap').Button;
var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;
var Table = require('react-bootstrap').Table;
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var Ladda = require('ladda');


var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');

var NavigationActions = require('./../../actions/NavigationActions');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            user: {},
            savePasswordLoading: false
        }
    },

    statics: {
        willTransitionTo: function (transition, params, query, callback) {

            // update the breadcrumb
            var _pathData = {
                'label': params.id,
                'navigateTo': "userManagerDetails",
                'params': {id: params.id},
                'level': 2
            };
            NavigationActions.currentPath.onNext(_pathData);
            callback();
        }
    },

    componentDidMount: function () {
        console.log("{UserManagerDetailView} componentWillMount");

        // pull
        this.state.user = {};

        var userid = this.props.params.id;
        UserActions.getUser.source.onNext(userid);



        this.loadUserSubscription = UserActions.getUser.sink.subscribe(function (data_) {
            this.setState({'user': data_});
            this.setState({savePasswordLoading: true});
        }.bind(this));


        UserActions.saveUser.sink.subscribe(function(data_){
            setTimeout(function(){ Ladda.stopAll(); }.bind(this), 500);
        }.bind(this), function(data_){
            //error
            setTimeout(function(){ Ladda.stopAll(); }.bind(this), 500);
        }.bind(this));


        UserActions.changePassword.sink.subscribe(function(data_){
            setTimeout(function(){ Ladda.stopAll(); }.bind(this), 500);
        }.bind(this), function(data_){
            //error
            setTimeout(function(){ Ladda.stopAll(); }.bind(this), 500);
        }.bind(this));



        $(this.refs.googleDriveToggle).bootstrapSwitch({'state': false});
        $(this.refs.googleDriveToggle).on('switchChange.bootstrapSwitch', function (event, state) {
            //MetricActions.enableAutoRefresh.onNext(state);
        });
        $(this.refs.dropboxToggle).bootstrapSwitch({'state': false});
        $(this.refs.dropboxToggle).on('switchChange.bootstrapSwitch', function (event, state) {
            //MetricActions.enableAutoRefresh.onNext(state);
        });
        $(this.refs.facebookToggle).bootstrapSwitch({'state': false});
        $(this.refs.facebookToggle).on('switchChange.bootstrapSwitch', function (event, state) {
            //MetricActions.enableAutoRefresh.onNext(state);
        });
        $(this.refs.twitterToggle).bootstrapSwitch({'state': false});
        $(this.refs.twitterToggle).on('switchChange.bootstrapSwitch', function (event, state) {
            //MetricActions.enableAutoRefresh.onNext(state);
        });
    },

    componentDidUpdate: function (prevProps, prevState) {
        $(this.refs.googleDriveToggle).bootstrapSwitch('state', this.state.enableAutoRefresh, true);
        $(this.refs.dropboxToggle).bootstrapSwitch('state', this.state.enableAutoRefresh, true);
        $(this.refs.facebookToggle).bootstrapSwitch('state', this.state.enableAutoRefresh, true);
        $(this.refs.twitterToggle).bootstrapSwitch('state', this.state.enableAutoRefresh, true);

        this.saveBtn = Ladda.create( document.querySelector( '#saveBtn' ) );
        this.savePasswordBtn = Ladda.create( document.querySelector( '#savePasswordBtn' ) );
    },


    componentWillUnmount: function () {
        if (this.loadUserSubscription !== undefined)
        {
            this.loadUserSubscription.dispose();
        }
    },

    componentWillReceiveProps: function (nextProps) {
        
        var userid = this.props.params.id;
        UserActions.getUser.source.onNext(userid);

    },

    handleResetPasswordClick: function (event_) {

        if( this.savePasswordBtn !== undefined ) {
            this.savePasswordBtn.start();
        }

        UserActions.changePassword.source.onNext(this.state.user);
    },

    handleChange: function (event_) {
        var _field = event_.currentTarget.id;
        var _val = event_.currentTarget.value;
        this.state.user[_field] = _val;
        if (this.isMounted()) this.forceUpdate();
    },

    handleSave: function (event_) {

        if( this.saveBtn !== undefined ) {
            this.saveBtn.start();
        }

        UserActions.saveUser.source.onNext(this.state.user);
    },


    render: function () {
        var _this = this;

        return (
            <div className="container-fluid userDetailsView">
                <div className="row">
                    <div className="col-sm-8">
                        <h3>{this.state.user.firstName} {this.state.user.lastName}</h3>
                    </div>
                    <div className="col-sm-4">
                        <LinkContainer to="users">
                            <button className="btn btn-default btn-link">Cancel</button>
                        </LinkContainer>
                        <Button ref="saveBtn" id="saveBtn"
                                data-style="expand-left"
                                data-spinner-size={30}
                                data-spinner-color="#000"
                                bsStyle='primary'
                                className="ladda-button"
                                style={{'color':'#fff'}}
                                onClick={this.handleSave} >Save</Button>
                    </div>
                </div>

                <div className="row personalInfoForm">
                    <div className="col-sm-6">
                        <fieldset>
                            <legend>Personal Info:</legend>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="firstName">
                                        First Name:&nbsp;<br/>
                                        <input type="text"
                                               ref="firstName"
                                               id="firstName" name="firstName"
                                               value={this.state.user.firstName}
                                               onChange={this.handleChange}/>
                                    </label>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="firstName">
                                        Last Name:&nbsp;<br/>
                                        <input type="text"
                                               ref="lastName"
                                               id="lastName" name="lastName"
                                               value={this.state.user.lastName}
                                               onChange={this.handleChange}/>
                                    </label>
                                </div>
                            </div>
                            <div className="row" style={{'marginTop': '10px'}}>
                                <div className="col-sm-12">
                                    <label htmlFor="firstName">
                                        Email:&nbsp;<br/>
                                        <input type="text"
                                               ref="email"
                                               id="email" name="email"
                                               value={this.state.user.email}
                                               onChange={this.handleChange}/>
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>


                    <div className="col-sm-6">
                        <fieldset>
                            <legend>Reset Login Info:</legend>
                            <label htmlFor="password">
                                New Password:<br/>
                                <input type="password"
                                       ref="password"
                                       id="password" name="password"
                                       onChange={this.handleChange}/>
                            </label>

                            <Button ref="savePasswordBtn"
                                    id="savePasswordBtn"
                                    onClick={this.handleResetPasswordClick}
                                    data-color="#fff"
                                    data-style="expand-left"
                                    data-spinner-size={20}
                                    data-spinner-color="#000"
                                    className="ladda-button" >
                                <span className="ladda-label">Save Password</span>
                            </Button>

                        </fieldset>
                        <br/><br/>
                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-12">
                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey={1} title='Cloud Drives'>

                                <Table className="userDetailsTable">
                                    <tbody>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Google Drive (coming soon)
                                        </td>
                                        <td>
                                            <input ref="googleDriveToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Dropbox (coming soon)
                                        </td>
                                        <td>
                                            <input ref="dropboxToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab>



                            <Tab eventKey={2} title='Web Sites'>
                                <Table className="userDetailsTable">
                                    <tbody>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Facebook (coming soon)
                                        </td>
                                        <td>
                                            <input ref="facebookToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Twitter (coming soon)
                                        </td>
                                        <td>
                                            <input ref="twitterToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab>


                            <Tab eventKey={3} title='Email Accounts'>
                                <Table className="userDetailsTable">
                                    <tbody>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Gmail (coming soon)
                                        </td>
                                        <td>
                                            <input ref="facebookToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            Yahoo (coming soon)
                                        </td>
                                        <td>
                                            <input ref="twitterToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{'width':'100%'}}>
                                            POP (coming soon)
                                        </td>
                                        <td>
                                            <input ref="twitterToggle"
                                                   type="checkbox"
                                                   data-size="small"
                                                   disabled
                                                   checked={false}/>
                                        </td>
                                        <td>
                                            <Button bsSize='xsmall' disabled>Authorize</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab>


                            <Tab eventKey={4} title='Permissions'>
                                <br/>(Coming Soon)<br/>

                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

        );
    }

});


