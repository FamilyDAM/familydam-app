
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
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var FileUploadView = require('./FileUploadView');
var AppSidebar = require('../../components/appSidebar/AppSidebar');
var Tree = require('../../components/folderTree/Tree');
var FolderTree = require('../../components/folderTree/FolderTree');
var UploadActions = require('../../actions/UploadActions');

var NavigationActions = require('./../../actions/NavigationActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var SidebarSection = require('../../components/sidebarSection/SidebarSection');


/**
 * TODO: remove bullet list in css
 * TODO: hash the path and file name for the key attribute to reduce the chance of unique key errors
 * TODO: Add file size to display
 */
module.exports = React.createClass({

    getInitialState: function () {
        return {
            state: '100%',
            showAddFolder:false
        };
    },

    componentWillMount: function(){
        var _this = this;

        // update the breadcrumb
        var _pathData = {'label': 'Upload Files', 'navigateTo': "upload", 'params': {}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);

    },

    componentDidMount: function () {
        this.updateDimensions();
    },

    updateDimensions: function () {
        this.setState({width: $(window).width(), height: ($(window).height() - 130) + 'px'});
    },


    handleAddFolder: function (event_) {
        this.setState({showAddFolder: true});
    },


    render: function() {

        var tableClass = "card main-content col-xs-8 col-sm-9 col-md-9 col-lg-10";
        var asideClass = "box body-sidebar col-xs-4 col-sm-3 col-md-3 col-lg-2";

        var asideStyle = {};
        asideStyle['height'] = this.state.height;

        var sectionStyle = {};

        try
        {
            return (
                <div className="uploadView container-fluid">
                    <div className="row">

                        <aside className={asideClass} style={asideStyle}>
                            <div className="boxRow content" style={{'minHeight':'200px'}}>
                                <SidebarSection label="Files" open={true} showAddFolder={true} onAddFolder={this.handleAddFolder}>
                                    <Tree
                                        baseDir="/dam:files/"
                                        onSelect={(path_)=>{
                                            FileActions.getFiles.source.onNext(path_.path);
                                            DirectoryActions.selectFolder.onNext({path: path_.path});
                                        }}/>
                                </SidebarSection>
                            </div>


                            <div className=" boxRow footer">
                                <AppSidebar />
                            </div>
                        </aside>


                        <section className={tableClass} style={sectionStyle}>
                            <FileUploadView />
                        </section>
                    </div>
                </div>
            );
        }catch(err){
            console.log(err);
        }
    }

});


