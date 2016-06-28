/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
import { Router, Link } from 'react-router';

import {
    FlatButton,
    List,
    ListItem,
    Paper,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn,
    Subheader,
} from 'material-ui';


var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');

var TreeList = require('../../components/folderTree/TreeList.jsx');
var SidebarSection = require('../../components/sidebarSection/SidebarSection.jsx');

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    getInitialState: function () {
        return {
            users: [],
            'showCreateUserModal': false
        }
    },

    
    componentDidMount: function () {
        console.log("{UserManagerView} componentDidMount");

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

    selectUser: function(user_){
        if( UserStore.getCurrentUser().isFamilyAdmin || UserStore.getCurrentUser().username == user_ )
        {
            this.context.router.push({pathname: '/users/' + user_});
        }else{
            UserActions.alert.onNext("You are not allowed to edit other users. #3");
        }
    },

    addUser:function(event_){
        if( UserStore.getCurrentUser().isFamilyAdmin )
        {
            this.context.router.push({pathname:'/users/add'})
        }else{
            UserActions.alert.onNext("You are not allowed to add new family members.");
        }
    },

    
    render: function () {


        return (
            <div className="container" >
                
                <div className="row" style={{'marginTop':'20px'}}>
                    <div
                        className="col-xs-12 col-sm-4 col-md-3"
                        zDepth={0}>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff'}}>
                            <List>
                                <Subheader>Users</Subheader>
                                {this.state.users.map(function (user, index) {
                                    return (<ListItem key={user.username}
                                                      onTouchTap={()=>this.selectUser(user.username)}>{user.firstName} {user.lastName}</ListItem>);
                                }.bind(this))}
                            </List>

                            <FlatButton label="Add User"
                                        onTouchTap={this.addUser}/>
                        </Paper>
                    </div>


                    <div className="col-xs-12 col-sm-8 col-md-9">
                        <Paper zDepth={2}>
                            {this.props.children}
                        </Paper>
                    </div>
                </div>
            </div>

        )
    }

});


