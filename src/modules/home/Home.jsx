
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var SectionTree = require('../../components/folderTree/SectionTree');
var NavigationActions = require('../../actions/NavigationActions');

var AppSidebar = require('../../components/appSidebar/AppSidebar');

module.exports = React.createClass({

    componentDidMount: function(){
        // update the breadcrumb
        var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':1};
        this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    render: function () {

        var asideClass = "col-xs-3 box";
        var asideStyle = {};


        return (
            <div className="homesView container-fluid">
                <div className="row">
                    <aside className="body-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2" style={{'marginLeft':'-10px'}}>

                        <div style={{'minHeight':'200px', 'height':'100vh'}}>
                            <SectionTree title="Apps"/>
                            <AppSidebar style="list"/>
                        </div>

                    </aside>

                    <div className="card main-content col-xs-8 col-sm-9 col-md-9 col-lg-10">
                        <br/><br/><br/><br/><br/>
                        <h3 className="text-center">Select an App to start</h3>
                    </div>
                </div>
            </div>

        );
    }

});

