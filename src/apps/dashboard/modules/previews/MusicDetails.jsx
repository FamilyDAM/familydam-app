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
            file:{
                'jcr:uuid':0
            }
        };
    },


    getInitialState: function () {
        return {
            'location': ""
        };
    },


    componentWillMount:function(){
        //console.log("{FilesView} componentWillMount");
        var _this = this;
        this.state.imagePath = "";

        if( this.props.file['jcr:name'] == undefined ){
            this.props.file['jcr:name'] = this.props.file.name;
        }
        if( this.props.file['jcr:uuid'] == undefined ){
            this.props.file['jcr:uuid'] = this.props.file.id;
        }

        //load the data
        NodeActions.getNode.source.onNext(this.props.file.id);


        // list for results
        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (results)
        {
            _this.props.file = results;

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

        if( this.props.file['jcr:uuid'] == undefined ){
            this.props.file['jcr:uuid'] = this.props.file.id;
        }

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


    render: function()
    {
        var _this = this;


        var audioPlayer = <div></div>

        if( _this.props.file['jcr:uuid'] !== undefined ){
            var location = PreferenceStore.getBaseUrl() +"/api/files/" +_this.props.file['jcr:uuid'] +"?token=" +UserStore.token.value;

            audioPlayer = <audio key={new Date().getTime()} controls="controls" preload="auto" crossOrigin="Use Credentials">
                        <source src={location +'&format=audio/mp3'} type="audio/mp3"/>
                        <source src={location +'&format=audio/ogg'} type="audio/ogg"/>
                    </audio>
        }


        return (
            <div className="fileDetailsView" >
                <SectionTree title="Music Info"/>

                <div className="player">
                    {audioPlayer}
                </div>

                <div><strong>Name:</strong></div>
                <div>{_this.props.file['jcr:name']}</div>

                <br/><br/>
                <img src="assets/icons/ic_file_download_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }} onClick={this.handleDownloadOriginal}/>

                <img src="assets/icons/ic_delete_24px.svg" style={{
                                        'width': '36px',
                                        'height': '36px'
                                    }} onClick={this.handleDelete}/>


            </div>
        );
    }

});

