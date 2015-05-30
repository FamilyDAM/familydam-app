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

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var IS = require('is_js');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var moment = require('moment');

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var NodeActions = require('../../actions/NodeActions');
var SectionTree = require('../../components/folderTree/SectionTree');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var ContentStore = require('../../stores/ContentStore');

module.exports = React.createClass({
    mixins : [Navigation],

    getDefaultProps:function(){
        return {
            file:{}
        };
    },


    getInitialState: function () {
        return {
            'location': ""
            , datetaken: 'Date Unknown'
            , gps: ""
            , rating:0
            , imagePath:""
        };
    },


    componentWillMount:function(){
        //console.log("{FilesView} componentWillMount");
        var _this = this;
        this.state.imagePath = "";

        if( this.props.file['jcr:name'] == undefined ){
            this.props.file['jcr:name'] = this.props.file.name;
        }

        //load the data
        NodeActions.getNode.source.onNext(this.props.file.id);


        // list for results
        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (results)
        {
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


            var _location = PreferenceStore.getBaseUrl() +"/api/files/" +results['jcr:uuid'] +"?token=" +UserStore.token.value;

            var _datetaken = moment(datetaken, "YYYYMMDD HH:mm:ss").format("LLL");
            if( _datetaken == "Invalid date" ){
                _datetaken = datetaken;
            }


            _this.props.file = results;
            _this.state.location = _location;
            _this.state.datetaken = _datetaken;
            _this.state.gps = gps;
            _this.state.rating = rating;
            _this.state.imagePath = imagePath;

            // reload
            if( _this.isMounted() ) _this.forceUpdate();
        });
    },


    componentWillReceiveProps:function(nextProps)
    {
        var _this = this;

        if( _this.isMounted() ){
            _this.setState(_this.getInitialState());
        }

        //console.log("{FilesView} componentWillReceiveProps");
        this.props.file = nextProps.file;

        //load the data
        NodeActions.getNode.source.onNext(this.props.file.id);


    },

    componentWillUnmount: function() {
        if( this.currentNodeSubscription !== undefined ){
            this.currentNodeSubscription.dispose();
        }
    },


    handleDownloadOriginal:function(){
        window.open(this.state.location);
    },


    handleDelete:function(){

    },




    render: function() {

        var _this = this;

        var previewImage = PreferenceStore.getBaseUrl() + _this.props.file.path + "?token=" + UserStore.token.value + "&rendition=thumbnail.200";


        return (
            <div className="fileDetailsView" >
                <SectionTree title="Image Info"/>

                <div>
                <img src={this.state.imagePath}
                     style={{'maxHeight': '250px', 'maxWidth':'80%'}}
                     className="center-block" />
                </div>

                <br/>
                <div style={{'textAlign':'right'}}>

                    <img src="assets/icons/ic_file_download_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }} onClick={this.handleDownloadOriginal}/>

                    <img src="assets/icons/ic_delete_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }} onClick={this.handleDelete}/>
                </div>
                <br/>

                <div><strong>Name:</strong></div>
                <div>{this.props.file['jcr:name']}</div>

                <div><strong>Path:</strong></div>
                <div>{this.props.file['jcr:path']}</div>



            </div>
        );
    }

});

