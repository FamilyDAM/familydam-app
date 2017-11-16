
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';
var moment = require('moment');
var Glyphicon = require('react-bootstrap').Glyphicon;

var NodeActions = require('../../actions/NodeActions');

var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var ContentStore = require('../../stores/ContentStore');

var SectionTree = require('../../components/folderTree/SectionTree.jsx');


module.exports = React.createClass({

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
        this.props = nextProps;

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


        var _audioPlayer = <div></div>

        if( _this.props.file['jcr:uuid'] !== undefined ){
            var location = PreferenceStore.getBaseUrl() +"/api/files/" +_this.props.file['jcr:uuid'] +"?token=" +UserStore.token.value;

            _audioPlayer = <audio key={new Date().getTime()} controls="controls" preload="auto" crossOrigin="Use Credentials">
                        <source src={location +'&format=audio/mp3'} type="audio/mp3"/>
                        <source src={location +'&format=audio/ogg'} type="audio/ogg"/>
                    </audio>
        }


        var _name = <div>
                        <div>{_this.props.file['jcr:name']}</div>
                    </div>
        if( _this.props.file['dam:metadata'] !== undefined )
        {
            _name = <div>{_this.props.file['dam:metadata'].title}</div>
        }



        var _metadata = <div></div>

        if( _this.props.file['dam:metadata'] !== undefined )
        {
            _metadata = <div>
                            <div><strong>{_this.props.file['dam:metadata'].artist}</strong></div>
                            <div>{_this.props.file['dam:metadata'].album}</div>
                        </div>

        }


        return (
            <div className="fileDetailsView" >
                <SectionTree title="Music Info"/>

                {_name}
                <div className="player">
                    {_audioPlayer}
                </div>

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
                {_metadata}



            </div>
        );
    }

});

