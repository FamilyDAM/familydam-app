
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';


var FileDetails = require('./FileDetails.jsx');
var MusicDetails = require('./MusicDetails.jsx');
var ImageDetails = require('./ImageDetails.jsx');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');

module.exports = React.createClass({

    getDefaultProps:function(){
        return {
            file:{}
        };
    },


    getInitialState: function(){
        return {
            isImage:false,
            isMusic:false,
            isMovie:false,
            isGenericFile:true
        };
    },

    componentWillMount:function(){
        //console.log("{FilesView} componentWillMount");
        var _this = this;
    },


    componentWillReceiveProps:function(nextProps)
    {
        //console.log("{PreviewSidebar} componentWillReceiveProps");

        // reset state
        this.state.isImage = false;
        this.state.isMusic = false;
        this.state.isMovie = false;
        this.state.isGenericFile = false;

        if( nextProps.file.mixins !== undefined && nextProps.file.mixins.indexOf("dam:image") > -1 ){
            this.state.isImage = true;
        }
        else if( nextProps.file.mixins !== undefined && nextProps.file.mixins.indexOf("dam:music") > -1 ){
            this.state.isMusic = true;
        }
        else if( nextProps.file.mixins !== undefined && nextProps.file.mixins.indexOf("dam:movie") > -1 ){
            this.state.isMovie = true;
        }
        else{
            this.state.isGenericFile = true;
        }
    },

    componentWillUnmount: function() {

    },


    handleDownloadOriginal:function(){
        window.open(this.props.file.path);
    },


    handleDelete:function(){

    },




    render: function() {

        var _this = this;


        return (
            <div className="" >

                {this.state.isImage?
                    <ImageDetails file={this.props.file}/>
                :''}
                {this.state.isMusic?
                    <MusicDetails file={this.props.file}/>
                :''}
                {this.state.isGenericFile?
                    <FileDetails file={this.props.file}/>
                :''}
            </div>
        );
    }

});



