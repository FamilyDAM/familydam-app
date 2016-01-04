/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Glyphicon = require('react-bootstrap').Glyphicon;
var LinkContainer = require('react-router-bootstrap').LinkContainer;


var NavigationActions = require('../../actions/NavigationActions');

var Breadcrumb = React.createClass({
    
    
    getInitialState: function(){
        return {'paths':[]}
    },
    
    
    componentDidMount: function(){
        var _this = this;


        NavigationActions.currentPath.subscribe(
            function (path_) {
                _this.state.paths[0] = path_;
                /**
                //console.log("new path");
                //console.dir(path_);
                var _level = path_.level;
                var _paths = [];
                for (var i = 0; i < _level; i++)
                {
                    if( _this.state.paths[i] !== undefined ){
                        _paths[i] = _this.state.paths[i];
                    }
                }
                _paths[_paths.length] = path_;
                //console.dir(_paths);
                _this.state.paths = _paths;
                **/
                if( _this.isMounted() ) _this.forceUpdate();
            }
        );

    },




    render: function () {


        return (
            <div className="row">

                <div className="col-sm-12">
                    <ol className="breadcrumb" style={{'marginBottom':'0px', 'backgroundColor': 'transparent'}}>
                        <LinkContainer to="/dashboard">
                            <Glyphicon glyph='home'/>
                        </LinkContainer>&nbsp;&nbsp;

                        {this.state.paths.map(function(path_){
                            if( path_.level == 1 )
                            {
                                return <span>{path_.label}</span>
                            }})}

                    </ol>
                </div>
            </div>
        );
    }

});

module.exports = Breadcrumb;
