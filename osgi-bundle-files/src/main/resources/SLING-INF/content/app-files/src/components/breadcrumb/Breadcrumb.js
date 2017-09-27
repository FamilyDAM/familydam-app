/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";

const styleSheet = (theme) => ({

    breadcrumb:
    {
        backgroundColor:'transparent',
        listStyle: 'none',
        marginLeft: '-30px'
    },

    ol:{
        listStyle: 'none',
        padding: '0px'
    },

    li:{
        float:'left',
        margin: '0 0 10px 5px'
    },

    liBefore:{
        content: "/ "
    },

    liAfter:{
        content: " "
    }


});

class Breadcrumb extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            paths:[]
        };
    }

    componentDidMount() {

        this.parsePath(this.props.path);


        /**
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
         **/
    }


    componentWillUnmount(){
        if( this.currentPathSubscription ){
            this.currentPathSubscription.dispose();
        }
    }


    componentWillReceiveProps(nextProps){
        if( nextProps.path ){
            this.parsePath(nextProps.path);
        }
    }


    parsePath(path_) {
        var parts = path_.split("/");
        var currentPath = "";

        for (var i = 0; i < parts.length; i++)
        {
            var _part = parts[i];
            currentPath += _part + "/";

            // update the breadcrumb
            var _pathData = {
                'label': _part,
                'navigateTo': '/files?path=' + currentPath,
                'params': {path: currentPath},
                'level': i
            };

            if (i <= 1)
            {
                _pathData = {
                    'label': _part,
                    'level': i
                };
            }

            _pathData.toString();
            //NavigationActions.currentPath.onNext(_pathData);
        }
    }



    render() {
        var classes = this.props.classes;

        return (
            <div >
                <ol className={classes.breadcrumb}>
                    {this.state.paths.map(function (path_) {
                        if (path_.navigateTo)
                        {
                            return ( <li key={path_.level +'-' +path_.label}>
                                        {path_.label}
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

}

export default withStyles(styleSheet)(Breadcrumb);