/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

module.exports =  React.createClass({
    mixins: [ Router.Navigation ],

    getDefaultProps: function(){
        return {
            'label':'',
            showAddFolder: false,
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

        return (
            <div className="sidebarSection">
                <div className="header" onClick={this.handleToggle}>
                    <h3 className="pull-left">{this.props.label}</h3>

                    <span className="pull-right">

                        <Button style={{'padding':'5px'}}>
                            <Glyphicon glyph="plus"
                                       className="pull-right"
                                       style={{'fontSize':'1.9rem'}}
                                       onClick={this.props.onAddFolder}/>
                        </Button>


                        {function(){
                            if (this.props.showAddFolder == true)
                            {
                                return (
                                    <Button style={{'padding':'5px'}}>
                                        <Glyphicon glyph="plus"
                                                   className="pull-right"
                                                   style={{'fontSize':'1.9rem'}}
                                                   onClick={this.props.onAddFolder}/>
                                    </Button>
                                )
                            }else{
                                return (
                                    <Button style={{'padding':'5px'}}>
                                        <Glyphicon glyph="plus"
                                                   className="pull-right"
                                                   style={{'fontSize':'3.9rem'}}
                                                   onClick={this.props.onAddFolder}/>
                                    </Button>
                                )
                            }
                        }.bind(this)}
                    </span>
                </div>

                <div style={{'display': this.state.open?"block":"none"}}>{this.props.children}<br/></div>
            </div>
        );
    }

});

