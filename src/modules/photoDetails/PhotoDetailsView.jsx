/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Used in TodoApp
var React = require('react');
var moment = require('moment');
var Keymaster = require('keymaster');
import {
    Router,
    Link
} from 'react-router';

import {
    Chip,
    Dialog,
    FlatButton,
    IconButton,
    Paper,
    RaisedButton,
    Subheader,
    Tabs,
    Tab
} from 'material-ui';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ChipInput from 'material-ui-chip-input';

var Rating = require('react-rating');

var Tags = require('./../../components/tags/Tags.jsx');
var ExifMap = require('./../../components/exifMap/ExifMap.jsx');
var ExifData = require('./../../components/exifData/ExifData.jsx');
var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');

var UserStore = require('./../../stores/UserStore');
var SearchStore = require('./../../stores/SearchStore');
var PrefabserenceStore = require('./../../stores/PreferenceStore');
var ContentStore = require('./../../stores/ContentStore');

var NodeActions = require('./../../actions/NodeActions');
var NavigationActions = require('./../../actions/NavigationActions');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            path: ""
            , photo: undefined
            , datetaken: 'Date Unknown'
            , location: ""
            , prevId: undefined
            , nextId: undefined
            , showDeleteConfirmation: false
        };
    },

    /**
     * Load the images in the root folder
     */
    componentWillMount: function () {
        var _this = this;

        var _path = this.props.location.query.path;
        this.setState({'path': _path});
        NodeActions.getNode.source.onNext(_path);

        // update the breadcrumb
        var _pathData = {'label': 'Photos', 'navigateTo': "photos", 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);


        this.registerListeners();

        Keymaster("left", function (e_) {
            //console.log("left");
            e_.stopImmediatePropagation();
            if (_this.state.prevId)
            {
                _this.history.pushState(null, 'photo/' + _this.state.prevId);
            }
        });
        Keymaster("right", function (e_) {
            //console.log("right");
            e_.stopImmediatePropagation();
            if (_this.state.nextId)
            {
                _this.history.pushState(null, 'photo/' + _this.state.nextId);
            }
        });

        mixpanel.track("Enter Photo Details View");
    },


    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;

        this.state.photo = undefined;
        if (this.isMounted()) this.forceUpdate();

        var _path = nextProps.location.query.path;
        NodeActions.getNode.source.onNext(_path);
    },


    componentWillUnmount: function (nextProps) {
        this.state.photo = undefined;

        if (this.currentNodeSubscription !== undefined)
        {
            this.currentNodeSubscription.dispose();
        }
        if (this.searchStoreSubscription !== undefined)
        {
            this.searchStoreSubscription.dispose();
        }
    },


    registerListeners: function (id_) {

        var _this = this;


        // list for results
        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (results) {


            results = results._embedded;

            var _pathData2 = {
                'label': results.name,
                'navigateTo': "photos/details?path=" + results.path,
                'level': 2
            };
            NavigationActions.currentPath.onNext(_pathData2);

            // set defaults for missing props
            if (!results['dam:tags'])
            {
                results['dam:tags'] = [];
            }
            if (!results['dam:people'])
            {
                results['dam:people'] = [];
            }
            if (!results['dam:note'])
            {
                results['dam:note'] = "";
            }


            // in case the server returns a single item, instead of an array of 1, convert it back to an array for render .map() function
            if( typeof results['dam:people'] === 'string' ){
                var _name = results['dam:people'];
                results['dam:people'] = [];
                results['dam:people'].push(_name);
            }

            if( typeof results['dam:tags'] === 'string' ){
                var _tag = results['dam:tags'];
                results['dam:tags'] = [];
                results['dam:tags'].push(_tag);
            }


            // set some local props for easier rendering
            var imagePath = results._links.resize.replace("{size}", 1024).replace("{format}", "jpg");
            var rating = results['dam:rating'] ? results['dam:rating'] : 0;
            var datetaken = results['jcr:created'];

            var datetaken = "";
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['Exif IFD0'] != undefined
                && results['dam:metadata']['Exif IFD0']['Date_Time'] != undefined
                && results['dam:metadata']['Exif IFD0']['Date_Time']['description'] != undefined)
            {
                var datetaken = results['dam:metadata']['Exif IFD0']['Date_Time']['description'];
            }


            var gps = undefined;
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['GPS'] != undefined)
            {
                var gps = results['dam:metadata']['GPS'];
            }


            var _location = results._links.self;

            var _datetaken = moment(datetaken, "YYYYMMDD HH:mm:ss").format("LLL");
            if (_datetaken == "Invalid date")
            {
                _datetaken = datetaken;
            }


            this.subscribe(results);


            var _state = {
                'photo': results,
                'location': _location,
                'imagePath': imagePath,
                'rating': rating,
                'datetaken': _datetaken,
                'gps': gps,
                'prevId': undefined,
                'nextId': undefined
            };

            this.setState(_state);

        }.bind(this), function (error) {
            console.dir(error);
        });

    },

    subscribe: function (photos_) {
        // Find the NEXT and PREV image
        this.searchStoreSubscription = SearchStore.results.subscribe(function (data_) {
            var _prevId = undefined;
            var _nextId = undefined;
            // find index, previous item, and next item
            var index = -1;
            for (var i = 0; i < data_.length; i++)
            {
                var obj = data_[i];
                if (obj.id == photos_['jcr:uuid'])
                {
                    index = i;

                    if (i > 0)
                    {
                        _prevId = data_[i - 1].id;
                    }
                    if (i < (photos_.length - 1))
                    {
                        _nextId = data_[i + 1].id;
                    }

                    break;
                }
            }

            if (this.isMounted())  this.setState({'prevId': _prevId, 'nextId': _nextId});
        }.bind(this));

    },


    save: function (property_, val_, patch_) {

        var _path = this.state.photo.path;


        var _data = {'path': _path, props: {}};
        _data.props[property_] = val_;
        if( patch_ ){
            _data.props[property_ +"@Patch"] = "true";
        }


        //$(this.refs.savingLabel.getDOMNode()).show();
        //window.status = "Saving Changes";

        NodeActions.updateNode.source.onNext(_data);

        NodeActions.updateNode.sink.subscribe(
            function (id_) {
                //do nothing on successful save
                //$(this.refs.savingLabel.getDOMNode()).hide();
            }.bind(this), function (err_) {
                alert(err_.status + ":" + err_.statusText + "\n" + err_.responseText);
            }.bind(this));
    },


    handleRatingChange: function (rating_) {
        this.state.rating = rating_;
        this.state.photo['dam:rating'] = rating_;
        if (this.isMounted()) this.forceUpdate();
        this.save("dam:rating", rating_, false);
    },

    handleOnNoteChange: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        if (this.isMounted()) this.forceUpdate();
    },

    handleOnNoteBlur: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        if (this.isMounted()) this.forceUpdate();
        this.save("dam:note", event_.target.value, false);
    },

    handleOnTagAdd: function (tag_) {
        if (this.state.photo['dam:tags'] == undefined)
        {
            this.state.photo['dam:tags'] = [];
        }

        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos == -1)
        {
            this.state.photo['dam:tags'].push(tag_);
            if (this.isMounted()) this.forceUpdate();
            this.save("dam:tags", "+" +tag_, true);
        }
    },

    handleOnTagRemove: function (tag_) {
        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos > -1)
        {
            this.state.photo['dam:tags'].splice(pos, 1);
            if (this.isMounted()) this.forceUpdate();
            this.save("dam:tags", "-" +tag_, true);
        }
    },

    handleOnPeopleAdd: function (people_) {

        var pos = this.state.photo['dam:people'].indexOf(people_);
        if (pos == -1)
        {
            this.state.photo['dam:people'].push(people_);
            if (this.isMounted()) this.forceUpdate();
            this.save("dam:people", "+" +people_, true);
        }
    },


    handleOnPeopleRemove: function (people_) {

        var pos = this.state.photo['dam:people'].indexOf(people_);
        if (pos > -1)
        {
            this.state.photo['dam:people'].splice(pos, 1);
            if (this.isMounted()) this.forceUpdate();
            this.save("dam:people", "-" +people_, true);
        }
    },


    handleDelete: function () {
        window.scrollTo(0, 0);
        this.setState({'showDeleteConfirmation': true});
    },

    handleDeleteConfirmation: function () {
        NodeActions.deleteNode.source.onNext({'path': this.state.path});
        this.setState({'showDeleteConfirmation': false});
        // go back to the page that loaded this image
        window.history.back();
    },


    render: function () {
        const deleteActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => {
                    this.setState({'showDeleteConfirmation': false})
                }}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onTouchTap={this.handleDeleteConfirmation}
            />,
        ];

        if (this.state.photo == undefined)
        {
            return (<div/>);
        }


        return (
            <div>
                <div style={{'display': 'flex', 'flexDirection': 'column', 'height': '55px'}}>
                    <Toolbar style={{'display': 'flex', 'height': '50px', 'alignItems': 'center'}}>
                        <ToolbarGroup firstChild={true}
                                      style={{'flexGrow': 1, 'justifyContent': 'flex-start', 'float': 'left', 'alignItems':'center'}}>

                            <BackIcon
                                style={{'marginLeft':'10px'}}
                                onClick={() => {
                                    window.history.go(-1);
                                }}/>

                            <Breadcrumb path={this.state.path.substring(0, this.state.path.lastIndexOf('/')+1)} style={{'marginLeft': '-10px;'}}/>

                        </ToolbarGroup>
                        <ToolbarGroup style={{'flexGrow': 0, 'justifyContent': 'flex-end', 'float': 'right'}}>

                        </ToolbarGroup>
                    </Toolbar>
                </div>

                <div className="photoDetailsView container-fluid">

                    <Dialog
                        title="Delete Confirmation"
                        actions={deleteActions}
                        modal={true}
                        open={this.state.showDeleteConfirmation}
                    >
                        <div>
                            Are you sure you want to delete this image?
                        </div>
                    </Dialog>

                    <Paper className="row">
                        <section className="col-sm-12">
                            <div className="container-fluid" style={{'padding':'2rem'}}>
                                <div className="row">
                                    <div className="col-sm-1 col-md-2">
                                        {this.state.prevId ?
                                            <Link to={'photo/' + this.state.prevId }>
                                                <Glyphicon glyph="chevron-left" style={{
                                                    'fontSize': '48px',
                                                    'color': '#eee',
                                                    'top': '200px'
                                                }}/>
                                            </Link>
                                            : ''}
                                    </div>
                                    <div className="col-sm-10 col-md-8"
                                         style={{'display': 'flex', 'justifyContent': 'center'}}>
                                        <img id="editableImage"
                                             ref="editableImage"
                                             src={this.state.imagePath}
                                             style={{'height': '500px', 'justifyContent': 'center'}}
                                             className="center-block"/>
                                    </div>
                                    <div className="col-sm-1 col-md-2">
                                        {this.state.nextId ?
                                            <Link to={'photo/' + this.state.nextId }>
                                                <Glyphicon glyph="chevron-right" style={{
                                                    'fontSize': '48px',
                                                    'color': '#eee',
                                                    'top': '200px'
                                                }}/>
                                            </Link>
                                            : ''}
                                    </div>
                                </div>


                                <div className="row">
                                    <br/>
                                    <hr style={{'width': '100%'}}/>
                                </div>


                                <div className="row">
                                    <div className="col-sm-6">

                                        <a href={this.state.location} download><img
                                            src="assets/icons/ic_file_download_24px.svg" style={{
                                            'width': '36px',
                                            'height': '36px'
                                        }}/></a>

                                        <img src="assets/icons/ic_delete_24px.svg" style={{
                                            'width': '36px',
                                            'height': '36px'
                                        }} onClick={this.handleDelete}/>

                                    </div>

                                    <div className="col-sm-6">
                                        <span style={{'fontSize': '24px'}}> {this.state.datetaken} </span>

                                        <br/>

                                        <Rating
                                            empty="fa fa-star-o fa-2x"
                                            full="fa fa-star fa-2x"
                                            initialRate={this.state.rating}
                                            onChange={this.handleRatingChange}/>
                                    </div>

                                </div>


                                <div className="row">
                                    <hr style={{'width': '100%'}}/>
                                    <br/>
                                </div>

                                <div className="row">
                                    <div className="col-xs-6 col-md-4 col-md-offset-1">
                                        <div ref="savingLabel" style={{'display': 'none'}}>
                                            <h4>Saving...</h4>
                                        </div>


                                        <Subheader
                                            style={{'display': 'flex', 'alignItems': 'flex-start'}}>Notes:</Subheader>
                                        <textarea
                                            value={this.state.photo['dam:note']}
                                            onChange={this.handleOnNoteChange}
                                            onBlur={this.handleOnNoteBlur}
                                            style={{
                                                'width': '100%',
                                                'minHeight': '100px',
                                                'height': 'auto'
                                            }}></textarea>


                                        <div style={{'padding': '5px'}}>

                                            <Subheader style={{
                                                'display': 'flex',
                                                'alignItems': 'flex-start'
                                            }}>People:</Subheader>

                                            <ChipInput
                                                hintText="Add people in image"
                                                value={this.state.photo['dam:people']}
                                                onRequestAdd={(chip) => this.handleOnPeopleAdd(chip)}
                                                onRequestDelete={(chip) => this.handleOnPeopleRemove(chip)}
                                            />

                                        </div>

                                        <div style={{'padding': '5px'}}>
                                            <Subheader style={{
                                                'display': 'flex',
                                                'alignItems': 'flex-start'
                                            }}>Tags:</Subheader>

                                            <ChipInput
                                                hintText="Describe image with tags"
                                                value={this.state.photo['dam:tags']}
                                                onRequestAdd={(chip) => this.handleOnTagAdd(chip)}
                                                onRequestDelete={(chip) => this.handleOnTagRemove(chip)}
                                            />

                                        </div>
                                    </div>


                                    <div className="col-xs-12 col-sm-5 col-sm-offset-1 col-md-4 col-md-offset-1">
                                        <ExifData exif={this.state.photo['dam:metadata']}/>

                                        <div>
                                            <ExifMap gps={this.state.gps}/>
                                        </div>
                                    </div>
                                </div>

                                <br/><br/>

                            </div>
                        </section>

                    </Paper>
                </div>
            </div>


        );
    }

});



