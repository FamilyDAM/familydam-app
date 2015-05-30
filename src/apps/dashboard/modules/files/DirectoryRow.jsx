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

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

var DirectoryRow = React.createClass({
    mixins : [Navigation],

    handleDirClick: function(event, component)
    {
        // get path from element in the list
        var _path =  $("[data-reactid='" + component + "']").attr("data-path");

        if( _path !== undefined )
        {
            // send event that has will be picked up by the FilesView
            DirectoryActions.selectFolder.onNext({'path':_path});
            FileActions.selectFile.onNext(undefined);

            this.transitionTo('files', {}, {'path': _path})
        }

    },

    handleNodeDelete: function(event, component)
    {
        var _this = this;
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _path = $("[data-reactid='" + component + "']").attr("data-path");

        NodeActions.deleteNode.source.onNext({'id':_id, 'path':_path});
    },


    render:function(){

        return  <div key={this.props.dir.id}
                     className="row"
                     style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'50px', 'cursor': 'pointer'}}
                     onClick={this.handleDirClick}
                     data-id={this.props.dir.id}  data-path={this.props.dir.path}>

                    <div style={{'display': 'table-cell', 'width': '50px;'}}>
                        <img src="assets/icons/ic_folder_48px.svg"
                             style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-8" style={{'marginTop': '15px;'}}>
                                <Link to="photoDetails" params={{'id': this.props.dir.id}}>{this.props.dir.name}</Link>
                            </div>
                            <div className="col-sm-4">
                                {this.props.dir.mixins.indexOf("dam:userfolder")>-1?
                                    <ButtonGroup  bsSize="small">
                                        <Button onClick={this.handleDirClick} params={{'id': this.props.dir.id}}  style={{'padding':'5px 10px', 'margin':0}}>
                                            <Glyphicon glyph="eye-open"/> open
                                        </Button>
                                        <Button onClick={this.handleNodeDelete}
                                                data-id={this.props.dir.id} data-path={this.props.dir.path}
                                                style={{'padding':'5px 10px', 'margin':0}}>
                                            <Glyphicon glyph="remove"/> delete
                                        </Button>
                                    </ButtonGroup>
                                :""}
                            </div>
                        </div>
                    </div>
                </div>

    }

});

module.exports = DirectoryRow;

