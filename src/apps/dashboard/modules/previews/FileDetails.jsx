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

var SectionTree = require('../../components/folderTree/SectionTree');

module.exports = React.createClass({
    mixins : [Navigation],

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
        this.props.file = nextProps.file;
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



