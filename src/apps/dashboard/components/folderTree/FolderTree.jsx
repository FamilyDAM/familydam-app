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
var Route = Router.Route;
var moment = require('moment');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Modal = require('react-bootstrap').Modal;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var Glyphicon = require('react-bootstrap').Glyphicon;
var DirectoryActions = require('./../../actions/DirectoryActions');
var DirectoryStore = require('./../../stores/DirectoryStore');


var AddFolderModal = React.createClass({
    render: function() {
        return (
            <Modal {...this.props} title="Add Folder" animation={false}>
                <div className="modal-body">
                    <h4>Text in a modal</h4>
                    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                </div>
                <div className="modal-footer">
                    <ButtonGroup>
                        <Button onClick={this.props.onRequestHide}>Close</Button>
                        <Button >Create</Button>
                    </ButtonGroup>
                </div>
            </Modal>
        );
    }
});


var FolderTree = React.createClass({
    mixins: [ Router.Navigation ],

    getInitialState: function(){
        return {
            mode:'browse',
            folders:[],
            activeFolder: {'path':'/~/', 'children':[]}
        }
    },

    componentDidMount: function(){
        var _this = this;
        DirectoryStore.listDirectories("/~/").subscribe(function(results){
            _this.setState({'folders': results});
        });
    },

    componentWillUnmount: function(){

    },

    handleSelectDir: function(folder_){
        console.dir(folder_);
        this.setState( {'activeFolder': folder_} );

        // send event that has will be picked up by the FilesView
        //DirectoryActions.selectFolder.onNext(folder_);
        this.transitionTo('files', {}, {'path':folder_.path});
    },

    handleAddFolder: function(){
        var _af = this.state.activeFolder;
        //_af.children.push("NEW_ITEM");
        this.setState({"activeFolder":_af, 'mode':'add_item'});
    },

    render: function() {

        var _this = this;
        var _boundClick = _this.handleSelectDir.bind(this, {'path':'/~/'});

        var listItems = function(_folders)
        {
            return _folders.map(function(_f)  {
                var boundClick = _this.handleSelectDir.bind(_this, _f);

                return <ListGroupItem key={_f.path}>
                    <div className="folderItem"
                        style={{'cursor': 'pointer'}}
                        className={_this.state.activeFolder == _f ? 'folderItem active' : 'folderItem'}
                        onClick={boundClick}>
                        <Glyphicon glyph="chevron-right"/>
                        <strong style={{'paddingLeft': '3px'}}>{_f.name}</strong>
                    </div>
                    <ListGroup>{listItems(_f.children)}</ListGroup>
                </ListGroupItem>

            })

        };

        return (
            <div className="folderTree">
                <div className="header">
                    <h3>Folders
                        <ModalTrigger modal={<AddFolderModal />}>
                            <Glyphicon glyph="plus"
                                    className="pull-right"
                                    onClick={this.handleAddFolder}/>
                        </ModalTrigger>
                    </h3>
                </div><br/>

                <ListGroup>
                    <ListGroupItem key="home">
                        <div className={_this.state.activeFolder.path=="/~/"?'folderItem active':'folderItem'}
                            style={{'cursor':'pointer'}}
                            onClick={_boundClick}>
                            <Glyphicon glyph="chevron-right"/>
                            <strong style={{'paddingLeft':'3px'}}>Home</strong>
                        </div>
                        <ListGroup>
                            {listItems(this.state.folders)}
                        </ListGroup>
                    </ListGroupItem>

                </ListGroup>

            </div>
        );
    }

});

module.exports = FolderTree;
