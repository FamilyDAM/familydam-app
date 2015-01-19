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
var moment = require('moment');

var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Glyphicon = require('react-bootstrap').Glyphicon;

var Clock = React.createClass({

    getInitialState: function(){
        return {
            timestamp:new Date().getTime()
        }
    },

    componentDidMount: function(){
        this.timer = setInterval(this.tick, 1000);
    },

    componentWillUnmount: function(){
        clearInterval(this.timer);
    },

    tick: function(){
        this.setState({timestamp: new Date().getTime()});
    },

    render: function() {

        return (
            <div className="folderTree">
                <div className="header">
                    <h3>Folders <Glyphicon glyph="plus" className="pull-right"/></h3>
                </div><br/>
                <ListGroup>
                    <ListGroupItem><Glyphicon glyph="chevron-down" style={{'padding-right': '5px;'}}/> <strong>Documents</strong></ListGroupItem>
                    <ListGroupItem>
                        <ListGroup>
                            <ListGroupItem><Glyphicon glyph="chevron-down" style={{'padding-right': '5px;'}}/> <strong>Mike</strong></ListGroupItem>
                            <ListGroupItem>
                                <ListGroup>
                                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> <strong>2014</strong></ListGroupItem>
                                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> 2013</ListGroupItem>
                                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> 2012</ListGroupItem>
                                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> 2011</ListGroupItem>
                                </ListGroup>
                            </ListGroupItem>
                            <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Angie</ListGroupItem>
                            <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Kayden</ListGroupItem>
                            <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Hailey</ListGroupItem>
                        </ListGroup>
                    </ListGroupItem>
                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Photos</ListGroupItem>
                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Music</ListGroupItem>
                    <ListGroupItem><Glyphicon glyph="chevron-right" style={{'padding-right': '5px;'}}/> Movies</ListGroupItem>

                </ListGroup>
            </div>
        );
    }

});

module.exports = Clock;
