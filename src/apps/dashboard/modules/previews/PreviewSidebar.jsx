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

var FileDetails = require('./FileDetails');
var ImageDetails = require('./ImageDetails');
var SectionTree = require('../../components/folderTree/SectionTree');

var PreviewSidebar = React.createClass({
    mixins : [Navigation],

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
        console.log("{FilesView} componentWillReceiveProps");

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
                {this.state.isGenericFile?
                    <FileDetails file={this.props.file}/>
                :''}
            </div>
        );
    }

});

module.exports = PreviewSidebar;


