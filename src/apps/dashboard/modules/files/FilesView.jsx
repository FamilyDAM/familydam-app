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
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Table = require('react-bootstrap').Table;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var FolderTree = require('../../components/folderTree/FolderTree');

var DirectoryActions = require('./../../actions/DirectoryActions');

var PreferenceStore = require('./../../stores/PreferenceStore');
var UserStore = require('./../../stores/UserStore');
var SearchStore = require('./../../stores/SearchStore');
var DirectoryStore = require('./../../stores/DirectoryStore');

var FilesView = React.createClass({
    mixins : [Navigation],


    getInitialState: function(){
        return {
            files:[],
            selectedItem: undefined };
    },



    componentWillMount:function(){
        //todo: make path dynamic
        var _this = this;
        var _path = "/~/";

        if( this.props.query && this.props.query.path ){
            _path = this.props.query.path;
        }

        _this.loadData(_path, 100, 0); //start with root directory
    },

    componentWillReceiveProps:function(nextProps)
    {
        this.loadData(nextProps.query.path, 100, 0);
    },


    loadData:function(folder_, limit_, offset_){
        //todo: make path dynamic
        var _this = this;
        DirectoryStore.listFilesInDirectory(folder_).subscribe(function(results){
            _this.setState({'files': results});
        });
    },



    handleRowClick: function(event, component)
    {
        if( $(event.target).attr('type') != "button" )
        {
            $(".active").removeClass();
            $(event.currentTarget).addClass("active");
            var _id = $("[data-reactid='" + component + "']").attr("data-id");
            this.setState({selectedItem: _id});
        }

        // IF DBL CLick
        //var _id = $( "[data-reactid='" +component +"']" ).attr("data-id");
        //transitionTo('photoDetails', {'photoId': _id});
    },



    render: function() {

        var _this = this;
        var tableClass = "col-sm-12 col-md-10";
        var asideClass = "hidden col-md-3";
        var previewWidget = <span>
                                [preview panel = {this.state.selectedItem}]
                            </span>;

        if( this.state.selectedItem !== undefined )
        {
            tableClass = "col-sm-12 col-md-6";
            asideClass = "col-md-3";
        };


        var rows = this.state.files.map( function(_file){
            return <tr key={_file.id} onClick={_this.handleRowClick}   data-id={_file.id}>
                        <td>
                            <img src={PreferenceStore.getBaseUrl() +_file.path +"?rendition=thumbnail.200&token=" +UserStore.getUser().token} style={{'width':'50px', 'height':'50px'}}/>
                        </td>
                        <td className="fileName">{_file.name}</td>
                        <td>
                            { _file.fileType == 'image' ?
                            <ButtonGroup  bsSize="small">
                                <ButtonLink to="photoDetails" params={{'id': _file.id}} >[v]</ButtonLink>
                                <ButtonLink to="photoEdit" params={{id: _file.id}} >[e]</ButtonLink>
                            </ButtonGroup>
                            :''}
                        </td>
                    </tr>

        });


        return (
            <div className="filesView container-fluid" >
                <div  className="row">
                    <aside className="col-sm-2" >
                        <FolderTree/>
                    </aside>

                    <section className={tableClass} style={{'borderLeft':'1px solid #eee'}}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{width:"90%"}}>Name</th>
                                    <th style={{"minWidth":"100px"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                    </section>

                    <aside className={asideClass}>
                    {previewWidget}
                    </aside>
                </div>
            </div>

        );
    }

});

module.exports = FilesView;
