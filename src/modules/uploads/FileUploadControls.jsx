/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var Rx = require('rx');
var React = require('react');
var UUID = require('uuid-js');


import {RaisedButton,Paper} from 'material-ui';

var Button = require('react-bootstrap').Button;

var UploadActions = require("../../actions/UploadActions");
var DirectoryActions = require("../../actions/DirectoryActions");

var UserStore = require("../../stores/UserStore");
var UploadStore = require("../../stores/UploadStore");
var DirectoryStore = require("../../stores/DirectoryStore");


var FileUploadControls = React.createClass({


    getDefaultProps: function () {
        return {uploadPath: "/content"}
    },

    componentWillMount: function () {
        var _this = this;
    },

    componentDidMount: function () {
        var _this = this;

        //$(this.refs.fileInputField.getDOMNode()).fileinput(_options);
        //this.refs.folderInputField.getDOMNode().setAttribute("webkitdirectory", "");
        //this.refs.folderInputField.getDOMNode().setAttribute("directory", "");
    },


    handleFileChange: function (event_) {
        var _this = this;
        //console.dir(event_);
        var _files = event_.currentTarget.files;
        console.dir(_files);


        Rx.Observable.from(_files).forEach(function (item_) {
            item_.uploadPath = _this.state.uploadPath;
            if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = _this.state.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            UploadActions.addFileAction.onNext(item_);
        })

        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}
    },


    handleFolderChange: function (event_) {
        var _this = this;
        //console.dir(event_);
        var _files = event_.currentTarget.files;
        //console.dir(_files);

        Rx.Observable.from(_files).forEach(function (item_) {
            item_.uploadPath = _this.state.uploadPath;
            if (item_.path !== undefined && item_.path != "")
            {
                item_.uploadPath = _this.state.uploadPath;// +item_.name;
            }
            else if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = _this.state.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            UploadActions.addFileAction.onNext(item_);
        });

        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}
    },


    handleUploadAllFiles: function () {
        UploadActions.uploadAllFilesAction.onNext(true);
    },

    handleRemoveAll: function () {
        UploadActions.removeAllFilesAction.onNext(true);
    },


    /**
     * Use jquery to click a handle file input field
     */
    clickFileInputField: function () {
        $(this.refs.fileInputField).click();
    },


    /**
     * Use jquery to click a hiddle file input field
     */
    clickFolderInputField: function () {
        $(this.refs.folderInputField).attr("webkitdirectory", "webkitdirectory");
        $(this.refs.folderInputField).click();
    },


    render: function () {


        return (
            <Paper className="FileUploadControls" style={{'display':'flex', 'flexDirection':'column', 'padding':'20px', 'height':'250px'}}>

                <h3>Add Files</h3>

                <div style={{'display':'flex', 'flexDirection':'row'}}>

                    <div style={{'display':'flex','alignItems':'center'}}>
                        <div style={{'display':'flex', 'flexDirection':'column'}}>
                            <div className="file-wrapper" onClick={this.clickFileInputField}
                                 style={{'width':'200px', 'margin':'10px'}}>
                                <input type="file"
                                       ref="fileInputField"
                                       onChange={this.handleFileChange}
                                       style={{'display':'none'}}
                                       multiple="true"/>

                                <RaisedButton label="Select Files" primary={true} style={{'width':'100%'}}/>
                            </div>
                            <div className="file-wrapper" onClick={this.clickFolderInputField}
                                 style={{'width':'200px', 'margin':'10px'}}>
                                <input type="file"
                                       ref="folderInputField"
                                       onChange={this.handleFolderChange}
                                       style={{'display':'none'}}
                                       multiple="true" webkitdirectory="webkitdirectory" directory="true"/>

                                <RaisedButton label="Select Folder" primary={true} style={{'width':'100%'}}/>
                            </div>
                        </div>
                    </div>

                </div>
            </Paper>
        )
    }

});

module.exports = FileUploadControls;
