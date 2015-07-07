/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var _AppSidebar = React.createClass({


    getDefaultProps: function(){
        return {'style':'grid'}
    },


    componentDidMount: function(){
        var _this = this;

        console.log("AppSidebar");
    },




    render: function () {

        var _headerStyle = {};
        var _linkStyle = {'fontSize':'1.5rem', 'paddingLeft':'0px'};
        var _rowStyle = {};
        var _class = "col-xs-4";
        if( this.props.style == "list" ){
            _class = "col-xs-12";
            _headerStyle = {'display':'none'}
            _rowStyle = {};
            _linkStyle = {'display':'inline-block'}
        }

        return (
            <div className="appSidebar container-fluid boxRow footer">
                <div className="row" style={_headerStyle}>
                    <div className="titleBar" >
                        <span>
                            Apps
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className={_class} style={_rowStyle}>
                        <Link to="files">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Files</span></Link>
                    </div>
                    <div className={_class} style={_rowStyle}>
                        <Link to="home">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Photos</span></Link>
                    </div>
                    <div className={_class} style={_rowStyle}>
                        <Link to="home">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Music</span></Link>
                    </div>
                    <div className={_class} style={_rowStyle}>
                        <Link to="home">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Movies</span></Link>
                    </div>
                    <div className={_class} style={_rowStyle}>
                        <Link to="home">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Email Archive</span></Link>
                    </div>
                    <div className={_class} style={_rowStyle}>
                        <Link to="home">
                        <img src="assets/icons/appicon77.png"/>
                        <span style={_linkStyle}>Web Archive</span></Link>
                    </div>
                </div>
            </div>
        );
    }

});


module.exports = _AppSidebar;