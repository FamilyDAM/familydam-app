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

    activeDir: "/dam:files/",

    
    handleCreateFolder:function(event_){
        var _this = this;

        DirectoryStore.createFolder(
            _this.activeDir,
            _this.refs.folderName.getDOMNode().value
        ).subscribe(function(results_){
            _this.props.onRequestHide();
            DirectoryActions.refreshDirectories.onNext(true);
        }, function(error_){
            alert(error_.statusText);
        })

    },


    render: function() {


        if( this.props.dir != undefined ){
            this.activeDir = this.props.dir;
            if( this.activeDir.substr(this.activeDir.length-1) != "/" )
            {
                this.activeDir += "/";
            }
        };

        return (
            <Modal {...this.props} title="Add Folder" animation={false}>
                <div className="modal-body">
                    <h4>Create a new sub folder</h4>
                    {activeDir} <input type="text" ref="folderName" label="Folder Name"/>
                </div>
                <div className="modal-footer">
                    <ButtonGroup>
                        <Button onClick={this.props.onRequestHide}>Close</Button>
                        <Button onClick={this.handleCreateFolder}>Create</Button>
                    </ButtonGroup>
                </div>
            </Modal>
        );
    }
});


var FolderTree = React.createClass({
    mixins: [ Router.Navigation ],

    getDefaultProps: function(){
        return {
            'section':'files',
            navigateToFiles:true};
    },
    
    getInitialState: function(){
        return {
            'folders':[],
            mode:'browse',
            activeFolder: {'path':'/dam:files/', 'children':[]}
        }
    },


    componentDidMount: function(){
        var _this = this;

        this.directoryStore = DirectoryStore.getDirectories("/dam:files/").subscribe(function(results_){
            console.log("get directories subscription");
            if (_this.isMounted())
            {
                _this.setState({'folders': results_});
            }
            //_this.forceUpdate();
        });


        // When we get a refresh dir event (after new folder is created) reload the dir tree
        this.directoryAction = DirectoryActions.refreshDirectories.subscribe(function(data_){
            DirectoryStore.getDirectories("/dam:files/").subscribe(function(results_){
                console.log("refresh directories subscription");
                if (_this.isMounted())
                {
                    _this.setState({'folders': results_});
                }
                //_this.forceUpdate();
            });
        });
    },

    componentWillUnmount: function(){
        if(this.directoryStore !== undefined ) this.directoryStore.dispose();
        if(this.directoryAction !== undefined ) this.directoryAction.dispose();
    },

    handleSelectDir: function(folder_){
        console.dir(folder_);
        if( this.isMounted() ) this.setState( {'activeFolder': folder_} );

        
        // send event that has will be picked up by the FilesView
        DirectoryActions.selectFolder.onNext(folder_);
        
        if( this.props.navigateToFiles )
        {
            this.transitionTo(this.props.section, {}, {'path': folder_.path});
        }


        /**
        if ( children !== undefined )
        {
            if (children.is(":visible")) children.hide('fast');
            else children.show('fast');
        } **/

    },

    handleAddFolder: function(){
        var _af = this.state.activeFolder;
        //_af.children.push("NEW_ITEM");
        if( this.isMounted() ) this.setState({"activeFolder":_af, 'mode':'add_item'});
    },

    render: function() {

        var _this = this;
        var _boundClick = _this.handleSelectDir.bind(this, {'path':'/dam:files/'});

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
                            <ListGroup>
                                {listItems(_f.children)}
                            </ListGroup>
                            
                        </ListGroupItem>

            })

        };
        //<ListGroup>{listItems(_f.children)}</ListGroup>

        return (
            <div className="folderTree">
                <div className="header">
                    <h3>Files
                        <ModalTrigger modal={<AddFolderModal dir={this.state.activeFolder.path} />}>
                            <Glyphicon glyph="plus"
                                    className="pull-right"
                                    onClick={this.handleAddFolder}/>
                        </ModalTrigger>
                    </h3>
                </div><br/>

                <ListGroup>
                    <ListGroupItem key="home">
                        <div className={_this.state.activeFolder.path=="/dam:files/"?'folderItem active':'folderItem'}
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
