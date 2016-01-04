/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

module.exports =  React.createClass({

    getDefaultProps:function(){
        return {
            glyph:'plus',
            linkTo:'upload'
        }
    },

    componentDidMount: function () {
        this.updateFab();
        window.addEventListener("resize", this.updateFab);
    },


    updateFab:function(){
        var _sidebar = $('.header-sidebar');
        if( _sidebar !== undefined )
        {
            var _fab = this.refs.fab;
            var _left = _sidebar.width() + 140;
            var _fab = $(_fab).css("left", _left);
        }
    },


    render: function() {

        return (
            <div id="fab-button-group" ref="fab">
                <div className="fab  show-on-hover dropup">
                    <div data-toggle="tooltip" data-placement="left" title="Compose">
                        <button type="button" className="btn btn-material-lightblue btn-io dropdown-toggle"
                                data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                        <Link to={this.props.linkTo} style={{'color':'#fff'}}>
                                            <Glyphicon glyph={this.props.glyph}
                                                       className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                       style={{'fontSize': '24px'}}></Glyphicon>
                                        </Link>

                                    </span>
                        </button>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                    </ul>
                </div>
            </div>
        );
    }

});

