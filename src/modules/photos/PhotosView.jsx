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

var Tags = require('./../../components/tags/Tags');
var PreviewSidebar = require("./../previews/PreviewSidebar");
var Tree = require('../../components/folderTree/Tree');
var SidebarSection = require('../../components/sidebarSection/SidebarSection');
var AppSidebar = require('../../components/appSidebar/AppSidebar');
var Fab = require('../../components/fab/UploadFab');
var IsotopeGallery = require('../../components/isotopeGallery/IsotopeGallery');
var TagList = require('./TagList');
var PeopleList = require('./PeopleList');
var DateTree = require('./DateTree');



module.exports =  React.createClass({

    getInitialState: function () {
        return {
            files: [],
            filters: {},
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



        this.filtersSubscription = PhotoStore.filters.subscribe(function(data_){
            this.state.filters = data_;

            //on Initial load, or when filters change run initial search to populate the view
            ImageActions.search.source.onNext(this.state.filters);

            if( this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.searchSubscription = ImageActions.search.sink.subscribe(function(data_){
            this.state.files = data_;
            if( this.isMounted()) this.forceUpdate();
        }.bind(this));

    },


    componentWillReceiveProps: function (nextProps) {
        //console.log("{PhotosView} componentWillReceiveProps");

    },

    componentWillUnmount: function () {
        window.removeEventListener("resize", this.updateDimensions);

        if( this.filtersSubscription !== undefined ) this.filtersSubscription.dispose();
        if( this.searchSubscription !== undefined ) this.filtersSubscription.dispose();
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


        try
        {

            return (

                <div className="photosView container-fluid">
                    <div className="row">

                        <aside className={asideClass} style={asideStyle}>

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
                            <div className="container-fluid photo-body">

                                <Tags
                                    title="Filters"
                                    tags={this.state.filters}/>

                                <IsotopeGallery
                                    id="group1"
                                    images={this.state.files}/>

                            </div>
                        </section>

                        <aside className={asideRightClass}>
                            <PreviewSidebar file={this.state.selectedItem}/>
                        </aside>
                    </div>


                    <Fab glyph="plus" linkTo="upload"/>

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



