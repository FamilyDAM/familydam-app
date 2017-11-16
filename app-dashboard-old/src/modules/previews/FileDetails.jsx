
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { Router, Link } from 'react-router';



var SectionTree = require('../../components/folderTree/SectionTree.jsx');

module.exports = React.createClass({

    getDefaultProps:function(){
        return {
            file:{}
        };
    },

    componentWillMount:function(){
        //console.log("{FilesView} componentWillMount");
        var _this = this;
    },


    componentWillReceiveProps:function(nextProps)
    {
        //console.log("{FilesView} componentWillReceiveProps");
        this.props = nextProps;
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
            <div className="fileDetailsView" >
                <SectionTree title="File Info"/>
                <div><strong>Name:</strong></div>
                <div>{this.props.file.name}</div>
                <div><strong>Path:</strong></div>
                <div>{this.props.file.path}</div>

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



