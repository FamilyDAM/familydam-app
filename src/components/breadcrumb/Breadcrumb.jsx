/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var NavigationActions = require('../../actions/NavigationActions');

module.exports = React.createClass({


    getInitialState: function () {
        return {'paths': []}
    },


    componentDidMount: function () {
        var _this = this;


        NavigationActions.currentPath.subscribe(
            function (path_) {
                //console.log("new path");
                //console.dir(path_);
                var _level = path_.level;
                var _paths = [];
                for (var i = 0; i < _level; i++)
                {
                    if (_this.state.paths[i] !== undefined)
                    {
                        _paths[i] = _this.state.paths[i];
                    }
                }
                _paths[_paths.length] = path_;
                //console.dir(_paths);
                _this.state.paths = _paths;
                if (this.isMounted())this.forceUpdate();
            }.bind(this)
        );

    },


    render: function () {

        return (
            <div style={{'display':'flex', 'alignItems':'center'}}>
                <ol className="breadcrumb" style={{'marginBottom':'0px', 'backgroundColor': 'transparent'}}>
                    {this.state.paths.map(function (path_) {
                        if( path_.navigateTo )
                        {
                            return ( <li key={path_.level +'-' +path_.label}>
                                <Link to={path_.navigateTo} params={path_.params}>{path_.label}</Link>
                            </li> );
                        } else {
                            return ( <li key={path_.label}>{path_.label}</li> );
                        }
                    })}
                </ol>
            </div>
        );
    }

});

