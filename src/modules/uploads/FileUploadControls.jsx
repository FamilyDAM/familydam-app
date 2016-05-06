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

    componentWillMount: function () { },

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

            item_.uploadPath = this.props.uploadPath;
            if (item_.webkitRelativePath != "" && item_.webkitRelativePath.length > 0)
            {
                item_.uploadPath = this.props.uploadPath + item_.webkitRelativePath.replace(item_.name, "");
            }
            item_.id = UUID.create().toString();
            UploadActions.addFileAction.onNext(item_);
        }.bind(this));

        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}
    },


    handleFolderChange: function (event_) {
        //console.dir(event_);
        var _files = event_.currentTarget.files;
        //console.dir(_files);

        Rx.Observable.from(_files).forEach(function (item_) {
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
            UploadActions.addFileAction.onNext(item_);
        }.bind(this));

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
     * Use jquery to click a hiddle file input field
     */
    clickFolderInputField: function () {
        $(this.refs.folderInputField).attr("webkitdirectory", "webkitdirectory");
        $(this.refs.folderInputField).click();
    },


    render: function () {


        return (
            <Paper className="FileUploadControls row" >
                <div className="col-xs-12" style={{'padding':'24px'}}>
                    <div className="row">
                        <div className="col-sm-6 hidden-xs-down background">
                        </div>

                        <div className="col-xs-12 col-sm-6"
                        style={{'display':'flex','flexDirection':'column','justifyContent':'center','alignItems':'center'}}>

                            <div className="file-wrapper" onClick={this.clickFileInputField}
                                 style={{'width':'100%','maxWidth':'250px', 'margin':'10px'}}>
                                <input type="file"
                                       ref="fileInputField"
                                       onChange={this.handleFileChange}
                                       style={{'display':'none'}}
                                       multiple="true"/>

                                <RaisedButton label="Select Files" primary={true} style={{'width':'100%'}}/>
                            </div>
                            <div className="file-wrapper" onClick={this.clickFolderInputField}
                                 style={{'width':'100%', 'maxWidth':'250px', 'margin':'10px'}}>
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
