/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';

import {
    IconButton,
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
            showAddFolder: false
        };
    },

    componentWillMount: function () {
        var _this = this;

        // update the Title
        NavigationActions.updateTitle.onNext({'label': 'Upload Files'});

        this.currentFolderSubscription = DirectoryStore.currentFolder.subscribe(function (d_) {

            var _uploadPath = d_.path;
            if (d_.path.substring(d_.path.length - 1) != "/")
            {
                _uploadPath = d_.path + "/";
            }


            this.setState({'currentFolder': d_.path, "uploadPath": _uploadPath});
        }.bind(this));
    },

    componentWillUnmount: function () {
        if (this.currentFolderSubscription !== undefined)
        {
            this.currentFolderSubscription.dispose();
        }
    },


    render: function () {

        return (

            <div className="row" style={{'backgroundColor':'rgb(245, 245, 245)'}}>
                <Paper className="col-xs-12" style={{'backgroundColor':'rgb(245, 245, 245)'}}>
                    <Toolbar style={{'backgroundColor':'rgb(245, 245, 245)'}}>
                        <ToolbarGroup firstChild={true} float="left">
                            <IconButton iconClassName="material-icons">folder</IconButton>
                            <Breadcrumb path={this.state.currentFolder}/>
                        </ToolbarGroup>
                        <ToolbarGroup float="right">

                        </ToolbarGroup>
                    </Toolbar>
                </Paper>

                <div className="col-xs-10 col-offset-1" style={{'top':'24px', 'flexGrow': '1'}}>

                    <FileUploadView
                        currentFolder={this.state.currentFolder}
                        uploadPath={this.state.uploadPath}/>

                </div>
            </div>


        )
    },

});


