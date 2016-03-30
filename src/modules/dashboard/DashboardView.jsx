/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');
var SectionHeader = require('../../components/breadcrumb/SectionHeader.jsx');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');

var AuthActions = require('../../actions/AuthActions');

var UserStore = require('./../../stores/UserStore');


module.exports = React.createClass({

    getInitialState:function()
    {
        return {
            user:{}
        };
    },


    componentWillMount: function () {
        var _this = this;

        AuthActions.loginRedirect.subscribe(function () {
            this.props.history.pushState(null, '/', null);
        }.bind(this));


        this.currentUserStoreSubscription = UserStore.currentUser.subscribe(function(data_){
            if( data_ !== undefined )
            {
                this.state.user = data_;
                if( this.isMounted() ) this.forceUpdate();
            }
        }.bind(this));
    },


    componentWillUnmount: function(){
        if( this.currentUserStoreSubscription !== undefined ){
            this.currentUserStoreSubscription.dispose();
        }
    },


    handleDropDownToggle: function(e){

    },

    render: function () {

        var clear_style = {clear: "left"};
        var flex_style = {width: "100%"};

        try
        {
            return (

                <div id="wrapper" className="dashboardView container-fluid">

                    <div className="row">
                        <aside ref="headerSidebar" className="header-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2">
                            <div className="box">
                                <span className="name text-center">{this.state.user.firstName} {this.state.user.lastName}</span>
                            </div>
                        </aside>

                        <section className="col-xs-8 col-sm-9 col-md-9 col-lg-10">
                            <div className="header-body row">
                                <div className="pull-left title">
                                    <SectionHeader/>
                                </div>

                                <div className="pull-right title-link">
                                    <Link to="/">logout</Link>
                                </div>
                            </div>
                            <div className="header-alternative row">

                                <div className="pull-left title-link" style={{'marginLeft':'20px'}}>
                                    <Breadcrumb/>
                                </div>


                                <div className="pull-right title-link">

                                    <Button style={{'padding':'10px'}} disabled={true}><Glyphicon glyph='search'/></Button>

                                    <Dropdown id="settings" pullRight >
                                        <Dropdown.Toggle style={{'padding':'10px'}}>
                                            <Glyphicon glyph='cog'/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='super-colors'>
                                            <LinkContainer to="users"><MenuItem eventKey="1">User Manager</MenuItem></LinkContainer>
                                            <LinkContainer to="login"><MenuItem eventKey="2">Logout</MenuItem></LinkContainer>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="row dashboardBody">
                        <div className="container-fluid child-content">
                            {this.props.children}
                        </div>
                        <div className="device-xs visible-xs"></div>
                        <div className="device-sm visible-sm"></div>
                        <div className="device-md visible-md"></div>
                        <div className="device-lg visible-lg"></div>
                    </div>
                </div>

            );
        }catch(err){
            debugger;
            console.log(err);
        }
    }
});


