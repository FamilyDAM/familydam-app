
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';


var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var FileActions = require('../../actions/FileActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

var ImageRow = require('./ImageRow.jsx');
var MusicRow = require('./MusicRow.jsx');

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
            this.history.pushState(null, "/" +this.props.file.id , {'id': this.props.file.id});
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

        var _path = $(event.currentTarget).attr("data-path");

        NodeActions.deleteNode.source.onNext({'path':_path});
    },


    handleDownloadOriginal:function(event, component){
        var _path = $("[data-reactid='" + component + "']").attr("data-path");
        window.open(_path);//, "_blank");
    },




    render:function(){

        if( this.props.file !== undefined && this.props.file['jcr:mixinTypes'] !== undefined && this.props.file['jcr:mixinTypes'].indexOf("dam:image") > -1 ){
            return <ImageRow file={this.props.file}></ImageRow>
        }
        else if( this.props.file !== undefined && this.props.file['jcr:mixinTypes'] !== undefined && this.props.file['jcr:mixinTypes'].indexOf("dam:music") > -1 ){
            return <MusicRow file={this.props.file}></MusicRow>
        }
        //else if( this.props.file.mixins !== undefined && this.props.file.mixins.indexOf("dam:movie") > -1  ){}
        else
        {

            return <div className="row"
                        style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>

                <div style={{'display': 'table-cell', 'width': '50px'}}>
                    <img src="assets/icons/ic_insert_drive_file_black_48px.svg"
                         style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                </div>

                <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                    <div className="row">
                        <div className="col-sm-6 col-lg-7" style={{'overflow':'hidden'}}>
                            <Link to="photoDetails" params={{'id': this.props.file.id}}>{this.props.file.name}</Link>
                        </div>
                        <div className="col-sm-6 col-lg-5 text-right">
                            <ButtonGroup  bsSize="small" style={{'verticalAlign':'middle'}}>

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

    }

});

module.exports = FileRow;

