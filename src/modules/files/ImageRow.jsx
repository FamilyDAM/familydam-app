
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

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState:function()
    {
        return{
            file:{},
            name:''
        }
    },

    componentWillMount: function(){
        this.state.file = this.props.file;
    },

    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;
        
        this.state.file = nextProps.file;
        if (this.isMounted()) this.forceUpdate();
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    handleRowClick: function(event, component)
    {
        if( $(event.target).attr('type') != "button" )
        {
            $(".active").removeClass("active");
            $(event.currentTarget).addClass("active");
            var _path = $(event.currentTarget).attr("data-path");
        }

        if( $('.device-xs').is(':visible') || $('.device-sm').is(':visible'))
        {
            FileActions.selectFile.onNext(undefined);
            
            this.context.router.push({pathname: '/photos/details', query:{'path':_path}});

        }else{
            FileActions.selectFile.onNext(this.props.file);
            //load the data
            NodeActions.getNode.source.onNext(this.props.file.id);
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

    render:function(){

        return  <div className="row" onClick={this.handleRowClick} style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>
                    <div style={{'display': 'table-cell', 'width': '50px'}}>
                        <Link to="photoDetails" params={{'id': this.state.file.id}}>
                            {(() => {

                                if( this.props.file._links !== undefined && this.props.file._links.thumb !== undefined )
                                {
                                    return(
                                        <img src={this.state.file._links.thumb} style={{'width':'50px', 'height':'50px'}}/>
                                    );

                                }else{
                                    return(
                                        <img src="assets/icons/ic_insert_drive_file_black_48px.svg"
                                                style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                                    );
                                }

                            })()}
                        </Link>
                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-6 col-lg-7" style={{'overflow':'hidden'}}>
                                <LinkContainer to="photos/details" query={{'path':this.state.file.path}}><label>{this.state.file.name}</label></LinkContainer>
                            </div>
                            <div className="col-sm-6 col-lg-5 text-right">
                                {(() => {

                                    return(
                                        <ButtonGroup bsSize="small" style={{'verticalAlign':'middle'}}>
                                            <LinkContainer to="photos/details" query={{'path':this.state.file.path}}>
                                                <Button >
                                                    <Glyphicon glyph="eye-open"/> view
                                                </Button>
                                            </LinkContainer>
                                            
                                            <LinkContainer to="photos/edit" query={{'path':this.state.file.path}}>
                                                <Button >
                                                    <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width':'14px', 'height':'14px', 'margin':'auto'}}/> edit
                                                </Button>
                                            </LinkContainer>


                                            {(() => {
                                                if( this.props.file._links !== undefined &&  this.props.file._links.download !== undefined )
                                                {
                                                    //console.log("download link:" + this.props.file._links.download);
                                                    return (
                                                        <Button onClick={this.handleDownloadOriginal} data-path={this.props.file._links.download}>
                                                            <Glyphicon glyph="download"/> download
                                                        </Button>
                                                    );
                                                }
                                            })()}

                                            {(() => {
                                                if( this.props.file._links !== undefined &&  this.props.file._links.delete !== undefined )
                                                {
                                                    //console.log("delete link:" + this.props.file._links.delete);
                                                    return (
                                                        <Button onClick={this.handleNodeDelete}
                                                                    data-path={this.props.file._links.delete}>
                                                            <Glyphicon glyph="remove"/> delete
                                                        </Button>
                                                    );
                                                }
                                            })()}

                                        </ButtonGroup>
                                    );
                                })()}

                            </div>
                        </div>
                    </div>

                </div>

    }

});


