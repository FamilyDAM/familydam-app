/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

import {List, ListItem, Subheader, Avatar, Paper} from 'material-ui';
import {ActionHome} from 'material-ui/svg-icons';
import {FileFolder} from 'material-ui/svg-icons';
import {ImagePhoto} from 'material-ui/svg-icons';
import {SocialPerson} from 'material-ui/svg-icons';


var LinkContainer = require('react-router-bootstrap').LinkContainer;


module.exports = React.createClass({


    getDefaultProps: function () {
        return {'style': 'grid'}
    },


    componentDidMount: function () {
        var _this = this;

        //console.log("AppSidebar");
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
            if (this.props.style == "list")
            {
                return (
                    <div style={{'display':'flex', 'flexDirection':'column', 'width':'100%'}}>
                        <Paper zDepth={1}>
                            <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'center', 'alignItems':'center', 'height':'125px'}}>
                                <div style={{'display':'flex', 'flexDirection':'row','alignItems':'center'}}>
                                    <Avatar icon={<SocialPerson/>} /> <span>[FirstName LastName]</span>
                                </div>
                                <br/>
                                <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'flex-end'}}>
                                    <span>[L]</span>
                                    <span>[S]</span>
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
            else if (this.props.style == "icon-list")
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
                            <LinkContainer to="users">
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
