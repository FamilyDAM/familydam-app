/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var ButtonGroup = require('react-bootstrap').ButtonGroup;

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var MenuItem = require('react-bootstrap').MenuItem;

var Modal = require('react-bootstrap').Modal;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var NodeActions = require('../../actions/NodeActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NavigationActions = require('../../actions/NavigationActions');

var FileStore = require('./../../stores/FileStore');
var DirectoryStore = require('./../../stores/DirectoryStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var UserStore = require('./../../stores/UserStore');


var FileRow = require("./FileRow");
var DirectoryRow = require("./DirectoryRow");
var BackFolder = require("./BackFolder");
var PreviewSidebar = require("./../previews/PreviewSidebar");
var Tree = require('../../components/folderTree/Tree');
var AppSidebar = require('../../components/appSidebar/AppSidebar');
var SidebarSection = require('../../components/sidebarSection/SidebarSection');
var Fab = require('../../components/fab/UploadFab');

module.exports = React.createClass({

    getInitialState: function () {
        return {
            files: [],
            selectedItem: undefined,
            state: '100%',
            showAddFolder: false,
            selectedPath: "/dam:files/"
        };
    },


    componentWillMount: function () {
        var _this = this;
        console.log("{FilesView} componentWillMount");


        // update the breadcrumb
        var _pathData = {'label': 'Files', 'navigateTo': "files", 'params': {}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);


        this.state.path = "/dam:files/";
        if (this.props.query && this.props.query.path)
        {
            this.state.path = this.props.query.path;
        }
        this.state.selectedPath = this.state.path;


        // save current dir
        //DirectoryActions.selectFolder.onNext(this.state.path);
        // load files
        FileActions.getFiles.source.onNext(this.state.selectedPath);

        var getFilesSubscription = FileActions.getFiles.source.subscribe(function (path_) {
            this.state.selectedPath = path_;
        }.bind(this));


        // rx callbacks
        this.fileStoreSubscription = FileStore.files.subscribe(function (data_) {
            _this.state.files = data_;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        // listen for trigger to reload for files in directory
        this.refreshFilesSubscription = FileActions.refreshFiles.subscribe(function (data_) {
            var _path = this.state.selectedPath;
            FileActions.getFiles.source.onNext(undefined);
            FileActions.getFiles.source.onNext(_path);
        }.bind(this));

        // Refresh the file list when someone changes the directory
        this.selectFolderSubscription = DirectoryStore.currentFolder.subscribe(function (data_) {
            FileActions.getFiles.source.onNext(data_.path);


            _this.state.selectedPath = data_.path;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));

        // Refresh the file list when someone changes the directory
        this.selectedFileSubscription = FileActions.selectFile.subscribe(function (data_) {
            _this.state.selectedItem = data_;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        /**
         * Add Folder Modal
         */
            // listen for the selected dir.
        this.currentFolderSubscription = DirectoryStore.currentFolder.subscribe(function (data_) {
            _this.state.parent = data_;
            if (_this.isMounted()) _this.forceUpdate();
        }.bind(this));

        // listen for save complete, then hide
        this.createFolderSubscription = DirectoryActions.createFolder.sink.subscribe(function (data_) {
            _this.closeAddFolderModal();
            if (_this.isMounted()) _this.forceUpdate();
        }, function (error_) {
            alert(error_.statusText);
        }.bind(this));
    },


    componentWillReceiveProps: function (nextProps) {
        //console.log("{FilesView} componentWillReceiveProps");
        if( nextProps.query !== undefined && nextProps.query.path !== undefined )
        {
            var _path = nextProps.query.path;

            // upload local state, and reset list to prepare for new files
            this.setState({'path': _path, 'files': []});

            // load files
            FileActions.getFiles.source.onNext(_path);
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


    handleAddFolder: function (event_) {
        this.setState({showAddFolder: true});
    },


    closeAddFolderModal: function (event_) {
        this.setState({showAddFolder: false});
    },


    handleCreateFolder: function (event_) {
        var _path = this.state.selectedPath;
        var _name = this.refs.folderName.getDOMNode().value;
        DirectoryActions.createFolder.source.onNext({'path': _path, 'name': _name})
    },


    render: function () {

        var _this = this;
        var tableClass = "card main-content col-xs-8 col-sm-9 col-md-9 col-lg-10";
        var asideClass = "box body-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2";
        var asideRightClass = "card hidden col-xs-4 col-sm-3 col-md-3";

        if (this.state.selectedItem !== undefined && this.state.selectedItem !== null)
        {
            tableClass = "card main-content col-xs-8 col-sm-9 col-md-6 col-lg-7";
            asideClass = "box body-sidebar hidden-xs hidden-sm col-md-3 col-lg-2";
            asideRightClass = "card hidden-xs hidden-sm col-md-3 col-lg-3";
        }

        var asideStyle = {};
        asideStyle['height'] = this.state.height;

        var sectionStyle = {};
        //sectionStyle['overflow'] = 'scroll';
        //sectionStyle['height'] = this.state.height;


        var _folders = this.state.files
            .filter(function (dir_) {
                return dir_._class == "com.familydam.core.models.Directory";
            }).map(function (dir_, indx) {
                return <DirectoryRow key={dir_.id} dir={dir_}/>
            });


        var _files = this.state.files
            .filter(function (file_) {
                return file_._class == "com.familydam.core.models.File" || file_._class == "com.familydam.core.models.DamImage";
            }).map(function (file_, index_) {
                return <FileRow key={file_.id} file={file_}/>
            });



        return (

            <div className="filesView container-fluid">
                <div className="row">

                    <aside className={asideClass} style={asideStyle}>
                        <div className="boxRow content" style={{'minHeight':'200px'}}>
                            <SidebarSection label="Files" open={true} showAddFolder={true} onAddFolder={this.handleAddFolder}>
                                <Tree
                                    baseDir="/dam:files/"
                                    onSelect={(path_)=>{
                                        FileActions.getFiles.source.onNext(path_);
                                        DirectoryActions.selectFolder.onNext({path: path_});
                                    }}/>
                            </SidebarSection>
                        </div>


                        <div className=" boxRow footer">
                            <AppSidebar />
                        </div>

                    </aside>

                    <section className={tableClass} style={sectionStyle}>
                        <div className="container-fluid fileRows">

                            <BackFolder path={this.state.selectedPath}/>

                            <div>
                            {_folders}
                            </div>

                            <div>
                            {_files}
                            </div>

                        </div>

                    </section>

                    <aside className={asideRightClass} style={{'marginTop':'-25px'}}>
                        <PreviewSidebar file={this.state.selectedItem}/>
                    </aside>
                </div>


                <Fab glyph="plus" linkTo="upload"/>


                <Modal title="Add Folder"
                       animation={false}
                       show={this.state.showAddFolder}
                       onHide={this.closeAddFolderModal}>
                    <div className="modal-body">
                        <h4>Create a new sub folder</h4>
                        {this.state.selectedPath} <input type="text" ref="folderName" label="Folder Name"/>
                    </div>
                    <div className="modal-footer">
                        <ButtonGroup>
                            <Button onClick={this.closeAddFolderModal}>Close</Button>
                            <Button onClick={this.handleCreateFolder}>Create</Button>
                        </ButtonGroup>
                    </div>
                </Modal>
            </div>


        );
    }

});



