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

var LoadingIcon = require('./../../components/loadingIcon/LoadingIcon.jsx');




module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    getInitialState: function () {
        return {
            user: {},
            empty: "",
            isLoading: false,
            isPwdLoading: false,
            savePasswordLoading: false
        }
    },


    componentDidMount: function () {
        //console.log("{UserManagerDetailView} componentDidMount");

        // pull
        this.state.user = {};

        this.loadUserSubscription = UserActions.getUser.sink.subscribe(function (data_) {
            this.state.user = data_;
            this.state.savePasswordLoading = true;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.saveUserSubscription = UserActions.saveUser.sink.subscribe(function (data_) {
            setTimeout(function () {
                //stop save spinner
                this.setState({isLoading: false});
            }.bind(this), 500);
        }.bind(this), function (data_) {
            //error
            setTimeout(function () {
                //stop save spinner
                this.setState({isLoading: false});
            }.bind(this), 500);
        }.bind(this));



        this.changePasswordSubscription = UserActions.changePassword.sink.subscribe(function (data_) {
            setTimeout(function () {
                //stop save spinner
                this.setState({isPwdLoading: false});
            }.bind(this), 500);
        }.bind(this), function (data_) {
            //error
            setTimeout(function () {
                //stop save spinner
                this.setState({isPwdLoading: false});
            }.bind(this), 500);
        }.bind(this));



        var userid = this.props.params.id;
        if( UserStore.getCurrentUser().isFamilyAdmin || UserStore.getCurrentUser().username == userid )
        {
            //Load user
            UserActions.getUser.source.onNext(userid);
        }else{
            this.context.router.push({pathname: '/users/'});
            UserActions.alert.onNext("You are not allowed to edit other users.");
        }

    },

    componentWillUnmount: function () {
        if (this.loadUserSubscription) this.loadUserSubscription.dispose();
        if (this.saveUserSubscription) this.saveUserSubscription.dispose();
        if (this.changePasswordSubscription) this.changePasswordSubscription.dispose();
    },

    componentWillReceiveProps: function (nextProps) {

        if (nextProps.params.id !== this.props.params.id)
        {
            var userid = nextProps.params.id;
            if( UserStore.getCurrentUser().isFamilyAdmin || UserStore.getCurrentUser().username == userid )
            {
                //Load user
                UserActions.getUser.source.onNext(userid);
            }else{
                this.context.router.push({pathname: '/users/'});
                UserActions.alert.onNext("You are not allowed to edit other users.");
            }

        }

    },

    handleChange: function (event_) {
        var _field = event_.currentTarget.id;
        var _val = event_.currentTarget.value;
        this.state.user[_field] = _val;

        this.setState(this.state);
    },

    handleSave: function (event_) {
        this.setState({isLoading: true});
        UserActions.saveUser.source.onNext(this.state.user);
    },

    handleResetPasswordClick: function (event_) {

        if (this.savePasswordBtn !== undefined)
        {
            this.savePasswordBtn.start();
        }

        this.state.user.psasword = this.refs.password.value;

        this.setState({isPwdLoading: true});
        UserActions.changePassword.source.onNext(this.state.user);
    },

    render: function () {
        var _this = this;

        return (
            <div className="container-fluid userDetailsView" style={{'padding':'20px', 'height':'calc(100vh - 250px)', 'minHeight': '500px'}}>
                <form autoComplete="off">
                <div className="row">
                    <div className="col-sm-4">
                        <h3>{this.state.user.firstName} {this.state.user.lastName}</h3>
                    </div>
                    <div className="col-sm-8" style={{'textAlign':'right'}}>
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
                                    value={this.state.user.firstName}
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
                                    value={this.state.user.lastName}
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
                                    value={this.state.user.email}
                                    floatingLabelText="Email"
                                    onChange={this.handleChange}
                                    autoComplete="off"
                                    style={{'width':'100%'}}
                                />
                            </div>
                        </div>

                    </div>


                    <div className="col-sm-5" style={{'borderLeft':'1px solid', 'paddingLeft':'16px'}}>

                        <Subheader>Reset Login Info:</Subheader>

                        <TextField
                            type="password"
                            ref="password"
                            id="password"
                            floatingLabelText="New Password"
                            autoComplete="off"
                            style={{'paddingLeft':'16px'}}
                        />

                        <br/>
                        <FlatButton
                            label="Change Password"
                            ref="savePasswordBtn"
                            onTouchTap={this.handleResetPasswordClick}
                            style={{'paddingLeft':'16px'}}
                            icon={this.state.isPwdLoading?<LoadingIcon style={{'width':'25px', 'height':'25px'}}/>:<span/>}/>


                        <br/><br/>
                    </div>
                </div>


                <div className="row">
                    <br/><br/>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey={1} label='Cloud Drives'>

                                <Table >
                                    <TableHeader enableSelectAll={false} adjustForCheckbox={false}
                                                 displaySelectAll={false}>
                                        <TableRow>
                                            <TableHeaderColumn colSpan={5} tooltip="Service">Service</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                Google Drive (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Enabled"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                        <tr>
                                            <TableRowColumn colSpan={3}>
                                                Dropbox (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Enabled"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </tr>
                                    </TableBody>
                                </Table>
                            </Tab>


                            <Tab eventKey={2} label='Web Sites'>
                                <Table >
                                    <TableHeader enableSelectAll={false} adjustForCheckbox={false}
                                                 displaySelectAll={false}>
                                        <TableRow>
                                            <TableHeaderColumn colSpan={5} tooltip="Service">Service</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                Facebook (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Sync"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                Twitter (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Sync"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Tab>


                            <Tab eventKey={3} label='Email Accounts'>
                                <Table >
                                    <TableHeader enableSelectAll={false} adjustForCheckbox={false}
                                                 displaySelectAll={false}>
                                        <TableRow>
                                            <TableHeaderColumn colSpan={5} tooltip="Service">Service</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                Gmail (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Sync"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                Yahoo (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Sync"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableRowColumn colSpan={3}>
                                                POP (coming soon)
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <Toggle
                                                    label="Sync"
                                                    disabled={true}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <RaisedButton disabled={true} label="Authorize"/>
                                            </TableRowColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Tab>


                            <Tab eventKey={4} label='Permissions'>
                                <br/>(Coming Soon)<br/>

                            </Tab>
                        </Tabs>
                    </div>
                </div>
                </form>
            </div>

        );
    }

});


