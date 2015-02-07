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
var FileStore = require('./../../stores/FileStore');

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

        DirectoryActions.refreshDirectories.subscribe(function(data_){
            _this.loadData(_path, 100, 0);
        });
    },

    componentWillReceiveProps:function(nextProps)
    {
        this.loadData(nextProps.query.path, 100, 0);
    },


    loadData:function(folder_, limit_, offset_){
        //todo: make path dynamic
        var _this = this;
        _this.is = IS;

        FileStore.getFilesInDirectory(folder_).subscribe(function(results_) {
            if (_this.is.array(results_)) {
                _this.setState({'files': results_});
            }
        });
    },



    handleDirClick: function(event, component)
    {
        var _path =  $("[data-reactid='" + component + "']").attr("data-path");
        DirectoryActions.selectFolder.onNext(_path);

        this.transitionTo('files', {}, {'path':_path})
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


    handleNodeDelete: function(event, component)
    {
        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _path = $("[data-reactid='" + component + "']").attr("data-path");

        DirectoryStore.deleteFolder(_path).subscribe(function(results_){
            console.dir(results_);
            DirectoryActions.refreshDirectories.onNext(true);
        });
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


        var folders = this.state.files
            .filter( function(_file){
                return _file.type == "folder"
            } )
            .map( function(_file){
                return <tr key={_file.id} onClick={_this.handleDirClick}  data-id={_file.id}  data-path={_file.path}>
                        <td>
                            <img src="assets/icons/ic_folder_48px.svg" style={{'width':'48px', 'height':'48px', 'margin':'auto'}}/>

                        </td>
                        <td className="fileName" style={{'verticalAlign':'middle'}}>{_file.name}</td>
                        <td >
                            <ButtonGroup  bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>
                                <Button onClick={_this.handleNodeDelete} data-id={_file.id} data-path={_file.path}  style={{'padding':'5px 10px', 'margin':0}}>
                                    <Glyphicon glyph="remove"/> delete
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>

        });

        var files = this.state.files
            .filter( function(_file){
                return _file.type != "folder"
            } )
            .map( function(_file){
                return <tr key={_file.id} onClick={_this.handleRowClick}   data-id={_file.id}>
                        <td>
                            <img src={PreferenceStore.getBaseUrl() +_file.path +"?rendition=thumbnail.200&token=" +UserStore.getUser().token} style={{'width':'50px', 'height':'50px'}}/>
                        </td>
                        <td className="fileName">{_file.name}</td>
                        <td >
                            { _file.fileType == 'image' ?
                            <ButtonGroup  bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>
                                <ButtonLink to="photoDetails" params={{'id': _file.id}}  style={{'padding':'5px 10px', 'margin':0}}>
                                    <Glyphicon glyph="eye-open"/> view
                                </ButtonLink>
                                <ButtonLink to="photoEdit" params={{id: _file.id}}  style={{'padding':'5px 10px', 'margin':0}}>
                                    <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width':'14px', 'height':'14px', 'margin':'auto'}}/> edit
                                </ButtonLink>
                                <Button onClick={_this.handleNodeDelete} data-id={_file.id} data-path={_file.path}  style={{'padding':'5px 10px', 'margin':0}}>
                                    <Glyphicon glyph="remove"/> delete
                                </Button>
                            </ButtonGroup>
                            :
                            <ButtonGroup  bsSize="small">
                                <Button onClick={_this.handleNodeDelete} data-id={_file.id} data-path={_file.path}>
                                    <Glyphicon glyph="remove"/> delete
                                </Button>
                            </ButtonGroup>
                            }
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
                                {folders}
                                
                                {files}
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
