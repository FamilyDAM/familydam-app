
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';

import {LeftNav, Snackbar} from 'material-ui';

var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');
var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');

module.exports = React.createClass({

    getInitialState:function(){
        return {
            snackBarOpen:false,
            snackBarMessage:""
        }
    },


    componentDidMount: function(){
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':1};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );

        NavigationActions.openAppSidebar.onNext(true);

        this.userAlertSubscription = UserActions.alert.subscribe( function(data_){
            debugger;
            this.setState({
                snackBarOpen:true,
                snackBarMessage:data_
            });

            setTimeout(function () {
                debugger;
                this.setState({
                    snackBarOpen:false,
                    snackBarMessage:"NO REASON"
                });
            }.bind(this), 3500);
        }.bind(this))
    },


    componentWillUnmount: function(){
        if( this.userAlertSubscription ){
            //this.userAlertSubscription.dispose();
        }
    },


    render: function () {

        return (
            <div className="homesView" style={{'display':'flex', 'flexDirection':'row', 'alignItems':'stretch', 'width':'100%', 'height':'calc(100vh - 65px)'}}>
                <div style={{'display':'flex', 'alignItems':'center', 'width':'100%'}}>
                    <h3 style={{'margin':'0px auto'}}>Select an App To Start</h3>
                </div>

                <footer>
                    <Snackbar
                        open={this.state.snackBarOpen}
                        message={this.state.snackBarMessage}
                        autoHideDuration={3000}
                    />
                </footer>
            </div>

        );
    }


});

