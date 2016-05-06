/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';
var Moment = require('moment');

import {
    Avatar,
    Dialog,
    FlatButton,
    List,
    ListItem,
    Paper,
    IconButton,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn,
    TextField,
    Subheader,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator
} from 'material-ui';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import FileIcon from 'material-ui/svg-icons/action/description';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';

var LinkContainer = require('react-router-bootstrap').LinkContainer;


var NodeActions = require('../../actions/NodeActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NavigationActions = require('../../actions/NavigationActions');

var FileStore = require('./../../stores/FileStore');
var DirectoryStore = require('./../../stores/DirectoryStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var UserStore = require('./../../stores/UserStore');

var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');
var FileRow = require("./FileRow.jsx");
var DirectoryRow = require("./DirectoryRow.jsx");
var BackFolder = require("./BackFolder.jsx");
var PreviewSidebar = require("./../previews/PreviewSidebar.jsx");
var TreeList = require('../../components/folderTree/TreeList.jsx');
var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');
var SidebarSection = require('../../components/sidebarSection/SidebarSection.jsx');
var Fab = require('../../components/fab/UploadFab.jsx');

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    getInitialState: function () {
        return {
            files: [],
            selectedItem: undefined,
            state: '100%',
            showAddFolderDialog: false,
            selectedPath: "/content/dam-files"
        };
    },


    componentWillMount: function () {
        var _this = this;

        // update the Title
        NavigationActions.updateTitle.onNext({'label': 'File Browser'});


        this.state.path = "/content/dam-files";
        if (this.props.location && this.props.location.query && this.props.location.query.path)
        {
            this.state.path = this.props.location.query.path;
        }
        this.state.selectedPath = this.state.path;

        //Show sidebar
        NavigationActions.openAppSidebar.onNext(false);

        // save current dir
        //DirectoryActions.selectFolder.onNext(this.state.path);
        // load files
        FileActions.getFiles.source.onNext(this.state.selectedPath);

        var getFilesSubscription = FileActions.getFiles.source.subscribe(function (path_) {
            this.state.selectedPath = path_;

        }.bind(this));


        // rx callbacks
        this.fileStoreSubscription = FileStore.files.subscribe(function (data_) {
            if (data_ !== undefined && data_ !== undefined)
            {
                this.setState({'files': data_});
            } else
            {
                this.setState({'files': []});
            }
        }.bind(this));


        // listen for trigger to reload for files in directory
        this.refreshFilesSubscription = FileActions.refreshFiles.subscribe(function (data_) {
            var _path = this.state.selectedPath;

            FileActions.getFiles.source.onNext(undefined);
            FileActions.getFiles.source.onNext(_path);
        }.bind(this));

        // Refresh the file list when someone changes the directory
        this.selectFolderSubscription = DirectoryStore.currentFolder.distinctUntilChanged().subscribe(function (data_) {
            FileActions.getFiles.source.onNext(data_.path);
            _this.setState({'selectedPath': data_.path});
        }.bind(this));

        // Refresh the file list when someone changes the directory
        this.selectedFileSubscription = FileActions.selectFile.subscribe(function (data_) {
            _this.setState({'selectedItem': data_});
        }.bind(this));


        /**
         * Add Folder Modal
         */
        // listen for the selected dir.
        this.currentFolderSubscription = DirectoryStore.currentFolder.subscribe(function (data_) {
            _this.setState({'parent': data_});
        }.bind(this));

        // listen for save complete, then hide
        this.createFolderSubscription = DirectoryActions.createFolder.sink.subscribe(function (data_) {
            if (_this.isMounted()) _this.forceUpdate();
        }, function (error_) {
            debugger;
            //todo show toast
            //console.dir(error_);
        }.bind(this));
    },


    componentWillReceiveProps: function (nextProps) {
        //console.log("{FilesView} componentWillReceiveProps");
        if (nextProps.location.query !== undefined && nextProps.location.query.path !== undefined)
        {
            var _path = nextProps.location.query.path;

            // upload local state, and reset list to prepare for new files
            this.setState({'path': _path, 'files': []});

            // load files
            FileActions.getFiles.source.onNext(_path);
        } else
        {
            FileActions.getFiles.source.onNext(PreferenceStore.getRootDirectory());
        }
    },

    componentWillUnmount: function () {
        if (this.getFilesSubscription !== undefined)
        {
            this.getFilesSubscription.dispose();
        }
        if (this.fileStoreSubscription !== undefined)
        {
            this.fileStoreSubscription.dispose();
        }
        if (this.refreshFilesSubscription !== undefined)
        {
            this.refreshFilesSubscription.dispose();
        }
        if (this.selectFolderSubscription !== undefined)
        {
            this.selectFolderSubscription.dispose();
        }
        if (this.selectedFileSubscription !== undefined)
        {
            this.selectedFileSubscription.dispose();
        }
        if (this.currentFolderSubscription !== undefined)
        {
            this.currentFolderSubscription.dispose();
        }
        if (this.createFolderSubscription !== undefined)
        {
            this.createFolderSubscription.dispose();
        }

        window.removeEventListener("resize", this.updateDimensions);
    },

    componentDidMount: function () {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    },

    updateDimensions: function () {
        this.setState({width: $(window).width(), height: ($(window).height() - 130) + 'px'});
    },

    _onNodeDelete: function (event, component) {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        var _path = $(event.currentTarget).attr("data-path");

        NodeActions.deleteNode.source.onNext({'path': _path});
    },


    _onDirClick: function (e) {
        e.preventDefault();
        //<Link to={{pathname: '/files', query:{'path':dir_.path}}}>
        this.context.router.transitionTo({pathname: '/files', query: {'path': dir_.path}});
    },

    _onAddFolder: function (e) {
        var _name = this.refs.newFolderName.getValue().trim();
        if (_name.length > 0)
        {
            this.refs.newFolderName.getInputNode().value = ""
            this.setState({'showAddFolderDialog': false});

            var _path = this.state.selectedPath;
            DirectoryActions.createFolder.source.onNext({'path': _path, 'name': _name})
        } else
        {
            //todo show error message
        }
    },

    render: function () {

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={()=>{this.setState({'showAddFolderDialog':false})}}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onTouchTap={this._onAddFolder}
            />,
        ];


        var folderRows = this.state.files
            .filter(function (data_) {
                return data_["jcr:primaryType"] === "nt:folder" || data_["jcr:primaryType"] === "sling:Folder";
            }).map(function (dir_, index_) {
                //return <DirectoryRow key={dir_.path} dir={dir_}/>
                return (
                    <TableRow key={'dir-' +index_}>
                        <TableRowColumn colSpan="2"
                            onTouchTap={() => {this.context.router.push({pathname:'/files', query:{'path':dir_.path}}) }}>
                            <FolderIcon
                                style={{'width':'25px', 'height':'25px', 'minWidth':'25px', 'minHeight':'25px'}}/>
                            <span style={{'paddingLeft':'10px'}}><Link
                                to={{pathname: '/files', query:{'path':dir_.path}}}>{dir_.name}</Link></span>
                        </TableRowColumn>
                        <TableRowColumn colSpan="1"></TableRowColumn>
                        <TableRowColumn colSpan="1">
                            {(() => {
                                if (dir_._links.delete)
                                {
                                    return (<IconButton iconClassName="material-icons"
                                                        onClick={this._onNodeDelete}
                                                        data-path={dir_._links.delete}>delete</IconButton> );
                                }
                            })()}
                        </TableRowColumn>
                    </TableRow>
                );
            }.bind(this));


        var fileRows = this.state.files
            .filter(function (data_) {
                return data_["jcr:primaryType"] === "nt:file";
            }).map(function (file_, index_) {


                if (file_ !== undefined && file_['jcr:mixinTypes'] !== undefined && file_['jcr:mixinTypes'].indexOf("dam:image") > -1)
                {

                    var _dt = Moment(Date.parse(file_['jcr:created'])).format("MM/DD/YYYY");

                    return (
                        <TableRow key={file_.path}>
                            <TableRowColumn colSpan="2">
                                    <LinkContainer to={ {pathname:'photos/details',query:{'path': file_.path}} }><img
                                        src={file_._links.thumb}
                                        style={{'width':'50px', 'height':'50px', 'minWidth':'50px', 'minHeight':'50px','cursor':'pointer'}}/></LinkContainer>
                                    <span style={{'paddingLeft':'10px','cursor':'pointer'}}><Link
                                        to={{pathname: 'photos/details', query:{'path':file_.path}}}>{file_.name}</Link></span>

                            </TableRowColumn>
                            <TableRowColumn colSpan="1">{_dt}</TableRowColumn>
                            <TableRowColumn colSpan="1">

                                <IconButton iconClassName="material-icons"
                                            onClick={() => {this.context.router.push({pathname:'photos/details', query:{path:file_.path}}) }}>launch</IconButton>

                                <IconButton iconClassName="material-icons"
                                            onClick={()=>{this.context.router.push({pathname:'photos/edit', query:{path:file_.path}}) }}>edit</IconButton>

                                <a href={file_.path} download><IconButton iconClassName="material-icons"
                                                                          data-path={file_._links.download}>file_download</IconButton></a>

                                {(() => {
                                    if (file_._links.delete)
                                    {
                                        return (<IconButton iconClassName="material-icons"
                                                            onClick={this._onNodeDelete}
                                                            data-path={file_._links.delete}>delete</IconButton> );
                                    }
                                })()}
                            </TableRowColumn>
                        </TableRow>
                    );
                }
                else
                {
                    return (
                        <TableRow key={file_.path}>
                            <TableRowColumn colSpan="2">
                                <div  style={{'display':'flex','alignItems':'center'}}>
                                    <FileIcon/>
                                    <span style={{'paddingLeft':'10px'}}>{file_.name}</span>
                                </div>
                            </TableRowColumn>
                            <TableRowColumn colSpan="1"></TableRowColumn>
                            <TableRowColumn colSpan="1">
                                <a href={file_.path} download><IconButton iconClassName="material-icons"
                                                                          data-path={file_._links.download}>file_download</IconButton></a>

                                {(() => {
                                    if (file_._links.delete)
                                    {
                                        return (<IconButton iconClassName="material-icons"
                                                            onClick={this._onNodeDelete}
                                                            data-path={file_._links.delete}>delete</IconButton> );
                                    }
                                })()}
                            </TableRowColumn>
                        </TableRow>
                    );
                }

            }.bind(this));



        // todo for mobile, use these
        //<LinkContainer to="upload"><IconButton iconClassName="material-icons">file_upload</IconButton></LinkContainer>
        //<IconButton iconClassName="material-icons" onTouchTap={()=>{this.setState({'showAddFolderDialog':true})}}>create_new_folder</IconButton>


        return (
            <div style={{'display':'flex', 'flexDirection':'column', 'minHeight':'calc(100vh - 65px)'}}>
                <Toolbar style={{'display':'flex', 'height':'50px', 'alignItems':'center'}}>
                    <ToolbarGroup firstChild={true} float="left" style={{'flexGrow':1, 'justifyContent':'flex-start'}}>
                        <IconButton iconClassName="material-icons">folder</IconButton>
                        <Breadcrumb path={this.state.selectedPath}/>
                    </ToolbarGroup>
                    <ToolbarGroup float="right"  style={{'flexGrow':0, 'justifyContent':'flex-end'}}>

                        <ToolbarSeparator/>

                        <FlatButton
                            label="Upload"
                            linkButton={true}
                            primary={true}
                            onTouchTap={()=>{ this.context.router.push('/upload')}}
                            icon={<IconButton iconClassName="material-icons">file_upload</IconButton>}
                        />

                        <FlatButton
                            label="Add Folder"
                            linkButton={true}
                            primary={true}
                            onTouchTap={()=>{this.setState({'showAddFolderDialog':true})}}
                            icon={<IconButton iconClassName="material-icons">create_new_folder</IconButton>}
                        />

                    </ToolbarGroup>
                </Toolbar>

                <Dialog
                    title="Add Folder"
                    actions={actions}
                    modal={true}
                    open={this.state.showAddFolderDialog}
                >
                    <TextField
                        ref="newFolderName"
                        hintText="Hint Text"
                        floatingLabelText="Folder Name"
                    />
                </Dialog>


                <div style={{'display':'flex', 'flexDirection':'row', 'flexGrow':1, 'justifyContent':'space-around', }}>
                    <div
                        style={{'display':'flex', 'flexDirection':'column', 'flexGrow':0, 'flexShrink':0, 'minWidth':'240px', 'margin':'20px'}}
                        zDepth={0}>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'250px'}}>
                            <TreeList
                                title="Files"
                                baseDir="/content/dam-files"
                                onSelect={(path_)=>{
                                        FileActions.getFiles.source.onNext(path_.path);
                                        DirectoryActions.selectFolder.onNext({path: path_.path});
                                    }}/>
                        </Paper>
                    </div>


                    <div style={{'display':'flex', 'flexGrow':1, 'margin':'20px'}}>
                        <Paper zDepth={2}>
                            <Table
                                fixedHeader={true}
                                fixedFooter={true}
                                selectable={true}
                                multiSelectable={true}
                                onRowSelection={this._onRowSelection}
                            >
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderColumn colSpan="2">Name</TableHeaderColumn>
                                        <TableHeaderColumn colSpan="1">Owner</TableHeaderColumn>
                                        <TableHeaderColumn colSpan="1">Actions</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={true}
                                    deselectOnClickaway={false}
                                    showRowHover={true}
                                    stripedRows={false}>

                                    {folderRows}

                                    {fileRows}

                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </div>
            </div>

        )
    }


});



