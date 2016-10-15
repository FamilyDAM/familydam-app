/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
import {Router, Link} from 'react-router';
import {
    FlatButton,
    FontIcon,
    IconButton,
    RaisedButton,
    Paper,
    SvgIcon,
    Subheader,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
    TextField,
    Toggle
} from 'material-ui';
import FolderIcon from 'material-ui/svg-icons/file/folder';

var LinkContainer = require('react-router-bootstrap').LinkContainer;

var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');

var NavigationActions = require('./../../actions/NavigationActions');
var LoadingIcon = require('./../../components/loadingIcon/LoadingIcon.jsx');



module.exports = React.createClass({


    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    getInitialState: function () {
        return {
            user: {userProps:{}},
            isLoading: false
        }
    },


    componentDidMount: function () {
        //console.log("{UserManagerDetailView} componentDidMount");

        // pull
        this.state.user = {};


        debugger;
        this.saveUserSubscription = UserActions.saveUser.sink.subscribe(function (data_) {

            debugger;
            setTimeout(function () {
                //stop save spinner
                this.setState({isLoading: false});
            }.bind(this), 500);

            this.context.router.push({
                pathname: '/users'
            })

        }.bind(this), function (data_) {
            //error
            debugger;
            setTimeout(function () {
                //stop save spinner
                this.setState({isLoading: false});
            }.bind(this), 500);
        }.bind(this));

    },

    componentWillUnmount: function () {
        if (this.saveUserSubscription)
        {
            this.saveUserSubscription.dispose();
        }
    },


    handleChange: function (event_) {

        var _field = event_.currentTarget.id;
        var _val = event_.currentTarget.value;

        if( !this.state.user.userProps ){
            this.state.user.userProps = {};
        }


        if( _field == "isFamilyAdmin"){
            this.state.user.isFamilyAdmin = (_val=="on")?true:false;
        }
        else if( _field == "password")
        {
            this.state.user[_field] = _val;
        }
        else
        {
            if( !this.state.user.userProps ){
                this.state.user.userProps = {};
            }
            this.state.user.userProps[_field] = _val;
        }
        if (this.isMounted()) this.forceUpdate();
    },

    handleSave: function (event_) {

        if (this.saveBtn !== undefined)
        {
            this.saveBtn.start();
        }

        this.setState({isLoading: true});
        UserActions.createUser.source.onNext(this.state.user);
    },



    render: function () {
        var _this = this;

        return (
            <div className="container-fluid userDetailsView" style={{'padding':'20px', 'height':'calc(100vh - 250px)', 'minHeight': '300px'}}>
                <div className="row">
                    <div className="col-xs-4">
                        Add Family Member
                    </div>
                    <div className="col-xs-8" style={{'textAlign':'right'}}>
                        <LinkContainer to="users">
                            <FlatButton label="Cancel"/>
                        </LinkContainer>
                        <RaisedButton
                            label="Save Settings"
                            ref="saveBtn" id="saveBtn"
                            onClick={this.handleSave}
                            primary={true}
                            icon={this.state.isLoading?<LoadingIcon style={{'width':'25px', 'height':'25px'}}/>:<span/>}/>
                    </div>
                </div>

                <div className="row personalInfoForm">
                    <div className="col-sm-7">

                        <Subheader style={{'paddingLeft':'0px'}}>Personal Info:</Subheader>
                        <div className="row">
                            <div className="col-sm-6">
                                <TextField
                                    type="text"
                                    ref="firstName"
                                    id="firstName"
                                    floatingLabelText="First Name"
                                    onChange={this.handleChange}
                                    style={{'width':'100%'}}
                                />

                            </div>
                            <div className="col-sm-6">
                                <TextField
                                    type="text"
                                    ref="lastName"
                                    id="lastName"
                                    floatingLabelText="Last Name"
                                    onChange={this.handleChange}
                                    style={{'width':'100%'}}
                                />

                            </div>
                        </div>
                        <div className="row" style={{'marginTop': '10px'}}>
                            <div className="col-sm-12">
                                <TextField
                                    type="text"
                                    ref="email"
                                    id="email"
                                    floatingLabelText="Email"
                                    onChange={this.handleChange}
                                    style={{'width':'100%'}}
                                />

                            </div>
                        </div>
                        <div className="row" style={{'marginTop': '10px'}}>
                            <div className="col-sm-12">
                                <TextField
                                    type="password"
                                    ref="password"
                                    id="password"
                                    floatingLabelText="Password"
                                    onChange={this.handleChange}
                                    style={{'width':'100%'}}
                                />

                            </div>
                        </div>

                    </div>
                    <div className="col-sm-5" style={{'padding':'20px'}}>
                        <br/><br/>
                        <Toggle
                            id="isFamilyAdmin"
                            label="Family Administrator"
                            defaultToggled={false}
                            onToggle={this.handleChange}
                        />
                        <span style={{'fontSize':'14px', 'fontSize':'1.4rem'}}>Family Administrators can add new users, read, write, and delete any file in the system.</span>
                    </div>
                </div>

            </div>

        );
    }

});


