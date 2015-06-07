/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var NavigationActions = require('../../actions/NavigationActions');

var Breadcrumb = React.createClass({
    
    
    getInitialState: function(){
        return {'paths':[
            {'label':'Home', 'navigateTo':"/dashboard", 'params':{}, level:0}
        ]}
    },
    
    
    componentDidMount: function(){
        var _this = this;


        NavigationActions.currentPath.subscribe(
            function (path_) {
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
                if( _this.isMounted() )
                {
                    _this.forceUpdate();
                }
            }
        );

    },




    render: function () {
        return (
            <div className="row">

                <div className="col-sm-12">
                    <ol className="breadcrumb" style={{'marginBottom':'0px', 'backgroundColor': 'transparent'}}>
                        {this.state.paths.map(function(path_) {
                            return <li key={path_.label} ><Link to={path_.navigateTo}  params={path_.params}>{path_.label}</Link></li>;
                        })}
                    </ol>
                </div>
            </div>
        );
    }

});

module.exports = Breadcrumb;
