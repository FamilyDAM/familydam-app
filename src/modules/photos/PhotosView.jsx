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
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var Dropdown = require('react-bootstrap').Dropdown;

var NodeActions = require('../../actions/NodeActions');
var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NavigationActions = require('../../actions/NavigationActions');
var ImageActions = require('../../actions/ImageActions');

var FileStore = require('./../../stores/FileStore');
var DirectoryStore = require('./../../stores/DirectoryStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var UserStore = require('./../../stores/UserStore');
var PhotoStore = require('./../../stores/PhotoStore');

var PreviewSidebar = require("./../previews/PreviewSidebar");
var Tree = require('../../components/folderTree/Tree');
var SidebarSection = require('../../components/sidebarSection/SidebarSection');
var AppSidebar = require('../../components/appSidebar/AppSidebar');
var TagList = require('./TagList');
var PeopleList = require('./PeopleList');
var DateTree = require('./DateTree');


module.exports =  React.createClass({

    getInitialState: function () {
        return {
            files: [],
            selectedItem: undefined,
            state: '100%',
            showAddFolder: false
        };
    },


    componentWillMount: function () {
        var _this = this;

        console.log("{PhotosView} componentWillMount");

        // update the breadcrumb
        var _pathData = {'label': 'Photos', 'navigateTo': "photos", 'params': {}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);

        // run initial search to populate the view
        //ImageActions.search.source.onNext(PhotoStore.filters.value);

    },


    componentWillReceiveProps: function (nextProps) {
        //console.log("{PhotosView} componentWillReceiveProps");

    },

    componentWillUnmount: function () {
        window.removeEventListener("resize", this.updateDimensions);
    },

    componentDidMount: function () {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    },

    updateDimensions: function () {
        this.setState({width: $(window).width(), height: ($(window).height() - 130) + 'px'});
    },

    addFilter: function(data){
        ImageActions.addFilter.onNext(data);
    },

    handleLogout:function(event_){
        //todo, logout and redirect back to /
    },

    render: function () {

        var _this = this;
        var tableClass = "col-xs-8 col-sm-9 col-md-9";
        var asideClass = "col-xs-4 col-sm-3 col-md-3 box";
        var asideRightClass = "hidden col-xs-4 col-sm-3 col-md-3";

        if (this.state.selectedItem !== undefined && this.state.selectedItem !== null)
        {
            tableClass = "col-xs-8 col-sm-9 col-md-6";
            asideClass = "hidden-xs hidden-sm col-md-3 box";
            asideRightClass = "hidden-xs hidden-sm col-md-3";
        }


        var asideStyle = {};
        asideStyle['height'] = this.state.height;

        var sectionStyle = {};
        sectionStyle['borderLeft'] = '1px solid #cccccc';
        sectionStyle['overflow'] = 'scroll';
        sectionStyle['height'] = this.state.height;


        try
        {
            return (

                <div className="filesView container-fluid">
                    <div className="row">

                        <aside className={asideClass} style={asideStyle}>

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



                            <div className="boxRow content" style={{'minHeight':'200px'}}>
                                <SidebarSection label="Filter by folder" open={true}>
                                    <Tree
                                        baseDir="/dam:files/"/>
                                </SidebarSection>
                                <br/>
                                <SidebarSection label="Filter by date" open={true}>
                                    <DateTree
                                        onSelect={this.addFilter}/>
                                </SidebarSection>
                                <br/>
                                <SidebarSection label="Filter by people" open={true}>
                                    <PeopleList
                                        onSelect={this.addFilter}/>
                                </SidebarSection>
                                <br/>
                                <SidebarSection label="Filter by tag" open={true}>
                                    <TagList
                                        onSelect={this.addFilter}/>
                                </SidebarSection>

                            </div>


                            <div className=" boxRow footer">
                                <AppSidebar />
                            </div>

                        </aside>

                        <section className={tableClass} style={sectionStyle}>
                            <div className="container-fluid fileRows">


                            </div>
                        </section>

                        <aside className={asideRightClass}>
                            <PreviewSidebar file={this.state.selectedItem}/>
                        </aside>
                    </div>


                    <div id="fab-button-group">
                        <div className="fab  show-on-hover dropup">
                            <div data-toggle="tooltip" data-placement="left" title="Compose">
                                <button type="button" className="btn btn-material-lightblue btn-io dropdown-toggle"
                                        data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                        <Link to="upload" style={{'color':'#fff'}}>
                                            <Glyphicon glyph="plus"
                                                       className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                       style={{'fontSize': '24px'}}></Glyphicon>
                                        </Link>

                                    </span>
                                </button>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-right" role="menu">
                            </ul>
                        </div>
                    </div>

                    <br/>
                </div>
            );
        }catch(err_){
            debugger;
            console.log(err_);
            return(<div>{err_}</div>);
        }
    }

});



