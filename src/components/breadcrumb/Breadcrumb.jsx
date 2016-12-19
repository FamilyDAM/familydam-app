/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var NavigationActions = require('../../actions/NavigationActions');

module.exports = React.createClass({

    getDefaultProps: function () {
        return {
            path: "",
            "style":""
        };
    },


    getInitialState: function () {
        return {'paths': []}
    },


    componentDidMount: function () {
        var _this = this;

        this.parsePath(this.props.path);


        this.currentPathSubscription = NavigationActions.currentPath.subscribe(
            function (path_) {
                //console.log("new path");
                //console.dir(path_);
                if( !path_.params || !path_.params.path ) return;

                var _level = path_.level;
                var _pathParts = path_.params.path.split("/");


                var _paths = [];
                var _pathQueryString = [];
                for (var i = 0; i < _pathParts.length; i++)
                {
                    var part = _pathParts[i];
                    if( part.trim().length>0){
                        _pathQueryString[i] = part;

                        if( part === "content"){
                            _paths[i] = {
                                "label":part,
                                "level":i,
                            };
                        }else{
                            _paths[i] = {
                                "label":part,
                                "level":i,
                                "navigateTo":"/files?path="+_pathQueryString.join("/")
                            }
                        }
                    }

                }


                //console.dir(_paths);
                this.setState({"paths": _paths});
            }.bind(this)
        );

    },


    componentWillUnmount:function(){
        if( this.currentPathSubscription ){
            this.currentPathSubscription.dispose();
        }
    },

    componentWillReceiveProps: function (nextProps){
        if( nextProps.path ){
            this.parsePath(nextProps.path);
        }
    },


    parsePath: function (path_) {
        var parts = path_.split("/");
        var currentPath = "";

        for (var i = 0; i < parts.length; i++)
        {
            var _part = parts[i];
            currentPath += _part + "/";

            // update the breadcrumb
            if (i <= 1)
            {
                var _pathData = {
                    'label': _part,
                    'level': i
                }
            } else
            {
                var _pathData = {
                    'label': _part,
                    'navigateTo': '/files?path=' + currentPath,
                    'params': {path: currentPath},
                    'level': i
                }
            }

            NavigationActions.currentPath.onNext(_pathData);
        }
    },



    render: function () {

        return (
            <div >
                <ol className="breadcrumb">
                    {this.state.paths.map(function (path_) {
                        if (path_.navigateTo)
                        {
                            return ( <li key={path_.level +'-' +path_.label}>
                                <Link to={{ pathname: path_.navigateTo, params: path_.params }}>{path_.label}</Link>
                            </li> );
                        } else
                        {
                            return ( <li key={path_.label}>{path_.label}</li> );
                        }
                    })}
                </ol>
            </div>
        );
    }

});

