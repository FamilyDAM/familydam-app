
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
            this.setState({
                snackBarOpen:true,
                snackBarMessage:data_
            });

            setTimeout(function () {
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
                <div style={{'display':'flex', 'alignItems':'center', 'width':'70%'}}>
                    <h3 style={{'margin':'0px auto'}}>Select an App To Start!</h3>
                </div>
                <div style={{'display':'flex', 'alignItems':'top', 'width':'30%', "margin":"20px"}}>
                    <div style={{"border":"1px solid", "height":'150px', "width":"100%", "alignItems": "center", "display": "flex", "flexDirection":"column", "backgroundColor":"rgb(255, 255, 255)"}}>
                        <div style={{'display':'flex', 'flexDirection':'row', "height":"60%"}}>
                            <h2 style={{'padding':'10px'}}>Tip!</h2>
                            <span style={{'padding':'10px'}}>Did you know that you can mount the FamilyDAM system as a local WebDav drive.</span>
                        </div>
                        <div>
                            http://localhost:9000/content
                        </div>
                        <div>
                            <a href="https://support.apple.com/kb/ph18514?locale=en_US">Mac instructions</a>
                            &nbsp;&nbsp;&nbsp;
                            <a href="https://www.onemetric.com.au/documentation/windows/mounting-a-webdav-share-windows-7">Win instructions</a>
                        </div>
                    </div>
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

