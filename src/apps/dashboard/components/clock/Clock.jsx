
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var moment = require('moment');


var Clock = React.createClass({

    getInitialState: function(){
        return {
            timestamp:new Date().getTime()
        }
    },

    componentDidMount: function(){
        this.timer = setInterval(this.tick, 1000);
    },

    componentWillUnmount: function(){
        clearInterval(this.timer);
    },

    tick: function(){
        if( this.isMounted() ) this.setState({timestamp: new Date().getTime()});
    },

    render: function() {

        return (
            <div>
                <div className="timestamp">{moment().format('h:mm:ss a')}</div>
            </div>
        );
    }

});

module.exports = Clock;
