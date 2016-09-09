/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var moment = require('moment');
import {Router, Link} from 'react-router';


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




var NodeActions = require('../../actions/NodeActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NavigationActions = require('../../actions/NavigationActions');

var FileStore = require('./../../stores/FileStore');
var DirectoryStore = require('./../../stores/DirectoryStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var UserStore = require('./../../stores/UserStore');

var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');
var PreviewSidebar = require("./../previews/PreviewSidebar.jsx");
var TreeList = require('../../components/folderTree/TreeList.jsx');
var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');
var SidebarSection = require('../../components/sidebarSection/SidebarSection.jsx');

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    getInitialState: function () {
        return {
            files: [],
            state: '100%',
            showAddFolderDialog: false,
            selectedPath: "/content/dam-files",
            addNodeRefs: [],
            treeData: [],
            isDirTreeLoading:false,
            canAddFile:false,
            canAddFolder:false,
            showDeleteConfirmation:false
        };
    },


    getDefaultProps:function(){
        return {
            baseDir: "/content/dam-files"
        };
    },


    componentWillMount: function () {

        //update selected path
        this.state.path = "/content/dam-files";
        if (this.props.location && this.props.location.query && this.props.location.query.path)
        {
            this.state.path = this.props.location.query.path;
        }
        this.state.selectedPath = this.state.path;


        //hide app sidebar
        NavigationActions.openAppSidebar.onNext(false);


        // update the Title
        NavigationActions.updateTitle.onNext({'label': 'File Browser'});


        // load files
        FileActions.getFiles.source.onNext(this.state.selectedPath);




        // listen for trigger to reload for files in directory
        this.refreshDirectoriesSubscription = DirectoryActions.refreshDirectories.subscribe(function (data_) {
            DirectoryActions.getDirectories.source.onNext(this.props.baseDir);
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
            FileActions.getFiles.source.onNext("");
            FileActions.getFiles.source.onNext(_path);
        }.bind(this));


        // Refresh the file list when someone changes the directory
        this.selectFolderSubscription = DirectoryStore.currentFolder.distinctUntilChanged().subscribe(function (data_) {

            var _canWrite = false;
            if( UserStore.getCurrentUser().isFamilyAdmin || data_.path.startsWith("/content/dam-files/" +UserStore.getCurrentUser().username)  )
            {
                _canWrite = true;
            }

            if( data_.path != this.state.selectedPath)
            {
                FileActions.getFiles.source.onNext(data_.path);
            }
            this.setState({'selectedPath': data_.path, canAddFolder: _canWrite, canAddFile: _canWrite});



        }.bind(this));


        //Listen for directory changes
        this.directoriesSubscription = DirectoryStore.directories.subscribe(function (data_) {
            var isChild = false;
            for (var i = 0; i < this.state.addNodeRefs.length; i++)
            {
                var obj = this.state.addNodeRefs[i];

                for (var j = 0; j < data_.length; j++)
                {
                    var dataObj = data_[j];
                    if (obj.path == dataObj.parent)
                    {
                        isChild = true;
                        obj.children.push(dataObj);

                        this.state.addNodeRefs.push(dataObj);

                    }
                }
            }

            if (!isChild && data_ !== undefined && data_.length > 0)
            {
                this.state.treeData = data_;
                for (var i = 0; i < data_.length; i++)
                {
                    this.state.addNodeRefs.push(data_[i]);
                }
            }
            
            this.state.isDirTreeLoading = false;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        // load directories
        this.state.isDirTreeLoading = true;
        DirectoryActions.getDirectories.source.onNext(this.props.baseDir);


        // Listener to show/hide spinner
        this.getFilesSourceSubscription = FileActions.getFiles.source.subscribe(function(data_){}.bind(this))
        this.getFilesSinkSubscription = FileActions.getFiles.sink.subscribe(function(data_){}.bind(this))


        mixpanel.track("Enter Files View");
    },


    componentWillReceiveProps: function (nextProps) {
        //console.log("{FilesView} componentWillReceiveProps");
        if (nextProps.location.query !== undefined && nextProps.location.query.path !== undefined)
        {
            var _path = nextProps.location.query.path;

            // upload local state, and reset list to prepare for new files
            this.setState({'path': _path, 'files': []});

            // load files
            FileActions.getFiles.source.onNext("");
            FileActions.getFiles.source.onNext(_path);
        } else
        {
            FileActions.getFiles.source.onNext(PreferenceStore.getRootDirectory());
        }

        // reload directories
        DirectoryActions.getDirectories.source.onNext(this.props.baseDir);

    },

    componentWillUnmount: function () {

        if (this.fileStoreSubscription) {
            this.fileStoreSubscription.dispose();
        }
        if (this.refreshFilesSubscription) {
            this.refreshFilesSubscription.dispose();
        }
        if (this.selectFolderSubscription) {
            this.selectFolderSubscription.dispose();
        }
        if (this.selectedFileSubscription) {
            this.selectedFileSubscription.dispose();
        }
        if (this.currentFolderSubscription) {
            this.currentFolderSubscription.dispose();
        }
        if (this.createFolderSubscription) {
            this.createFolderSubscription.dispose();
        }
        if (this.directoriesSubscription) {
            this.directoriesSubscription.dispose();
        }
        if( this.getFilesSourceSubscription ){
            this.getFilesSourceSubscription.dispose();
        }
        if( this.getFilesSinkSubscription ){
            this.getFilesSinkSubscription.dispose();
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
        this.setState({'showDeleteConfirmation':true, 'pendingFileToDelete':_path});
    },

    _onNodeDeleteConfirmation: function (event, component) {
        NodeActions.deleteNode.source.onNext({'path': this.state.pendingFileToDelete});
        this.setState({'showDeleteConfirmation':false, 'pendingFileToDelete':''});
    },


    _onDirClick: function (e) {
        e.preventDefault();
        //<Link to={{pathname: '/files', query:{'path':dir_.path}}}>
        this.context.router.transitionTo({pathname: '/files', query: {'path': dir_.path}});

        mixpanel.track("FilesView: Change Folder");
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

        const deleteActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={()=>{this.setState({'showDeleteConfirmation':false})}}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onTouchTap={this._onNodeDeleteConfirmation}
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
                            <div style={{'display':'flex', 'alignItems':'center'}}>
                                <FolderIcon
                                    style={{'width':'25px', 'height':'25px', 'minWidth':'25px', 'minHeight':'25px'}}/>
                                <span style={{'paddingLeft':'10px'}}><Link
                                    to={{pathname: '/files', query:{'path':dir_.path}}}>{dir_.name}</Link></span>
                            </div>
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

                    var _dt = moment(Date.parse(file_['jcr:created'])).format("MM/DD/YYYY");

                    return (
                        <TableRow key={file_.path}>
                            <TableRowColumn colSpan="2">
                                    <Link to={ {pathname:'photos/details',query:{'path': file_.path}} }><img
                                        src={file_._links.thumb}
                                        style={{'width':'50px', 'height':'50px', 'minWidth':'50px', 'minHeight':'50px','cursor':'pointer'}}/></Link>
                                    <span style={{'paddingLeft':'10px','cursor':'pointer'}}><Link
                                        to={{pathname: 'photos/details', query:{'path':file_.path}}}><span>{file_.name}</span></Link></span>

                            </TableRowColumn>
                            <TableRowColumn colSpan="1">{_dt}</TableRowColumn>
                            <TableRowColumn colSpan="1" style={{'display':'flex','alignItems':'center'}}>

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
                            <TableRowColumn colSpan="1" style={{'display':'flex','alignItems':'center'}}>
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




        return (
            <div style={{'display':'flex', 'flexDirection':'column', 'minHeight':'calc(100vh - 65px)'}}>
                <Toolbar style={{'display':'flex', 'height':'50px', 'alignItems':'center'}}>
                    <ToolbarGroup firstChild={true}  style={{'flexGrow':1, 'justifyContent':'flex-start', 'float':'left'}}>
                        <IconButton iconClassName="material-icons">folder</IconButton>

                    </ToolbarGroup>
                    <ToolbarGroup style={{'flexGrow':0, 'justifyContent':'flex-end', 'float':'right'}}>

                        <ToolbarSeparator/>

                        <FlatButton
                            label="Add Files"
                            primary={true}
                            disabled={!this.state.canAddFile}
                            onTouchTap={()=>{ this.context.router.push('/upload')}}
                            icon={<IconButton iconClassName="material-icons">file_upload</IconButton>}
                        />

                        <FlatButton
                            label="New Folder"
                            primary={true}
                            disabled={!this.state.canAddFolder}
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


                <Dialog
                    title="Delete Confirmation"
                    actions={deleteActions}
                    modal={true}
                    open={this.state.showDeleteConfirmation}
                >
                    <div>
                        Are you sure you want to delete this file or folder?
                    </div>
                </Dialog>


                <div style={{'display':'flex', 'flexDirection':'row', 'flexGrow':1, 'justifyContent':'space-around'}}>
                    <div
                        style={{'display':'flex', 'flexDirection':'column', 'flexGrow':0, 'flexShrink':0, 'minWidth':'240px', 'margin':'20px'}}>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'250px'}}>
                            <TreeList
                                isLoading={this.state.isDirTreeLoading}
                                title="Files"
                                data={this.state.treeData}
                                onSelect={(path_)=>{
                                        FileActions.getFiles.source.onNext(path_);
                                        DirectoryActions.selectFolder.onNext({path: path_});
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
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn colSpan="2">Name</TableHeaderColumn>
                                        <TableHeaderColumn colSpan="1">Created</TableHeaderColumn>
                                        <TableHeaderColumn colSpan="1">Actions</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}
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



