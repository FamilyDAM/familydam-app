/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';

import {
    AppBar,
    Chip,
    DropDownMenu,
    IconButton,
    MenuItem,
    Paper,
    Subheader,
    StarBorder
} from 'material-ui';
import NavigationClose from 'material-ui/svg-icons/navigation/close';



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

var TagList = require('./TagList.jsx');
var PeopleList = require('./PeopleList.jsx');
var DateTree = require('./DateTree.jsx');
var PhotoActions = require('./PhotoActions.jsx');

var LoadingIcon = require('../../components/loadingIcon/LoadingIcon.jsx');
var MaterialGallery = require('../../components/gallery/MaterialGallery.jsx');

var Tags = require('./../../components/tags/Tags.jsx');
var PreviewSidebar = require("./../previews/PreviewSidebar.jsx");
var TreeList = require('../../components/folderTree/TreeList.jsx');
var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');




module.exports = React.createClass({

    getInitialState: function () {
        return {
            files: [],
            filters: {},
            selectedPath: "",
            selectedItem: undefined,
            selectedImages: [],
            state: '100%',
            showAddFolder: false,
            bodyWidth: 0,
            addNodeRefs: [],
            treeData: [],
            isLoading: true,
            isAddDataLoaded: false,
            isDirTreeLoading:false,
            isDateTreeLoading:false,
            isPeopleTreeLoading:false,
            isTagTreeLoading:false,
            openPreview:false,
            offset:0,
            groupBy:'date:day'
        };
    },


    getDefaultProps: function () {
        return {
            baseDir: "/content"
        };
    },

    componentWillMount: function () {

        //console.log("{PhotosView} componentWillMount");

        // update the breadcrumb
        var _pathData = {'label': 'Photos', 'navigateTo': "photos", 'params': {}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);


        this.filtersSubscription = PhotoStore.filters.subscribe(function (data_) {
            this.state.filters = data_;

            //on Initial load, or when filters change run initial search to populate the view
            ImageActions.search.source.onNext({'filters':this.state.filters, 'offset':this.state.offset});

            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.searchSubscription = ImageActions.search.sink.subscribe(function (data_) {

            if( data_.length == 0 ){
                this.state.isAddDataLoaded = true;
            }else{
                this.state.isAddDataLoaded = false;
            }


            for(var item in data_){
                var val = data_[item].value;
                var groupFound = false;

                for(var group in this.state.files){
                    if( this.state.files[group].value == val ){
                        groupFound = true;
                        this.state.files[group].children = this.state.files[group].children.concat(data_[item].children);
                        break;
                    }
                }

                if( !groupFound ){
                    this.state.files.push( data_[item] );
                }
            }

            this.setState({'files': this.state.files, 'isLoading': false});

        }.bind(this));


        // listen for trigger to reload for files in directory
        this.refreshDirectoriesSubscription = DirectoryActions.refreshDirectories.subscribe(function (data_) {
            DirectoryActions.getDirectories.source.onNext(undefined);
            DirectoryActions.getDirectories.source.onNext(this.props.baseDir);
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

        mixpanel.track("Enter Photos View");
    },


    componentWillUnmount: function () {
        window.removeEventListener("scroll", this.handleScroll);

        if (this.filtersSubscription !== undefined) this.filtersSubscription.dispose();
        if (this.searchSubscription !== undefined) this.filtersSubscription.dispose();
        if (this.directoriesSubscription !== undefined) this.directoriesSubscription.dispose();
        if (this.refreshDirectoriesSubscription !== undefined) this.refreshDirectoriesSubscription.dispose();
    },


    componentDidMount: function () {
        //debugger;
        //window.addEventListener("scrollX", this.handleScroll);
        //window.addEventListener("scrollY", this.handleScroll);
        window.addEventListener("scroll", this.handleScroll);
    },



    handleScroll: function (event_) {

        if( !this.state.isLoading ) {
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
                // you're at the bottom of the page
                //console.log("SCROLL - near the bottom");
                if( !this.state.isAddDataLoaded ) {
                    this.state.isLoading = true;
                    this.state.offset = this.state.offset + 1;
                    ImageActions.search.source.onNext({
                        'filters': this.state.filters,
                        'offset': this.state.offset
                    });
                }
            }
        }
    },


    handleLogout: function (event_) {
        //todo, logout and redirect back to /
    },


    handleActionClose: function (event_) {

        this.state.selectedImages = [];
        this.state.openPreview = false;

        for (var key in this.state.files)
        {
            for (var i = 0; i < this.state.files[key].children.length; i++)
            {
                var _file = this.state.files[key].children[i];
                _file.active = false;
            }
        }

        if (this.isMounted()) this.forceUpdate();
    },


    handleImageToggle: function () {

        this.state.selectedImages = [];

        for (var key in this.state.files)
        {
            for (var i = 0; i < this.state.files[key].children.length; i++)
            {
                var _file = this.state.files[key].children[i];
                if (_file.active)
                {
                    this.state.selectedImages.push(_file);
                }
            }
        }

        if( this.state.selectedImages.length>0 ) {
            this.state.openPreview = true;
        }else{
            this.state.openPreview = false;
        }
        if (this.isMounted()) this.forceUpdate();
    },


    handleGroupByChange: function(event_, key_, payload_) {
        this.setState({'files': [], 'isLoading': true, 'groupBy':payload_});

        var data = {};
        data.type = "group";
        data.name = payload_;
        ImageActions.addFilter.onNext(data);
    },

    removeFilter: function (data) {
        this.setState({'files': [], 'isLoading': true});
        ImageActions.removeFilter.onNext(data);
    },

    addFilter: function (data) {
        //criteria has changed, reset defaults
        this.setState({'files': [], 'isLoading': true, 'offset':0});

        if (data.type == "path")
        {
            data.name = data.path;
            mixpanel.track("PhotosView: Add PATH filter");
        } else if (data.type == "date")
        {
            data.name = data.key;
            mixpanel.track("PhotosView: Add DATE filter");
        }
        ImageActions.addFilter.onNext(data);
    },

    addFreeFormFilter: function (data) {
        var _type = "tag";
        var _name = data;

        if (data.indexOf(":") > -1)
        {
            _type = data.substr(0, data.indexOf(":"));
            _name = data.substr(data.indexOf(":") + 1);
        }

        var isNew = false;
        if (_type === "path")
        {
            for (var k = 0; k < this.state.filters.paths.length; k++)
            {
                var _path = this.state.filters.paths[k];
                if (_path.name == _name)
                {
                    isNew = true;
                    break;
                }
            }
            mixpanel.track("PhotosView: Add PATH filter");
        }
        else if (_type === "date")
        {
            for (var i = 0; i < this.state.filters.date.length; i++)
            {
                var _date = this.state.filters.date[i];
                if (_date.name == _name)
                {
                    isNew = true;
                    break;
                }
            }
            mixpanel.track("PhotosView: Add DATE filter");
        }
        else if (_type === "people")
        {
            for (var i = 0; i < this.state.filters.people.length; i++)
            {
                var _people = this.state.filters.people[i];
                if (_people.name == _name)
                {
                    isNew = true;
                    break;
                }
            }
            mixpanel.track("PhotosView: Add PEOPLE filter");
        }
        else if (_type === "tag")
        {
            for (var i = 0; i < this.state.filters.tags.length; i++)
            {
                var _tag = this.state.filters.tags[i];
                if (_tag.name == _name)
                {
                    isNew = true;
                    break;
                }
            }
            mixpanel.track("PhotosView: Add TAG filter");
        }


        if (!isNew)
        {
            this.setState({'files': [], 'isLoading': true});

            if (data.indexOf(":") > -1)
            {
                ImageActions.addFilter.onNext({type: _type, name: _name});
            } else
            {
                ImageActions.addFilter.onNext({type: "tag", name: _name});
                ImageActions.addFilter.onNext({type: "people", name: _name});
            }
        }
    },

    renderChip(data_) {
        return (
            <Chip
                key={data_.path +"_" +Math.random()}
                onRequestDelete={() => {
                    this.removeFilter(data_);
                }}
                style={{'margin':'4px'}}>
                {data_.name}
            </Chip>
        );
    },


    render: function () {

        var _leftSidebar = {
            display:'flex',
            flexDirection:'column',
            flexGrow:0,
            flexShrink:0,
            width:'240px',
            margin:'20px'};

        if( this.state.openPreview ){
            _leftSidebar['display'] = 'none';
        };


        var _rightSidebar = {
            display:'none',
            flexDirection:'column',
            flexGrow:0,
            flexShrink:0,
            width:'0px',
            margin:'20px'};

        if( this.state.openPreview ){
            _rightSidebar['display'] = 'flex';
            _rightSidebar['width'] = '25%';
        };


        var _displayLoadingMessage = false;
        if( this.state.isLoading ){//&& this.state.offset>0 ){
            _displayLoadingMessage = true;
        };

        return (
            <div style={{'display':'flex', 'flexDirection':'column', 'minHeight':'calc(100vh - 65px)'}}>

                <div className="container-fluid photo-body" style={{'width':'100%', 'marginTop':'10px'}}>
                    <div className="row">
                        <div className="col-xs-12" style={{'fontSize':'14px', 'display': 'flex', 'flexWrap': 'wrap'}}>
                            {this.state.filters.date.map(this.renderChip, this)}
                            {this.state.filters.people.map(this.renderChip, this)}
                            {this.state.filters.tags.map(this.renderChip, this)}
                            {this.state.filters.paths.map(this.renderChip, this)}
                        </div>
                    </div>
                </div>

                <div style={{'display':'flex', 'flexDirection':'row', 'flexGrow':1, 'justifyContent':'space-around'}}>
                    <div
                        style={_leftSidebar}>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'75px'}}>
                            <div className="row" style={{'width':'100%'}}>
                                <div className="col-xs-12">
                                    <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>Group Photos</Subheader>
                                    <DropDownMenu onChange={this.handleGroupByChange} value={this.state.groupBy}>
                                        <MenuItem value={"date:day"} primaryText="Group By Day"/>
                                        <MenuItem value={"date:month"} primaryText="Group By Month"/>
                                        <MenuItem value={"date:year"}  primaryText="Group By Year"/>
                                    </DropDownMenu>
                                </div>
                            </div>
                        </Paper>
                        <br/>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'250px'}}>
                            <TreeList
                                title="Filter Photos By Path"
                                isLoading={this.state.isDirTreeLoading}
                                data={this.state.treeData}
                                onSelect={(path_)=>{
                                    var e = {'type':"path", 'path': path_};
                                    this.addFilter(e);
                                }}/>
                        </Paper>
                        <br/>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'200px'}}>
                            <DateTree
                                title="Filter Photos By Date"
                                onSelect={(e_)=>{
                                e_.type = "date";
                                this.addFilter(e_);
                            }}/>
                        </Paper>
                        <br/>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'200px'}}>
                            <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'center'}}>
                                <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>Filter Photos By People</Subheader>
                                {(() => {
                                    if( this.state.isPeopleTreeLoading )
                                    {
                                        <div style={{'display':'flex', 'alignItems':'flex-end'}}>
                                            <LoadingIcon color="#757575" style={{'width':'36px', 'height':'36px'}}/>
                                        </div>
                                    }
                                })()}
                            </div>
                            <PeopleList
                                onSelect={this.addFilter}/>
                        </Paper>
                        <br/>
                        <Paper zDepth={1} style={{'backgroundColor':'#fff', 'minHeight':'200px'}}>
                            <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'center'}}>
                                <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>Filter Photos By Tags</Subheader>
                                {(() => {
                                    if( this.state.isTagTreeLoading )
                                    {
                                        <div style={{'display':'flex', 'alignItems':'flex-end'}}>
                                            <LoadingIcon color="#757575" style={{'width':'36px', 'height':'36px'}}/>
                                        </div>
                                    }
                                })()}
                            </div>

                            <TagList
                                onSelect={this.addFilter}/>
                        </Paper>
                    </div>


                    <div style={{'display':'flex', 'flexGrow':1, 'margin':'20px'}}>
                        <Paper zDepth={2} style={{'flexGrow':1}}>
                            <MaterialGallery
                                onChange={this.handleImageToggle}
                                isLoading={this.state.isLoading}
                                files={this.state.files}/>

                            <div style={{'width':'100%', 'height':'65px', 'clear':'left', 'textAlign':'center', 'display': _displayLoadingMessage?'block':'none'}}>
                                <span style={{'lineHeight':'65px', 'textAlign':'center'}}>
                                   <LoadingIcon color="#757575" style={{'width':'36px', 'height':'36px'}}/> Loading More
                                </span>
                            </div>

                        </Paper>

                    </div>


                    <Paper
                        style={_rightSidebar}
                        zDepth={2}>

                        <AppBar title="Photo Actions"
                                iconElementLeft={<IconButton onTouchTap={this.handleActionClose}><NavigationClose /></IconButton>}/>
                        <PhotoActions
                            images={this.state.selectedImages}/>

                    </Paper>
                </div>
            </div>


        )
    }



});



