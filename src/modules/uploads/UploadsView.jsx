
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

var AppSidebar = require('../../components/appSidebar/AppSidebar');
var SectionTree = require('../../components/folderTree/SectionTree');
var FolderTree = require('../../components/folderTree/FolderTree');
var FileUploadView = require('../../components/fileUpload/FileUploadView');
var UploadActions = require('../../actions/UploadActions');

var NavigationActions = require('./../../actions/NavigationActions');

module.exports = React.createClass({


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


        try
        {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <aside className="col-xs-4 col-sm-3 box" style={asideStyle}>
                            <ButtonGroup className="boxRow header">
                                <LinkContainer to="/dashboard">
                                    <Button><Glyphicon glyph='home'/></Button>
                                </LinkContainer>
                                <LinkContainer to="/">
                                    <Button><Glyphicon glyph='user'/></Button>
                                </LinkContainer>
                                <LinkContainer to="/">
                                    <Button><Glyphicon glyph='search'/></Button>
                                </LinkContainer>


                                <Dropdown id='dropdown-custom-1'>
                                    <Dropdown.Toggle>
                                        <Glyphicon glyph='cog'/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='super-colors'>
                                        <MenuItem eventKey="1" to="userManager">User Manager</MenuItem>
                                        <MenuItem eventKey="2" to="login">Logout</MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
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
        }catch(err){
            debugger;
            console.log(err);
        }
    }

});


