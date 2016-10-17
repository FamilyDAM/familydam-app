/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';

import {
    Dialog,
    FlatButton,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator
} from 'material-ui';


var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');

var FileUploadView = require('./FileUploadView.jsx');
//var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');
//var Tree = require('../../components/folderTree/Tree.jsx');
//var FolderTree = require('../../components/folderTree/FolderTree.jsx');
//var SidebarSection = require('../../components/sidebarSection/SidebarSection.jsx');

var UploadActions = require('../../actions/UploadActions');
var NavigationActions = require('./../../actions/NavigationActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');

var DirectoryStore = require("../../stores/DirectoryStore");
var UserStore = require("../../stores/UserStore");


/**
 * TODO: remove bullet list in css
 * TODO: hash the path and file name for the key attribute to reduce the chance of unique key errors
 * TODO: Add file size to display
 */
module.exports = React.createClass({


    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        var _defaultPath = DirectoryStore.contentFileRoot + UserStore.getCurrentUser().username;

        return {
            state: '100%',
            uploadPath: _defaultPath,
            showAddFolder: false,
            showUploadProgressDialog: false,
            enableClose: false,
            enableRetry: false,
            completedFiles: 0,
            errorFiles: 0,
            totalFiles: 0,
            currentFile: "",
            uploadMessage: ""
        };
    },

    componentWillMount: function () {
        var _this = this;

        // update the Title
        NavigationActions.updateTitle.onNext({'label': 'Upload Files'});

        this.currentFolderSubscription = DirectoryStore.currentFolder.subscribe(function (d_) {
            var _uploadPath = d_.path;
            if (d_.path.substring(d_.path.length - 1) != "/") {
                _uploadPath = d_.path + "/";
            }

            this.state.currentFolder = d_.path;
            this.state.uploadPath = _uploadPath;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        // upload dialog status actions
        this.startUploadSubscription = UploadActions.startUpload.subscribe(function (data_) {
            //this.state.totalFiles = data_.count;
            //this.state.showUploadProgressDialog = true;

            this.setState({"totalFiles": data_.count, "showUploadProgressDialog": true});
            //if( this.isMounted() ) this.forceUpdate();
        }.bind(this));


        this.UploadStartedSubscription = UploadActions.uploadStarted.subscribe(function (data_) {
            //this.state.totalFiles = this.state.totalFiles+1;

            if (data_.webkitRelativePath.length > 0) {
                this.setState({"currentFile": data_.webkitRelativePath});
                //this.state.currentFile = data_.webkitRelativePath;
            } else {
                this.setState({"currentFile": data_.name});
                //this.state.currentFile = data_.name;
            }
            //if( this.isMounted() ) this.forceUpdate();
        }.bind(this));


        this.UploadCompleteSubscription = UploadActions.uploadCompleted.subscribe(function (data_) {

            var stateProps = {};
            stateProps.completedFiles = this.state.completedFiles + 1;
            stateProps.currentFile = "";

            var _totals = this.state.completedFiles + this.state.errorFiles;
            if (this.state.totalFiles >= _totals) {
                stateProps.enableClose = true;
                stateProps.enableRetry = this.state.errorFiles > 0;
            }

            this.setState(stateProps);

        }.bind(this));


        this.UploadErrorSubscription = UploadActions.uploadError.subscribe(function (data_) {
            //this.state.currentFile = "";
            this.setState({"errorFiles": this.state.errorFiles + 1});

            //if( this.isMounted() ) this.forceUpdate();
        }.bind(this));


        this.UploadMessageSubscription = UploadActions.uploadMessage.subscribe(function (data_) {
            //this.state.currentFile = "";
            if (data_.substr(0, 1) != "{") {
                this.setState({'uploadMessage': "Completed", "enableClose": true});
            } else {
                this.setState({'uploadMessage': data_});
            }
            //if( this.isMounted() ) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function () {
        if (this.currentFolderSubscription !== undefined) {
            this.currentFolderSubscription.dispose();
        }

        if (this.startUploadSubscription) this.UploadCompleteSubscription.dispose();
        if (this.UploadStartedSubscription) this.UploadStartedSubscription.dispose();
        if (this.UploadErrorSubscription) this.UploadCompleteSubscription.dispose();
        if (this.UploadCompleteSubscription) this.UploadCompleteSubscription.dispose();
        if (this.UploadMessageSubscription) this.UploadMessageSubscription.dispose();
    },


    handleDialogClose: function () {
        this.setState({
            showUploadProgressDialog: false,
            enableClose: false,
            enableRetry: false,
            completedFiles: 0,
            errorFiles: 0,
            totalFiles: 0
        });

        UploadActions.removeAllFilesAction.onNext(true);
    },


    render: function () {

        const actions = [
            /* <FlatButton
             label="Retry"
             primary={true}
             disabled={!this.state.enableRetry}
             onTouchTap={this.handleDialogClose}
             />, */
            <FlatButton
                label="Close"
                primary={true}
                disabled={!this.state.enableClose}
                onClick={this.handleDialogClose}
            />,
        ];


        return (

            <div className="row" style={{'backgroundColor': 'rgb(245, 245, 245)'}}>
                <Paper className="col-xs-12" style={{'backgroundColor': 'rgb(245, 245, 245)'}}>
                    <Toolbar style={{'backgroundColor': 'rgb(245, 245, 245)'}}>
                        <ToolbarGroup firstChild={true} style={{'float': 'left'}}>
                            <IconButton iconClassName="material-icons">folder</IconButton>
                            <Breadcrumb path={this.state.currentFolder}/>
                        </ToolbarGroup>
                        <ToolbarGroup style={{'float': 'left'}}>

                        </ToolbarGroup>
                    </Toolbar>
                </Paper>

                <div className="col-xs-11 col-offset-1" style={{'top': '24px', 'flexGrow': '1'}}>

                    <FileUploadView
                        currentFolder={this.state.currentFolder}
                        uploadPath={this.state.uploadPath}/>

                    <Dialog
                        title="Upload Progress"
                        actions={actions}
                        modal={true}
                        open={this.state.showUploadProgressDialog}
                    >
                        {(() => {
                            if (this.state.totalFiles > 0) {
                                return (
                                    <div>
                                        Total File Progress {this.state.completedFiles} / {this.state.totalFiles}
                                        ({this.state.errorFiles} Errors)
                                        <br/><br/>
                                        <LinearProgress
                                            mode="determinate"
                                            max={this.state.totalFiles}
                                            min={this.state.completedFiles}
                                            style={{'height': '10px'}}/>
                                        <br/>
                                        <span>{this.state.uploadMessage}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>
                                        Preparing Files
                                        <LinearProgress
                                            mode="indeterminate"
                                            style={{'height': '10px'}}/>
                                    </div>
                                );
                            }
                        })()}


                    </Dialog>
                </div>
            </div>


        )
    },

});


