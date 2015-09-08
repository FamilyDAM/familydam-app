
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
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var Glyphicon = require('react-bootstrap').Glyphicon;

var AppSidebar = require('../../components/appSidebar/AppSidebar');
var SectionTree = require('../../components/folderTree/SectionTree');
var FolderTree = require('../../components/folderTree/FolderTree');
var FileUploadView = require('../../components/fileUpload/FileUploadView')
var UploadActions = require('../../actions/UploadActions')

var NavigationActions = require('./../../actions/NavigationActions');

var UploadsView = React.createClass({


    getInitialState: function () {
        return {
            state: '100%'
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


    render: function() {

        var asideStyle = {};
        asideStyle['height'] = this.state.height;


        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-xs-4 col-sm-3 box" style={asideStyle}>
                        <ButtonGroup className="boxRow header">
                            <ButtonLink to="home" bsSize='medium' bsStyle="link"><Glyphicon glyph='home'/></ButtonLink>
                            <ButtonLink to="userManager" bsSize='medium' bsStyle="link"><Glyphicon
                                glyph='user'/></ButtonLink>
                            <ButtonLink to="files" bsSize='medium' bsStyle="link"><Glyphicon
                                glyph='search'/></ButtonLink>
                            <DropdownButton ref="dropDownSettings" bsSize='medium' glyph='cog'
                                            className="glyphicon glyphicon-cog">
                                <MenuItemLink eventKey="1" to="userManager">User Manager</MenuItemLink>
                                <MenuItemLink eventKey="2" to="login">Logout</MenuItemLink>
                            </DropdownButton>
                        </ButtonGroup>

                        <div className="boxRow content">
                            <SectionTree title="Folders" showAddFolder={true} navigateToFiles={true} baseDir="/dam:files/"/>
                        </div>

                        <div className="boxRow footer">
                            <AppSidebar />
                        </div>
                    </aside>


                    <section className="col-sm-9" style={{'borderLeft':'1px solid #eee'}}>
                        <FileUploadView />
                    </section>
                </div>
            </div>
        );
    }

});

module.exports = UploadsView;
