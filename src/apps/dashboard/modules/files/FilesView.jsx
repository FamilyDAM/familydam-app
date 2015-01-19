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

var FilesView = React.createClass({
    mixins : [Navigation],

    getDefaultProps: function()
    {
        return {files:[
            {'id':'001', 'name':'0001.jpg'},
            {'id':'002', 'name':'0002.jpg'},
            {'id':'003', 'name':'0003.jpg'},
            {'id':'004', 'name':'0004.jpg'},
            {'id':'005', 'name':'0005.jpg'},
            {'id':'006', 'name':'0006.jpg'},
            {'id':'007', 'name':'0007.jpg'},
            {'id':'008', 'name':'0008.jpg'},
            {'id':'009', 'name':'0009.jpg'},
            {'id':'010', 'name':'0010.jpg'},
            {'id':'011', 'name':'0011.jpg'},
            {'id':'012', 'name':'0012.jpg'},
            {'id':'013', 'name':'0013.jpg'},
            {'id':'014', 'name':'0014.jpg'},
            {'id':'015', 'name':'0015.jpg'}
        ]};
    },

    getInitialState: function(){
        return { selectedItem: undefined };
    },

    handleRowClick: function(event, component)
    {
        $(".active").removeClass();
        $(event.currentTarget).addClass("active");
        var _id = $( "[data-reactid='" +component +"']" ).attr("data-id");
        this.setState({selectedItem:_id});

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


        var rows = this.props.files.map( function(_file){
            return <tr onClick={_this.handleRowClick}   data-id={_file.id}>
                        <td>
                            <img src="http://lorempixel.com/50/50/abstract/" style={{'width':'50px', 'height':'50px'}}/>
                        </td>
                        <td className="fileName">{_file.name}</td>
                        <td>
                            <ButtonGroup  bsSize="small">
                                <ButtonLink to="photoDetails" params={{photoId: _file.id}} >[v]</ButtonLink>
                                <ButtonLink to="photoEdit" params={{photoId: _file.id}} >[e]</ButtonLink>
                            </ButtonGroup>
                        </td>
                    </tr>

        });


        return (
            <div className="filesView container-fluid">
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
