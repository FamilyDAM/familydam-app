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

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    
    getInitialState: function () {
        return {
            user: {},
            empty: "",
            saveLoading: false,
            savePwdLoading: false,
            savePasswordLoading: false
        }
    },


    componentDidMount: function () {
        console.log("{UserManagerDetailView} componentDidMount");

        // pull
        this.state.user = {};


        this.loadUserSubscription = UserActions.getFamilyUser.sink.subscribe(function (data_) {
            this.state.user = data_;
            this.state.savePasswordLoading = true;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.saveUserSubscription = UserActions.saveUser.sink.subscribe(function (data_) {
            setTimeout(function () {
                //stop save spinner
                this.setState({saveLoading: false});
            }.bind(this), 500);
        }.bind(this), function (data_) {
            //error
            setTimeout(function () {
                //stop save spinner
                this.setState({saveLoading: false});
            }.bind(this), 500);
        }.bind(this));


        this.changePasswordSubscription = UserActions.changePassword.sink.subscribe(function (data_) {
            setTimeout(function () {
                //stop save spinner
                this.setState({savePwdLoading: false});
            }.bind(this), 500);
        }.bind(this), function (data_) {
            //error
            setTimeout(function () {
                //stop save spinner
                this.setState({savePwdLoading: false});
            }.bind(this), 500);
        }.bind(this));



        var userid = this.props.params.id;
        if( UserStore.getCurrentUser().isFamilyAdmin || UserStore.getCurrentUser().username == userid )
        {
            //Load user
            UserActions.getFamilyUser.source.onNext(userid);
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
                UserActions.getFamilyUser.source.onNext(userid);
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
        if (this.isMounted()) this.forceUpdate();
    },

    handleSave: function (event_) {

        if (this.saveBtn !== undefined)
        {
            this.saveBtn.start();
        }

        this.setState({saveLoading: true});
        UserActions.saveUser.source.onNext(this.state.user);
    },

    handleResetPasswordClick: function (event_) {

        if (this.savePasswordBtn !== undefined)
        {
            this.savePasswordBtn.start();
        }

        this.state.user.psasword = this.refs.password.value;
        
        this.setState({savePwdLoading: true});
        UserActions.changePassword.source.onNext(this.state.user);
    },

    render: function () {
        var _this = this;

        return (
            <div className="container-fluid userDetailsView" style={{'padding':'20px', 'height':'calc(100vh - 250px)', 'min-height': '500px'}}>
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
                            onTouchTap={this.handleSave}
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
                                    defaultValue={this.state.user.firstName}
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
                                    defaultValue={this.state.user.lastName}
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
                                    defaultValue={this.state.user.email}
                                    floatingLabelText="Email"
                                    onChange={this.handleChange}
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
                            id="savePasswordBtn"
                            onTouchTap={this.handleResetPasswordClick}
                            style={{'paddingLeft':'16px'}}
                            icon={this.state.savePwdLoading?<LoadingIcon style={{'width':'25px', 'height':'25px'}}/>:<span/>}/>


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
            </div>

        );
    }

});


