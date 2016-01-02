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
            'label':'',
            'display':'none'
        };
    },
    
    getInitialState: function(){
        return {
            open:false
        }
    },

    componentWillMount: function () {

    },


    componentWillReceiveProps: function(nextProps_){
        if( nextProps_.open !== undefined ){
            this.state.open = nextProps_.open;
        }
    },


    handleToggle : function(){
        if( this.props.display == "none"){
            this.setState({'open': true});
        }else{
            this.setState({'open': false});
        }
    },


    render: function() {
debugger;
        return (
            <div className="sidebarSection">
                <div className="header" onClick={this.handleToggle.bind(this)}>
                    <h3>{this.props.label}</h3>
                </div>

                <div style={{'display': this.state.open?"block":"none"}}>{this.props.children}<br/></div>
            </div>
        );
    }

});

