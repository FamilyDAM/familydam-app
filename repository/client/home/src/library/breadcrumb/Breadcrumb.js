/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import AppActions from "../../library/actions/AppActions";

const styleSheet = (theme) => ({

    breadcrumb:
    {
        backgroundColor:'transparent',
        listStyle: 'none',
        padding: '0px'
    },


    li:{
        float:'left',
        margin: '0 0 10px 5px',
        color: 'blue',
        cursor: 'pointer',

        '&:before':{
            content: '"/ "',
            color: 'black'
        },
        '&:after':{
            content: '" "',
            color: 'black'
        }
    },

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

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.path !== this.props.path);
    }


    parsePath(path_) {

        var _pathParts = path_.split("/");
        var currentPath = "";


        var _paths = [];
        var _pathQueryString = [];
        for (var i = 0; i < _pathParts.length; i++) {
            var part = _pathParts[i];
            if (part.trim().length > 0) {
                currentPath = currentPath + "/" +part;
                _pathQueryString[i] = part;

                _paths.push({
                    "label": part,
                    "level": i,
                    "path": currentPath,
                    "style": {'color': i>2?'blue':'black', 'cursor': i>2?'pointer':'default'}
                });

            }

        }


        this.setState({"paths": _paths});
    }



    render() {
        var classes = this.props.classes;

        return (
            <div >
                <ol className={classes.breadcrumb}>
                    {this.state.paths.map(function (path_) {
                        if (path_.path)
                        {
                            return (
                                <li className={classes.li} key={path_.path} style={path_.style} onClick={()=>AppActions.navigateTo.next(path_.path)}>
                                    {path_.label}
                                </li>
                            );
                        } else {
                            return ( <li className={classes.li} key={path_.label}>{path_.label}</li> );
                        }
                    })}
                </ol>
            </div>
        );
    }

}

export default withStyles(styleSheet)(Breadcrumb);