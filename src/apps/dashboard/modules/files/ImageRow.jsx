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
var Navigation = Router.Navigation;

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('../../actions/FileActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

var FileRow = React.createClass({
    mixins : [Navigation],

    handleRowClick: function(event, component)
    {

        if( $(event.target).attr('type') != "button" )
        {
            $(".active").removeClass("active");
            $(event.currentTarget).addClass("active");
            var _id = $("[data-reactid='" + component + "']").attr("data-id");
        }


        if( $('.device-xs').is(':visible') || $('.device-sm').is(':visible'))
        {
            FileActions.selectFile.onNext(undefined);
            this.context.transitionTo("photoDetails", {'id': this.props.file.id});
        }else{
            FileActions.selectFile.onNext(this.props.file);
        }
        // IF DBL CLick
        //var _id = $( "[data-reactid='" +component +"']" ).attr("data-id");
        //transitionTo('photoDetails', {'photoId': _id});
    },



    handleNodeDelete: function(event, component)
    {
        var _this = this;
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _path = $("[data-reactid='" + component + "']").attr("data-path");
        debugger;
        NodeActions.deleteNode.source.onNext({'id':_id, 'path':_path});
    },




    render:function(){

        return  <div className="row" onClick={this.handleRowClick} style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>
                    <div style={{'display': 'table-cell', 'width': '50px;'}}>
                        <Link to="photoDetails" params={{'id': this.props.file.id}}>
                            <img src={PreferenceStore.getBaseUrl() +this.props.file.path.replace("dam:files", "~") +"?rendition=thumbnail.200&token=" +UserStore.token.value}
                                 style={{'width':'50px', 'height':'50px'}}/></Link>
                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-6 col-lg-8" style={{'overflow':'hidden'}}>
                                <Link to="photoDetails" params={{'id': this.props.file.id}}>{this.props.file.name}</Link>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                { this.props.file.mixins.indexOf("dam:image") > -1 ?
                                    <ButtonGroup  bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>
                                        <ButtonLink to="photoDetails" params={{'id': this.props.file.id}}  style={{'padding':'5px 10px', 'margin':0}}>
                                            <Glyphicon glyph="eye-open"/> view
                                        </ButtonLink>
                                        <ButtonLink to="photoEdit" params={{id: this.props.file.id}}  style={{'padding':'5px 10px', 'margin':0}}>
                                            <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width':'14px', 'height':'14px', 'margin':'auto'}}/> edit
                                        </ButtonLink>
                                        <Button onClick={this.handleNodeDelete} data-id={this.props.file.id} data-path={this.props.file.path}  style={{'padding':'5px 10px', 'margin':0}}>
                                            <Glyphicon glyph="remove"/> delete
                                        </Button>
                                    </ButtonGroup>
                                    :
                                    <ButtonGroup  bsSize="small">
                                        <Button onClick={this.handleNodeDelete} data-id={this.props.file.id} data-path={this.props.file.path}>
                                            <Glyphicon glyph="remove"/> delete
                                        </Button>
                                    </ButtonGroup>
                                }
                            </div>
                        </div>
                    </div>

                </div>

    }

});

module.exports = FileRow;

