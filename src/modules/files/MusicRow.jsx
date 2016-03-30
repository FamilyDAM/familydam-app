
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';


var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('../../actions/FileActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

var FileRow = React.createClass({
    
    handleRowClick: function(event, component)
    {

        if( $(event.target).attr('type') != "button" )
        {
            $(".active").removeClass("active");
            $(event.currentTarget).addClass("active");
            var _id = $("[data-reactid='" + component + "']").attr("data-id");
        }


        if( $('.device-xs').is(':visible') || $('.device-sm').is(':visible'))
        {
            FileActions.selectFile.onNext(undefined);
            this.transitionTo("photoDetails", {'id': this.props.file.id});
        }else{
            FileActions.selectFile.onNext(this.props.file);
        }
        // IF DBL CLick
        //var _id = $( "[data-reactid='" +component +"']" ).attr("data-id");
        //transitionTo('photoDetails', {'photoId': _id});
    },


    handleNodeDelete: function(event, component)
    {
        var _this = this;
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _path = $("[data-reactid='" + component + "']").attr("data-path");

        NodeActions.deleteNode.source.onNext({'id':_id, 'path':_path});
    },


    render:function(){

        return  <div className="row" onClick={this.handleRowClick} style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>
                    <div style={{'display': 'table-cell', 'width': '50px'}}>
                        <Link to="photoDetails" params={{'id': this.props.file.id}}>
                            <img src="assets/icons/ic_library_music_48px.svg"
                                 style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                        </Link>

                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-6 col-lg-7" style={{'overflow':'hidden'}}>
                                <Link to="photoDetails" params={{'id': this.props.file.id}}>{this.props.file.name}</Link>
                            </div>
                            <div className="col-sm-6 col-lg-5 text-right">
                                  <ButtonGroup  bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>


                                        {(() => {
                                            if( this.props.file._links !== undefined &&  this.props.file._links.download !== undefined )
                                            {
                                                //console.log("download link:" + this.props.file._links.download);
                                                return (<Button onClick={this.handleDownloadOriginal}
                                                                data-path={this.props.file._links.download}>
                                                    <Glyphicon glyph="download"/> download
                                                </Button>);
                                            }
                                        })()}

                                        {(() => {
                                            if( this.props.file._links !== undefined &&  this.props.file._links.delete !== undefined )
                                            {
                                                //console.log("delete link:" + this.props.file._links.delete);
                                                return (<Button onClick={this.handleNodeDelete}
                                                                data-path={this.props.file._links.delete}>
                                                    <Glyphicon glyph="remove"/> delete
                                                </Button>);
                                            }
                                        })()}
                                    </ButtonGroup>
                                    
                            </div>
                        </div>
                    </div>

                </div>

    }

});

module.exports = FileRow;

