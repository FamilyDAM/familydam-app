/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Keymaster = require('keymaster');

var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var Carousel = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Tags = require('./../../components/tags/Tags');
var ExifMap = require('./../../components/exifMap/ExifMap');
var ExifData = require('./../../components/exifData/ExifData');

var FolderTree = require('../../components/folderTree/FolderTree');
var UserStore = require('./../../stores/UserStore');
var CurrentSearchStore = require('./../../stores/CurrentSearch');
var PreferenceStore = require('./../../stores/PreferenceStore');
var ContentServices = require('./../../services/ContentServices');


module.exports = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function () {
        return {'photo': {}, prevId:undefined, nextId:undefined};
    },

    /**
     * Load the images in the root folder
     */
    componentWillMount: function () {
        var _this = this;
        this.load(this.props.params.id);


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
        this.load(nextProps.params.id);
    },


    load: function(id_) {

        var _this = this;
        ContentServices.getNodeById(id_).subscribe(function (results) {
            // set defaults for missing props
            if (results['dam:tags'] == undefined)
            {
                results['dam:tags'] = ['t1', 't2'];
            }
            if (results['dam:note'] == undefined)
            {
                results['dam:note'] = "tick tock";
            }

            // set some local props for easier rendering
            var imagePath = PreferenceStore.getBaseUrl() + results['jcr:path'] + "?token=" + UserStore.getUser().token + "&rendition=web.1024";
            var rating = results['dam:rating'] ? results['dam:rating'] : 0;
            var datetaken = results['jcr:created'];

            var datetaken = "";
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['Exif IFD0'] != undefined
                && results['dam:metadata']['Exif IFD0']['Date_Time'] != undefined)
            {
                var datetaken = results['dam:metadata']['Exif IFD0']['Date_Time'].description;
            }

            var gps = undefined;
            if (results['dam:metadata'] != undefined
                && results['dam:metadata']['GPS'] != undefined)
            {
                var gps = results['dam:metadata']['GPS'];
            }


            // Find the NEXT and PREV image
            var currentSearchResults = CurrentSearchStore.getResults();
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



            _this.setState({
                'photo': results,
                'imagePath': imagePath,
                'rating': rating,
                'datetaken': datetaken,
                'gps': gps,
                'prevId':_prevId,
                'nextId':_nextId
            });

        }, function (error) {
            console.dir(error);
        });

    },


    save: function () {
        console.log("something changed: SAVE");
        console.dir(this.state.photo);
    },


    handleOnNoteChange: function (event_) {
        this.state.photo['dam:note'] = event_.target.value;
        this.setState({'photo': this.state.photo});
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
                                        <Glyphicon glyph="chevron-left" style={{'font-size':'48px', 'color':'#eee', 'top':'200px'}}/>
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
                                        <Glyphicon glyph="chevron-right" style={{'font-size':'48px', 'color':'#eee', 'top':'200px'}}/>
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
                                    }}/>
                                    <img src="assets/icons/ic_mode_edit_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }}/>
                                    <img src="assets/icons/ic_delete_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }}/>
                                    <img src="assets/icons/ic_share_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }}/>
                                </div>

                                <div className="col-sm-6">
                                    <span style={{'font-size': '24px'}}>{this.state.datetaken}</span>

                                    <br/>

                                    <img src="assets/icons/ic_star_24px.svg"
                                        style={{'width': '24px', 'height': '24px'}}/>
                                    <img src="assets/icons/ic_star_24px.svg"
                                        style={{'width': '24px', 'height': '24px'}}/>
                                    <img src="assets/icons/ic_star_24px.svg"
                                        style={{'width': '24px', 'height': '24px'}}/>
                                    <img src="assets/icons/ic_star_24px.svg"
                                        style={{'width': '24px', 'height': '24px'}}/>
                                    <img src="assets/icons/ic_star_outline_24px.svg"
                                        style={{'width': '24px', 'height': '24px'}}/>
                                    <span style={{'font-size': '16px'}}>{this.state.rating}</span>
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
                                        style={{'width': '100%', 'min-height': '100px', 'height': 'auto'}}></textarea>


                                    <div style={{'padding': '5px'}}>
                                        <Tags
                                            tags={this.state.photo['dam:tags']}
                                            onAdd={this.handleOnTagAdd}
                                            onRemove={this.handleOnTagRemove}/>
                                    </div>
                                </div>


                                <div className="col-sm-12 col-md-6">

                                {this.state.gps != undefined ?
                                    <div>
                                        <ExifMap gps={this.state.gps} />
                                        <hr style={{'margin-top': '15px', 'margin-bottom': '15px'}}/>
                                    </div>
                                    : ''}

                                    <ExifData exif={this.state.photo['dam:metadata']}/>

                                </div>
                            </div>


                            <div className="row" style={{'margin-top': '30px', 'min-height': '400px'}}>
                                <TabbedArea defaultActiveKey={1} animation={false}>
                                    <TabPane eventKey={1} tab="Similar or Duplicate">
                                        <div style={{
                                            'border-right': '1px solid #eee',
                                            'border-left': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/dog" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/cat" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/abstract" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=1" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=2" style={{'margin': 'auto'}}/>
                                            </div>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
                                                'float': 'left',
                                                'padding': '10px'
                                            }}>
                                                <img src="http://loremflickr.com/150/150/paris?random=3" style={{'margin': 'auto'}}/>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane eventKey={2} tab="Renditions">
                                        <div style={{
                                            'border-right': '1px solid #eee',
                                            'border-left': '1px solid #eee'
                                        }}>
                                            <div style={{
                                                'min-width': '150px',
                                                'min-height': '150px',
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



