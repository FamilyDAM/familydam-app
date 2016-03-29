/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Glyphicon = require('react-bootstrap').Glyphicon;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var LinkContainer = require('react-router-bootstrap').LinkContainer;


module.exports = React.createClass({


    getDefaultProps: function(){
        return {'style':'grid'}
    },


    componentDidMount: function(){
        var _this = this;

        //console.log("AppSidebar");
    },


    render: function () {

        var _headerStyle = {};
        var _linkStyle = {'fontSize':'1.5rem', 'paddingLeft':'0px'};
        var _rowStyle = {};
        var _class = "col-xs-4";
        if( this.props.style == "list" ){
            _class = "col-xs-12";
            _headerStyle = {'display':'none'}
            _rowStyle = {};
            _linkStyle = {'display':'inline-block'}
        }
        if( this.props.style == "grid" ){
            _linkStyle = {'fontSize':'1.5rem', 'paddingLeft':'0px', 'clear':'left'}
        }


        try
        {
            if( this.props.style == "list" )
            {
                return (
                    <div className="appSidebar container-fluid">
                        <div className="row" style={_headerStyle}>
                            <div className="titleBar">
                        <span>
                            Apps
                        </span>
                            </div>
                        </div>
                        <div className="row list">
                            <ButtonGroup vertical block>
                                <LinkContainer to="/files">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="file" style={{'color':'#000000', 'fontSize':'21px'}}/>
                                        <span>Files</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="/photos">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="camera" style={{'color':'#000000', 'fontSize':'21px'}}/>
                                        <span>Photos</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="music">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="music" style={{'color':'#eee', 'fontSize':'21px'}}/>
                                        <span style={{'color':'#eee'}}>Music</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="movies">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="film" style={{'color':'#eee', 'fontSize':'21px'}}/>
                                        <span style={{'color':'#eee'}}>Movies</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="web">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="globe" style={{'color':'#eee', 'fontSize':'21px'}}/>
                                        <span style={{'color':'#eee'}}>Web</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="email">
                                    <Button style={{'padding':'5px', 'margin':'10px'}}>
                                        <Glyphicon glyph="inbox" style={{'color':'#eee', 'fontSize':'21px'}}/>
                                        <span style={{'color':'#eee'}}>Email</span>
                                    </Button>
                                </LinkContainer>
                            </ButtonGroup>

                        </div>
                    </div>
                );
            }
            else if( this.props.style == "grid" )
            {
                return (
                    <div className="appSidebar container-fluid">
                        <div className="row" style={_headerStyle}>
                            <div className="titleBar">
                        <span>
                            Apps
                        </span>
                            </div>
                        </div>
                        <div className="row grid">
                            <ButtonGroup justified>
                                <LinkContainer to="files">
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="file" style={{'color':'#000000', 'fontSize':'21px'}}/><br/>
                                        <span>Files</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="photos">
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="camera" style={{'color':'#000000', 'fontSize':'21px'}}/><br/>
                                        <span>Photos</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="music">
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="music" style={{'color':'#eee', 'fontSize':'21px'}}/><br/>
                                        <span style={{'color':'#eee'}}>Music</span>
                                    </Button>
                                </LinkContainer>
                            </ButtonGroup>

                            <ButtonGroup justified>
                                <LinkContainer to="movies" >
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="film" style={{'color':'#eee', 'fontSize':'21px'}}/><br/>
                                        <span style={{'color':'#eee'}}>Movies</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="web" >
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="globe" style={{'color':'#eee', 'fontSize':'21px'}}/><br/>
                                        <span style={{'color':'#eee'}}>Web</span>
                                    </Button>
                                </LinkContainer>

                                <LinkContainer to="email" >
                                    <Button style={{'padding':'3px', 'margin':'3px'}}>
                                        <Glyphicon glyph="inbox" style={{'color':'#eee', 'fontSize':'21px'}}/><br/>
                                        <span style={{'color':'#eee'}}>Email</span>
                                    </Button>
                                </LinkContainer>
                            </ButtonGroup>
                        </div>
                    </div>
                );
            }
        }catch(err){
            console.log(err);
        }
    }

});
