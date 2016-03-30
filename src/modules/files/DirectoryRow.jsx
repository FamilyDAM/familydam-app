
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

var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

module.exports = React.createClass({

    handleDirClick: function(event, component)
    {
        // get path from element in the list
        var _path =  $("[data-reactid='" + component + "']").attr("data-path");

        if( _path !== undefined )
        {
            // send event that has will be picked up by the FilesView
            DirectoryActions.selectFolder.onNext({'path':_path});
            FileActions.selectFile.onNext(undefined);

            //this.transitionTo('files', {}, {'path': _path})
        }
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


    render2:function(){
        console.log("Directory Row renderer")
        return (<div>path: {this.props.dir.path}<br/></div>)
    },

    render:function(){
        try
        {
            return (<div key={this.props.dir.id}
                        className="row"
                        style={{'border':'1px solid #eee', 'padding':'5px', 'minHeight':'50px', 'cursor': 'pointer'}}
                        onClick={this.handleDirClick}
                        data-id={this.props.dir.id} data-path={this.props.dir.path}>

                    <div style={{'display': 'table-cell', 'width': '50px'}}>
                        <img src="assets/icons/ic_folder_48px.svg"
                             style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-6 col-lg-7" style={{'marginTop': '15px'}}>
                                {this.props.dir.name}
                            </div>

                            <div className="col-sm-6 col-lg-5 text-right">
                                {(() => {
                                    
                                        return (
                                            <ButtonGroup bsSize="small"
                                                         style={{'width':'250px','verticalAlign':'middle'}}>

                                                <Button onClick={this.handleDirClick} params={{'id': this.props.dir.id}}
                                                        style={{'padding':'5px 10px', 'margin':0}}>
                                                    <Glyphicon glyph="eye-open"/> open
                                                </Button>


                                                {(() => {
                                                    if( this.props.dir._links !== undefined &&  this.props.dir._links.delete !== undefined )
                                                    {
                                                        //console.log("delete link:" + this.props.file._links.delete);
                                                        return (<Button onClick={this.handleNodeDelete}
                                                                        data-path={this.props.dir._links.delete}>
                                                            <Glyphicon glyph="remove"/> delete
                                                        </Button>);
                                                    }
                                                })()}

                                            </ButtonGroup>
                                        );
                                    

                                })()}
                            </div>
                        </div>
                    </div>
                </div>);
        }catch(err){
            console.dir(err);
        }
    },

});


