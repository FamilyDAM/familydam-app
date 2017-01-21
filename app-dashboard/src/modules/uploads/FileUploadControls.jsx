/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var Rx = require('rx');
var React = require('react');
var UUID = require('uuid-js');

import AddFileBtn from 'material-ui/svg-icons/action/note-add';
import AddFolderBtn from 'material-ui/svg-icons/file/create-new-folder';
import {RaisedButton, Paper} from 'material-ui';


var UploadActions = require("../../actions/UploadActions");
var DirectoryActions = require("../../actions/DirectoryActions");

var UserStore = require("../../stores/UserStore");
var UploadStore = require("../../stores/UploadStore");
var DirectoryStore = require("../../stores/DirectoryStore");


var FileUploadControls = React.createClass({


    getDefaultProps: function () {
        return {uploadPath: "/content", mode: "full"}
    },

    componentWillMount: function () {

    },

    componentDidMount: function () {

        //$(this.refs.fileInputField).fileinput(_options);
        if( this.refs.folderInputField )
        {
            this.refs.folderInputField.setAttribute("multiple", "true");
            this.refs.folderInputField.setAttribute("webkitdirectory", "webkitdirectory");
            this.refs.folderInputField.setAttribute("directory", "directory");
        }
        if( this.refs.folderInputFieldMin )
        {
            this.refs.folderInputFieldMin.setAttribute("multiple", "true");
            this.refs.folderInputFieldMin.setAttribute("webkitdirectory", "webkitdirectory");
            this.refs.folderInputFieldMin.setAttribute("directory", "directory");
        }
    },


    handleFileChange: function (event_) {

        var _this = this;
        //console.dir(event_);
        var _files = event_.currentTarget.files;
        //console.log("File Selection Event Handler | files=" +_files.length);

        for (var i = 0; i < _files.length; i++)
        {
            var item_ = _files[i];
            item_.uploadPath = this.props.uploadPath;
            if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = this.props.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            item_.status = "PENDING";
        }

        //console.log("File Selection Event Handler | Finished file loop");
        UploadActions.addFileAction.onNext(_files);

        /**
         Rx.Observable.from(_files).forEach(function (item_) {

            item_.uploadPath = this.props.uploadPath;
            if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = this.props.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            UploadActions.addFileAction.onNext(item_);
        }.bind(this));
         **/

        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}
    },


    handleFolderChange: function (event_) {
        //console.dir(event_);
        var _files = event_.currentTarget.files;
        //console.log("File Selection Event Handler | files=" + _files.length);
        //console.dir(_files);

        for (var i = 0; i < _files.length; i++)
        {
            var item_ = _files[i];

            item_.uploadPath = this.props.uploadPath;
            if (item_.path !== undefined && item_.path != "")
            {
                item_.uploadPath = this.props.uploadPath;// +item_.name;
            }
            else if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = this.props.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            item_.status = "PENDING";
        }
        ;


        //console.log("File Selection Event Handler | Finished file loop");
        UploadActions.addFileAction.onNext(_files);

        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}
    },


    /**
     * Use jquery to click a handle file input field
     */
    clickFileInputField: function () {
        $(this.refs.fileInputField).click();
    },


    /**
     * Use jquery to click a hidden file input field
     */
    clickFolderInputField: function () {
        $(this.refs.folderInputField).attr("webkitdirectory", "webkitdirectory");
        $(this.refs.folderInputField).click();
    },


    render: function () {


        if (this.props.mode === "full")
        {
            return (
                <Paper className="FileUploadControls row">
                    <div className="col-xs-12" style={{'padding': '24px'}}>
                        <div className="row">
                            <div className="col-sm-6 hidden-xs-down background">
                            </div>

                            <div className="col-xs-12 col-sm-6"
                                 style={{
                                     'display': 'flex',
                                     'flexDirection': 'column',
                                     'justifyContent': 'center',
                                     'alignItems': 'center'
                                 }}>

                                <div className="file-wrapper" onClick={this.clickFileInputField}
                                     style={{'width': '100%', 'maxWidth': '250px', 'margin': '10px'}}>
                                    <RaisedButton label="Select Files" primary={true} style={{'width': '100%'}}>
                                        <input type="file"
                                               ref="fileInputField"
                                               onChange={this.handleFileChange}
                                               multiple="true"/>
                                    </RaisedButton>
                                </div>
                                <div className="file-wrapper" onClick={this.clickFolderInputField}
                                     style={{'width': '100%', 'maxWidth': '250px', 'margin': '10px'}}>
                                    <RaisedButton label="Select Folder" primary={true} style={{'width': '100%'}}>
                                        <input type="file"
                                               id="folderInputField"
                                               ref="folderInputField"
                                               onChange={this.handleFolderChange}
                                               multiple="true" />
                                    </RaisedButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
            )
        }
        else
        {
            return (

                <div className="FileUploadControls" style={{
                    'display': 'flex'
                }}>

                        <div className="file-wrapper" onClick={this.clickFileInputField}
                             style={{'width': '100%', 'maxWidth': '250px', 'margin': '10px'}}>
                            <RaisedButton
                                label="Add Files"
                                icon={<AddFileBtn/>}
                                primary={false} style={{'width': '100%'}}>
                                <input type="file"
                                       ref="fileInputField"
                                       onChange={this.handleFileChange}
                                       multiple="true"/>
                            </RaisedButton>
                        </div>
                        <div className="file-wrapper" onClick={this.clickFolderInputField}
                             style={{'width': '100%', 'maxWidth': '250px', 'margin': '10px'}}>
                            <RaisedButton
                                label="Add Folder"
                                icon={<AddFolderBtn/>}
                                primary={false} style={{'width': '100%'}}>
                                <input type="file"
                                       id="folderInputFieldMin"
                                       ref="folderInputFieldMin"
                                       onChange={this.handleFolderChange}
                                       multiple="true" />
                            </RaisedButton>
                        </div>

                </div>

            )
        }
    }

});

module.exports = FileUploadControls;
