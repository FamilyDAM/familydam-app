
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Keymaster = require('keymaster');
var moment = require('moment');

var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var Carousel = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Rating = require('react-rating');


var Tags = require('./../../components/tags/Tags');
var ExifMap = require('./../../components/exifMap/ExifMap');
var ExifData = require('./../../components/exifData/ExifData');

var FolderTree = require('../../components/folderTree/FolderTree');

var UserStore = require('./../../stores/UserStore');
var SearchStore = require('./../../stores/SearchStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var ContentStore = require('./../../stores/ContentStore');

var NodeActions = require('./../../actions/NodeActions');


module.exports = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function () {
        return {
            'photo': {}
            , datetaken: 'Date Unknown'
            , location: ""
            , prevId:undefined
            , nextId:undefined
        };
    },

    /**
     * Load the images in the root folder
     */
    componentWillMount: function () {
        var _this = this;
        NodeActions.getNode.source.onNext(this.props.params.id);

        this.registerListeners();

        Keymaster("left", function(e_){
            //console.log("left");
            e_.stopImmediatePropagation();
            if( _this.state.prevId )
            {
                _this.transitionTo('photoDetails', {'id': _this.state.prevId});
            }
        });
        Keymaster("right", function(e_){
            //console.log("right");
            e_.stopImmediatePropagation();
            if( _this.state.nextId )
            {
                _this.transitionTo('photoDetails', {'id': _this.state.nextId});
            }
        });
    },


    componentWillReceiveProps: function (nextProps) {

        NodeActions.getNode.source.onNext(nextProps.params.id);

    },


    componentWillUnmount: function (nextProps) {
        if( this.currentNodeSubscription !== undefined ){
            this.currentNodeSubscription.dispose();
        }
    },


    registerListeners: function(id_) {

        var _this = this;


        // list for results
        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (results) {
            // set defaults for missing props
            if (results['dam:tags'] == undefined)
            {
                results['dam:tags'] = [];
            }
            if (results['dam:note'] == undefined)
            {
                results['dam:note'] = "";
            }

            // set some local props for easier rendering
            var imagePath = PreferenceStore.getBaseUrl() + results['jcr:path'] + "?token=" + UserStore.token.value + "&rendition=web.1024";
            var rating = results['dam:rating'] ? results['dam:rating'] : 0;
            var datetaken = results['jcr:created'];

            var datetaken = "";
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['Exif IFD0'] != undefined
                && results['dam:metadata']['Exif IFD0']['Date_Time'] != undefined
                && results['dam:metadata']['Exif IFD0']['Date_Time']['description'] != undefined )
            {
                var datetaken = results['dam:metadata']['Exif IFD0']['Date_Time']['description'];
            };

            var gps = undefined;
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['GPS'] != undefined)
            {
                var gps = results['dam:metadata']['GPS'];
            }


            var _location = PreferenceStore.getBaseUrl() +"/api/files/" +results['jcr:uuid'] +"?token=" +UserStore.token.value;

            var _datetaken = moment(datetaken, "YYYYMMDD HH:mm:ss").format("LLL");
            if( _datetaken == "Invalid date" ){
                _datetaken = datetaken;
            }



            // Find the NEXT and PREV image
            var currentSearchResults = SearchStore.results.value;
            // find index, previous item, and next item
            var _prevId = undefined;
            var _nextId = undefined;
            var index = -1;
            for (var i = 0; i < currentSearchResults.length; i++)
            {
                var obj = currentSearchResults[i];
                if( obj.id == results['jcr:uuid']){
                    index = i;

                    if( i > 0 ){
                        _prevId = currentSearchResults[i-1].id;
                    }
                    if( i < (currentSearchResults.length-1) ){
                        _nextId = currentSearchResults[i+1].id;
                    }

                    break;
                }
            }



                _this.state = {
                    'photo': results,
                    'location': _location,
                    'imagePath': imagePath,
                    'rating': rating,
                    'datetaken': _datetaken,
                    'gps': gps,
                    'prevId': _prevId,
                    'nextId': _nextId
                };

            if( _this.isMounted() ) _this.forceUpdate();

        }, function (error) {
            console.dir(error);
        });

    },


    save: function () {

        var _id = this.state.photo['jcr:uuid'];

        NodeActions.updateNode.source.onNext(_id);
        /**
        ContentStore.updateNodeById(_id, this.state.photo).subscribe(
            function (results) {
                //reload the updated object
                this.load(id_);
            }, function(err_){
                alert(err_.status +":" +err_.statusText +"\n" +err_.responseText);
            });
        **/
    },


    handleOnNoteChange: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        if( this.isMounted() ) this.setState({'photo': this.state.photo});
    },


    handleOnNoteBlur: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        this.save();
    },


    handleOnTagAdd: function (tag_) {
        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos == -1)
        {
            this.state.photo['dam:tags'].push(tag_);
            this.save();
        }
    },


    handleOnTagRemove: function (tag_) {

        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos > -1)
        {
            this.state.photo['dam:tags'].splice(pos, 1);
            this.save();
        }
    },


    handleDownloadOriginal:function(){
        window.open(this.state.location);//, "_blank");
    },


    handleDelete:function(){

    },


    render: function () {

        return (
            <div className="photoDetailsView container">

                <div className="row">
                    <section className="col-sm-12">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-1">
                                    {this.state.prevId?
                                    <Link to="photoDetails" params={{'id': this.state.prevId}} >
                                        <Glyphicon glyph="chevron-left" style={{'fontSize':'48px', 'color':'#eee', 'top':'200px'}}/>
                                    </Link>
                                    :''}
                                </div>
                                <div className="col-sm-10">
                                    <img src={this.state.imagePath}
                                        style={{'height': '500px'}}
                                        className="center-block" />
                                </div>
                                <div className="col-sm-1">
                                    {this.state.nextId?
                                    <Link to="photoDetails" params={{'id': this.state.nextId}} >
                                        <Glyphicon glyph="chevron-right" style={{'fontSize':'48px', 'color':'#eee', 'top':'200px'}}/>
                                    </Link>
                                    :''}
                                </div>
                            </div>


                            <div className="row">
                                <br/>
                                <hr style={{'width': '100%'}}/>
                            </div>


                            <div className="row" >
                                <div className="col-sm-6">

                                    <img src="assets/icons/ic_file_download_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }} onClick={this.handleDownloadOriginal}/>

                                    <Link to="photoEdit" params={{id: '123'}}>
                                        <img src="assets/icons/ic_mode_edit_24px.svg" style={{
                                            'width': '36px',
                                            'height': '36px'
                                        }}/>
                                    </Link>

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
                                        initialRate={this.state.rating}/>
                                </div>
                            </div>


                            <div className="row">
                                <hr style={{'width': '100%'}}/>
                                <br/>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <h5>Notes:</h5>
                                    <textarea
                                        value={this.state.photo['dam:note']}
                                        onChange={this.handleOnNoteChange}
                                        onBlur={this.handleOnNoteBlur}
                                        style={{'width': '100%', 'minHeight': '100px', 'height': 'auto'}}></textarea>


                                    <div style={{'padding': '5px'}}>
                                        <Tags
                                            title="People"
                                            tags={this.state.photo['dam:people']}
                                            onAdd={this.handleOnPeopleAdd}
                                            onRemove={this.handleOnPeopleRemove}/>
                                    </div>

                                    <div style={{'padding': '5px'}}>
                                        <Tags
                                            title="Tags"
                                            tags={this.state.photo['dam:tags']}
                                            onAdd={this.handleOnTagAdd}
                                            onRemove={this.handleOnTagRemove}/>
                                    </div>
                                </div>


                                <div className="col-sm-12 col-md-6">

                                    <div>
                                        <ExifMap gps={this.state.gps} />
                                        <hr style={{'marginTop': '15px', 'marginBottom': '15px'}}/>
                                    </div>


                                    <ExifData exif={this.state.photo['dam:metadata']}/>

                                </div>
                            </div>

                            <br/><br/><br/><br/>
                            <div className="row" style={{'marginTop': '30px', 'minHeight': '400px', 'display':'none'}}>

                                <TabbedArea defaultActiveKey={1} animation={false}  style={{'display':'none'}}>
                                    <TabPane eventKey={1} tab="Similar or Duplicate">
                                        <div style={{
                                            'borderRight': '1px solid #eee',
                                            'borderLeft': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/dog" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/cat" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/abstract" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=1" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=2" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=3" style={{'margin': 'auto'}}/>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane eventKey={2} tab="Renditions">
                                        <div style={{
                                            'borderRight': '1px solid #eee',
                                            'borderLeft': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://lorempixel.com/g/150/150/nature" style={{'margin': 'auto'}}/>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane eventKey={3} tab="Albums">[List of albums]</TabPane>
                                </TabbedArea>

                            </div>


                        </div>
                    </section>

                </div>
            </div>

        );
    }

});



