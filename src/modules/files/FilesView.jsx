
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var IS = require('is_js');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Table = require('react-bootstrap').Table;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var SectionTree = require('../../components/folderTree/SectionTree');


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


var FilesView = React.createClass({
    mixins : [Navigation],


    getInitialState: function(){
        return {
            files:[],
            selectedItem: undefined,
            state:'100%'
        };
    },



    componentWillMount:function(){
        //console.log("{FilesView} componentWillMount");

        var _this = this;
        this.state.path = "/dam:files/";

        if( this.props.query && this.props.query.path )
        {
            this.state.path = this.props.query.path;
        }

        // save current dir
        //DirectoryActions.selectFolder.onNext(this.state.path);
        // load files
        FileActions.getFiles.source.onNext(this.state.path);

        // update the breadcrumb
        var _pathData = {'label':'Files', 'navigateTo':"files", 'params':{}, 'level':1};
        NavigationActions.currentPath.onNext( _pathData );


        // rx callbacks
        this.fileStoreSubscription = FileStore.files.subscribe(function(data_){

            _this.state.files = data_;
            if (_this.isMounted())  _this.forceUpdate();
        });


        // listen for trigger to reload for files in directory
        this.refreshFilesSubscription = FileActions.refreshFiles.subscribe(function(data_){
            FileActions.getFiles.source.onNext( undefined );
            FileActions.getFiles.source.onNext( _this.state.path );
        });

        // Refresh the file list when someone changes the directory
        this.selectFolderSubscription = DirectoryActions.selectFolder.subscribe(function(data_){
            FileActions.getFiles.source.onNext(data_.path);
        });

        // Refresh the file list when someone changes the directory
        this.selectedFileSubscription = FileActions.selectFile.subscribe(function(data_){
            _this.state.selectedItem = data_;
            if (_this.isMounted())  _this.forceUpdate();
        });
    },


    componentWillReceiveProps:function(nextProps)
    {
        //console.log("{FilesView} componentWillReceiveProps");

        var _path = nextProps.query.path;

        // upload local state, and reset list to prepare for new files
        this.setState({'path':_path, 'files':[]});

        // load files
        FileActions.getFiles.source.onNext(_path);
    },

    componentWillUnmount: function() {
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

        window.removeEventListener("resize", this.updateDimensions);
    },

    componentDidMount: function() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    },

    updateDimensions: function() {
        this.setState({width: $(window).width(), height: ($(window).height()-130)+'px'});
    },


    render: function() {

        var _this = this;
        var tableClass = "col-xs-8 col-sm-9 col-md-9";
        var asideClass = "hidden col-md-3";

        if( this.state.selectedItem !== undefined )
        {
            tableClass = "col-xs-8 col-sm-9 col-md-6";
            asideClass = "hidden-xs hidden-sm col-md-3";
        };



        var folderRows = this.state.files
            .filter( function(dir_){
                return dir_._class == "com.familydam.core.models.Directory";
            }).map( function(dir_, indx){
                return <DirectoryRow  key={indx} dir={dir_}/>
            });


        var fileRows = this.state.files
            .filter( function(file_){
                return file_._class == "com.familydam.core.models.File";
            }).map( function(file_, indx){
                return <FileRow key={indx} file={file_}/>
            });

        var sectionStyle = {};
        sectionStyle['borderLeft'] = '1px solid #cccccc';
        sectionStyle['overflow'] = 'scroll';
        sectionStyle['height'] = this.state.height ;


        return (
            <div className="filesView container-fluid" >
                <div  className="row">
                    <aside className="col-xs-4 col-sm-3" >
                        <SectionTree title="Local Files" showAddFolder={true} navigateToFiles={true} baseDir="/dam:files/"/>
                        <SectionTree title="Cloud Files" disabled={true}/>
                    </aside>

                    <section className={tableClass} style={sectionStyle}>
                        <div className="container-fluid fileRows">
                            <div className="row" style={{'borderBottom':'1px solid #000'}}>
                                <div className="col-xs-2 col-sm-1"></div>
                                <div className="col-xs-10 col-sm-11">Name</div>
                            </div>

                            <BackFolder/>

                            {folderRows}

                            {fileRows}

                        </div>

                    </section>

                    <aside className={asideClass}>
                        <PreviewSidebar file={this.state.selectedItem}/>
                    </aside>
                </div>



                <div id="fab-button-group" >
                    <div className="fab  show-on-hover dropup">
                        <div data-toggle="tooltip" data-placement="left" title="Compose">
                            <button type="button" className="btn btn-material-lightblue btn-io dropdown-toggle"
                                    data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                        <Link to="upload" style={{'color':'#fff'}}>
                                            <Glyphicon glyph="plus"
                                                       className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                       style={{'fontSize': '24px;'}}></Glyphicon>
                                        </Link>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                    </span>
                            </button>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-right" role="menu">
                        </ul>
                    </div>
                </div>
            </div>

        );
    }

});

module.exports = FilesView;


