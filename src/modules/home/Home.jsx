
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';

import {LeftNav} from 'material-ui';

var NavigationActions = require('../../actions/NavigationActions');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');
var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');

module.exports = React.createClass({

    componentDidMount: function(){
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':1};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );

        NavigationActions.openAppSidebar.onNext(true);
    },

    componentWillUnmount: function(){

    },


    render: function () {

        return (
            <div className="homesView" style={{'display':'flex', 'flexDirection':'row', 'alignItems':'stretch', 'width':'100%', 'height':'calc(100vh - 65px)'}}>
                <div style={{'display':'flex', 'alignItems':'center', 'width':'100%'}}>
                    <h3 style={{'margin':'0px auto'}}>Select an App To Start</h3>
                </div>
            </div>

        );
    }


});

