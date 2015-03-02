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
var addons = require('react-addons');

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

        var activeVisibleDir = this.activeDir;
        
        return (
            <Modal {...this.props} title="Add Folder" animation={false}>
                <div className="modal-body">
                    <h4>Create a new sub folder</h4>
                    {activeVisibleDir} <input type="text" ref="folderName" label="Folder Name"/>
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

    
    propTypes: {
        title: React.PropTypes.string,
        baseDir: React.PropTypes.string,
        showAddFolder: React.PropTypes.bool
    },

    getDefaultProps: function(){
        return {
            'section':'files',
            'baseDir':null,
            'showAddFolder':false,
            renderDepth:2,
            navigateToFiles:true};
    },

    getInitialState: function(){
        return {
            'folders':[],
            mode:'browse',
            activeFolder: {}
        }
    },


    componentDidMount: function(){
        var _this = this;

        if( this.props.baseDir != null )
        {
            DirectoryStore.getDirectories(_this.props.baseDir).subscribe(function (results_) {
                console.log("get directories subscription");
                _this.setState({'folders': results_});
                //_this.forceUpdate();
            });


            // When we get a refresh dir event (after new folder is created) reload the dir tree
            DirectoryActions.refreshDirectories.subscribe(function (data_) {
                DirectoryStore.getDirectories(_this.props.baseDir).subscribe(function (results_) {
                    console.log("refresh directories subscription");
                    _this.setState({'folders': results_});
                    //_this.forceUpdate();
                });
            });
        }
    },

    componentWillUnmount: function(){

    },

    handleSelectDir: function(folder_, a1_, a2_){
        //console.log("{handle select dir}");
        //console.dir(folder_);
        this.setState( {'activeFolder': folder_} );

        
        // send event that has will be picked up by the FilesView
        DirectoryActions.selectFolder.onNext(folder_);
        
        if( this.props.navigateToFiles )
        {
            //this.transitionTo(this.props.section, {}, {'path': folder_.path});
        }
    },
    

    handleAddFolder: function(){
        var _af = this.state.activeFolder;
        //_af.children.push("NEW_ITEM");
        this.setState({"activeFolder":_af, 'mode':'add_item'});
    },
    
    
    isParentPath: function(path_, activePath_){
        var _isParentPath = false;
        if( activePath_ !== undefined ) {
            var pathSections = path_.split("/");
            var activeSections = activePath_.split("/");
            for (var i = 0; i < activeSections.length; i++)
            {
                var sec = pathSections[i];
                if( sec == activeSections[i] ){
                    _isParentPath = true;
                }else if( sec != activeSections[i] ){
                    _isParentPath = false;
                    break;
                }

                if( Math.abs(pathSections.length - activeSections.length) > 1 ){
                    _isParentPath = false;
                    break;
                }
            }
        }
        return _isParentPath;
    },

    render: function() {

        var _this = this;
        var _depth = 0;
        var _boundClick = _this.handleSelectDir.bind(this, {'path':this.props.baseDir});
 
        var listItems = function(_folders, expand_)
        {
            return _folders.map(function(_f)  {

                var _isParentPath = _this.isParentPath(_f.path, _this.state.activeFolder.path)
                
                var classes = addons.classSet({
                    'has-children': ( (_f.children && _f.children.length > 0) ? true : false),
                    'open': ( (expand_ || _isParentPath) ? true : false),
                    'closed': ( (expand_ || _isParentPath) ? false : true),
                    'selected': false /*todo*/
                });

                var _boundClick = _this.handleSelectDir.bind(_this, _f);

                    return <ListGroupItem key={_f.path} className={classes}>
                        <div className="folderItem"
                             style={{'cursor': 'pointer'}}
                             className={_this.state.activeFolder == _f ? 'folderItem active' : 'folderItem'}
                             onClick={_boundClick}>
                            <Glyphicon glyph="chevron-right"/>
                            <strong style={{'paddingLeft': '3px'}}>{_f.name}</strong>
                        </div>
                        <ListGroup>
                            {listItems(_f.children, false  )}
                        </ListGroup>

                    </ListGroupItem>

            })

        };
        //<ListGroup>{listItems(_f.children)}</ListGroup>

        return (
            <div className="folderTree">
                <div className="header">
                    <h3>{this.props.title}
                        {this.props.showAddFolder==true ?
                        <ModalTrigger modal={<AddFolderModal dir={this.state.activeFolder.path} />}>
                            <Glyphicon glyph="plus"
                                    className="pull-right"
                                    onClick={this.handleAddFolder}/>
                        </ModalTrigger>
                        :""}
                    </h3>
                </div><br/>

                <ListGroup>
                    {this.props.baseDir?
                    <ListGroupItem key="home">
                        <div
                            style={{'cursor':'pointer'}}
                            onClick={_boundClick}>
                            <Glyphicon glyph="chevron-right"/>
                            <strong style={{'paddingLeft':'3px'}}>Home</strong>
                        </div>
                        <ListGroup>
                            {listItems(this.state.folders, true)}
                        </ListGroup>
                    </ListGroupItem> 
                    :""}
                </ListGroup>

            </div>
        );
    }

});

module.exports = FolderTree;
