
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var moment = require('moment');


module.exports = React.createClass({


    getInitialState:function(){
        return {};
    },

    getDefaultProps:function()
    {
        return {
            element:'editableImage',
            imageUrl: ''
        }
    },


    componentDidMount: function(){

    },


    render: function() {
        return (
            <span onClick={this.launchEditor.bind(this)}>
                <a href={'https://www.picozu.com/editor/?i=' +this.props.imageUrl +'&workspace=1&theme=kids&key=c6esIt58tZxx4ANc'} rel="lightbox">
                    <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width': '36px','height': '36px'}}/>
                </a>

            </span>
        );
    }

});


