/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import moment from 'moment';


const styleSheet = (theme) => ({
    timestamp: {
        position: 'absolute',
        bottom: '15px',
        left: '20px',
        fontSize: '48px',
        color: '#fff',
        opacity: '.7'
    }
});



class Clock extends Component {

    constructor(props, context){
        super(props);

        this.state = {
            timestamp:new Date().getTime()
        };
    }

    componentDidMount(){
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    tick(){
        //this.setState({timestamp: new Date().getTime()});
    }

    render() {
        var classes = this.props.classes;
        return (
            <div>
                <div className={classes.timestamp}>{moment().format('h:mm:ss a')}</div>
            </div>
        );
    }

}


export default withStyles(styleSheet)(Clock);
