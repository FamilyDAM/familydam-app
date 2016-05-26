/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var LinkContainer = require('react-router-bootstrap').LinkContainer;

import {
    List,
    ListItem,
    Subheader,
    Avatar,
    Paper,
    FlatButton
} from 'material-ui';
import ActionHome from 'material-ui/svg-icons/action/home';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ImagePhoto from 'material-ui/svg-icons/image/photo';
import SocialPerson from 'material-ui/svg-icons/social/person';


var UserStore = require('./../../stores/UserStore');
var AuthActions = require('./../../actions/AuthActions');
var LinkContainer = require('react-router-bootstrap').LinkContainer;


module.exports = React.createClass({


    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {'open': false}
    },

    getInitialState:function(){
        return{
            currentUser:{firstName:'',lastName:'', username:''}
        }
    },


    componentDidMount: function () {
        var _this = this;

        var user = UserStore.getCurrentUser();
        if( user ) {
            this.state.currentUser = user;
        }else{
            //this.context.router.go({pathname:'/login', query:{}, state:{}});
        }
        //console.log("AppSidebar");
    },


    shouldComponentUpdate:function(nextProps, nextState){
        return nextProps.open != this.props.open;
    },


    render: function () {

        var _headerStyle = {};
        var _linkStyle = {'fontSize': '1.5rem', 'paddingLeft': '0px'};
        var _rowStyle = {};
        var _class = "col-xs-4";
        if (this.props.style == "list")
        {
            _class = "col-xs-12";
            _headerStyle = {'display': 'none'}
            _rowStyle = {};
            _linkStyle = {'display': 'inline-block'}
        }
        if (this.props.style == "grid")
        {
            _linkStyle = {'fontSize': '1.5rem', 'paddingLeft': '0px', 'clear': 'left'}
        }


        try
        {
            if ( this.props.open )
            {
                return (
                    <div style={{'display':'flex', 'flexDirection':'column', 'width':'240px'}}>
                        <Paper zDepth={1} style={{'width':'100%'}}>
                            <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'center', 'alignItems':'center', 'height':'125px','width':'100%'}}>
                                <div style={{'display':'flex', 'flexDirection':'row','alignItems':'center'}}>
                                    <Avatar icon={<SocialPerson/>} />
                                    <span style={{'paddingLeft':'10px'}}>{this.state.currentUser.firstName +' ' +this.state.currentUser.lastName}</span>
                                </div>
                                <br/>
                                <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'flex-end'}}>
                                    <LinkContainer to="/login"><FlatButton label="Logout"
                                                style={{'justifyContent':'flex-start'}}/></LinkContainer>
                                    <LinkContainer to={'/users/' +this.state.currentUser.username}><FlatButton label="Profile"
                                                style={{'justifyContent':'flex-end'}} /></LinkContainer>
                                </div>
                            </div>
                        </Paper>

                        <List>
                            <Subheader>Apps</Subheader>

                            <LinkContainer to="dashboard">
                            <ListItem
                                leftAvatar={<Avatar icon={<ActionHome />} />}
                                primaryText="Home"
                            /></LinkContainer>

                            <LinkContainer to="files">
                            <ListItem
                                leftAvatar={<Avatar icon={<FileFolder />} />}
                                primaryText="Files"
                            /></LinkContainer>

                            <LinkContainer to="photos">
                            <ListItem
                                leftAvatar={<Avatar icon={<ImagePhoto />} />}
                                primaryText="Photos"
                            /></LinkContainer>
                        </List>
                    </div>
                );
            }
            else 
            {
                return (

                    <div className="" style={{'display':'flex', 'flexDirection':'column', 'width':'75px'}}>

                        <List style={{'flexGrow':1}}>
                            <LinkContainer to="dashboard">
                            <ListItem
                                style={{'paddingBottom':'10px'}}
                                leftAvatar={<Avatar icon={<ActionHome />} />}
                            /></LinkContainer>

                            <LinkContainer to="files">
                            <ListItem
                                style={{'paddingBottom':'10px'}}
                                leftAvatar={<Avatar icon={<FileFolder />} />}
                            /></LinkContainer>

                            <LinkContainer to="photos">
                            <ListItem
                                style={{'paddingBottom':'10px'}}
                                leftAvatar={<Avatar icon={<ImagePhoto />} />}
                            />
                            </LinkContainer>
                        </List>

                        <List style={{'flexGrow':0}}>
                            <LinkContainer to={'/users/' +this.state.currentUser.username}>
                            <ListItem
                                style={{'paddingBottom':'10px'}}
                                leftAvatar={<Avatar icon={<SocialPerson />} />}
                            />
                            </LinkContainer>
                        </List>

                    </div>

                );
            }

        } catch (err)
        {
            console.log(err);
        }
    }

});
