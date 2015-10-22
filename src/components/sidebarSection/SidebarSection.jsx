/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

module.exports =  React.createClass({
    mixins: [ Router.Navigation ],

    getDefaultProps: function(){
        return {
            'label':''
        };
    },
    
    getInitialState: function(){
        return {
            'display':'none'
        }
    },

    handleToggle : function(){
        if( this.state.display == "none"){
            this.setState({'display': 'block'});
        }else{
            this.setState({'display': 'none'});
        }
    },


    render: function() {

        return (
            <div className="sidebarSection">
                <div className="header" onClick={this.handleToggle}>
                    <h3>{this.props.label}</h3>
                </div>

                <div style={{'display': this.state.display}}>{this.props.children}<br/></div>
            </div>
        );
    }

});

