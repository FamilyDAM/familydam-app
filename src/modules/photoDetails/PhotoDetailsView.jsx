
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

var Tab = require('react-bootstrap').Tab;
var Tabs = require('react-bootstrap').Tabs;
var Carousel = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Rating = require('react-rating');


var Tags = require('./../../components/tags/Tags');
var ExifMap = require('./../../components/exifMap/ExifMap');
var ExifData = require('./../../components/exifData/ExifData');
var CreativeCloudEditor = require('./../../components/creativeCloudEditor/CreativeCloudEditor');
var PicozuEditor = require('./../../components/picozuEditor/PicozuEditor');
var FolderTree = require('../../components/folderTree/FolderTree');
var DarkroomImage = require('../../components/darkroomImage/DarkroomImage');

var UserStore = require('./../../stores/UserStore');
var SearchStore = require('./../../stores/SearchStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var ContentStore = require('./../../stores/ContentStore');

var NodeActions = require('./../../actions/NodeActions');
var NavigationActions = require('./../../actions/NavigationActions');


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

        // update the breadcrumb
        var _pathData = {'label': 'Photo Details', 'navigateTo': "photoDetails", 'params': {id: this.props.params.id}, 'level': 1};
        NavigationActions.currentPath.onNext(_pathData);

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
        if( this.searchStoreSubscription !== undefined ){
            this.searchStoreSubscription.dispose();
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
            if (results['dam:people'] == undefined)
            {
                results['dam:people'] = [];
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


            this.subscribe(results);


            _this.state = {
                'photo': results,
                'location': _location,
                'imagePath': imagePath,
                'rating': rating,
                'datetaken': _datetaken,
                'gps': gps,
                'prevId': undefined,
                'nextId': undefined
            };

            if( _this.isMounted() ) _this.forceUpdate();

        }.bind(this), function (error) {
            console.dir(error);
        });

    },

    subscribe:function(photos_){
        // Find the NEXT and PREV image
        this.searchStoreSubscription = SearchStore.results.subscribe(function(data_){
            var _prevId = undefined;
            var _nextId = undefined;
            // find index, previous item, and next item
            var index = -1;
            for (var i = 0; i < data_.length; i++)
            {
                var obj = data_[i];
                if( obj.id == photos_['jcr:uuid']){
                    index = i;

                    if( i > 0 ){
                        _prevId = data_[i-1].id;
                    }
                    if( i < (photos_.length-1) ){
                        _nextId = data_[i+1].id;
                    }

                    break;
                }
            }

            if( this.isMounted() )  this.setState({'prevId': _prevId, 'nextId': _nextId});
        }.bind(this));

    },


    save: function (property_) {
        var _id = this.state.photo['jcr:uuid'];
        var _val = this.state.photo[property_];

        var _data = {'jcr:uuid':_id};
        _data[property_] = _val;

        //$(this.refs.savingLabel.getDOMNode()).show();
        //window.status = "Saving Changes";

        NodeActions.updateNode.source.onNext(_data);

        NodeActions.updateNode.sink.subscribe(
            function (id_) {
                //do nothing on successful save
                //$(this.refs.savingLabel.getDOMNode()).hide();
            }.bind(this), function(err_){
                alert(err_.status +":" +err_.statusText +"\n" +err_.responseText);
            }.bind(this));
    },


    handleRatingChange: function (rating_) {
        this.state.rating = rating_;
        this.state.photo['dam:rating'] = rating_;
        if( this.isMounted() ) this.forceUpdate();
        this.save("dam:rating");
    },

    handleOnNoteChange: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        if( this.isMounted() ) this.forceUpdate();
    },

    handleOnNoteBlur: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        if( this.isMounted() ) this.forceUpdate();
        this.save("dam:note");
    },

    handleOnTagAdd: function (tag_) {
        if( this.state.photo['dam:tags'] == undefined ){
            this.state.photo['dam:tags'] = [];
        }

        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos == -1)
        {
            this.state.photo['dam:tags'].push(tag_);
            if( this.isMounted() ) this.forceUpdate();
            this.save("dam:tags");
        }
    },

    handleOnTagRemove: function (tag_) {
        var pos = this.state.photo['dam:tags'].indexOf(tag_);
        if (pos > -1)
        {
            this.state.photo['dam:tags'].splice(pos, 1);
            if( this.isMounted() ) this.forceUpdate();
            this.save("dam:tags");
        }
    },

    handleOnPeopleAdd: function (people_) {
        if( this.state.photo['dam:people'] == undefined ){
            this.state.photo['dam:people'] = [];
        }

        var pos = this.state.photo['dam:people'].indexOf(people_);
        if (pos == -1)
        {
            this.state.photo['dam:people'].push(people_);
            if( this.isMounted() ) this.forceUpdate();
            this.save("dam:people");
        }
    },


    handleOnPeopleRemove: function (people_) {

        var pos = this.state.photo['dam:people'].indexOf(people_);
        if (pos > -1)
        {
            this.state.photo['dam:people'].splice(pos, 1);
            if( this.isMounted() ) this.forceUpdate();
            this.save("dam:people");
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
                                    <img id="editableImage"
                                         ref="editableImage"
                                         src={this.state.imagePath}
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

                                    <CreativeCloudEditor
                                        imageId={this.state.photo['jcr:uuid']}/>


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
                                <div className="col-sm-6">
                                    <div ref="savingLabel" style={{'display':'none'}}>
                                        <h4>Saving...</h4>
                                    </div>


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
                            <div className="row" style={{'marginTop': '30px', 'minHeight': '400px'}}>

                                <Tabs defaultActiveKey={1} animation={false} style={{'display':'none'}} >

                                    <Tab eventKey={1} tab="Renditions">
                                        <div style={{
                                            'borderRight': '1px solid #eee',
                                            'borderLeft': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px',
                                                'textAlign':'center', 'verticle':'middle'
                                            }}>
                                                (Coming Soon)
                                            </div>
                                        </div>
                                    </Tab>


                                    <Tab eventKey={2} tab="Similar or Duplicate">
                                        <div style={{
                                            'borderRight': '1px solid #eee',
                                            'borderLeft': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'minWidth': '150px',
                                                'minHeight': '150px',
                                                'float': 'left',
                                                'padding': '10px',
                                                'textAlign':'center', 'verticle':'middle'
                                            }}>
                                                (Coming Soon)
                                            </div>

                                        </div>
                                    </Tab>

                                </Tabs>

                            </div>


                        </div>
                    </section>

                </div>
            </div>

        );
    }

});



