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

var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;

var FileUploadControls = require("./FileUploadControls");
var UploadActions = require("./../../actions/UploadActions");
var UploadStore = require("./../../stores/UploadStore");
var DirectoryStore = require("./../../stores/DirectoryStore");


var FileUploadView = React.createClass({


    getDefaultProps: function () {
        return {}
    },

    getInitialState: function () {
        return {}
    },

    componentWillMount: function () {
        var _this = this;
        UploadActions.addFileAction.subscribe(function (data_) {
            if( _this.isMounted() )
            {
                _this.forceUpdate();
            }
        });
        UploadActions.removeFileAction.subscribe(function (data_) {
            if( _this.isMounted() )
            {
                _this.forceUpdate();
            }
        });
    },

    componentDidMount: function () {
        //$(this.refs.fileInputField.getDOMNode()).fileinput(_options);
        //this.refs.folderInputField.getDOMNode().setAttribute("webkitdirectory", "");
        //this.refs.folderInputField.getDOMNode().setAttribute("directory", "");
    },


    handleRemoveFile: function(item_, event_, component_){
        //console.dir(item_);
        var _file = UploadStore.removeFile(item_);
        this.forceUpdate();
    },
    
    
    handleUploadSingleFile: function(item_, event_, component_){
        //console.dir(item_);
        UploadStore.uploadSingleFile(item_);
    },


    render: function () {
        var _this = this;

        
        var _fileList = UploadStore.getFiles();
        var _fileListSize = _fileList.length;


        var _fileControlsStyle  = {};
        if( _fileListSize == 0 ){
            _fileControlsStyle = {'top': '100px', 'position':'relative'};
        }

        return (
            <div className="FileUploadViews" >
                <div style={_fileControlsStyle}>
                    <FileUploadControls/>
                </div>
                
                {_fileListSize>0?
                <hr style={{'width':'100%'}}/>
                :""}
                
                <ul className="fileList">
                    {_fileList.map(function (result_) {
                        return <li key={result_.name}  style={{'height': '50px'}}>
                                    <div style={{'width': '100px', 'float':'left'}}>
                                        <Glyphicon glyph="remove"  style={{'padding': '8px 8px;', 'margin':'0px 0px'}}  className="btn" onClick={_this.handleRemoveFile.bind(_this, result_)}/>
                                        <Glyphicon glyph="cloud-upload" style={{'padding': '8px 8px;', 'margin':'0px 0px'}} className="btn" onClick={_this.handleUploadSingleFile.bind(_this, result_)}/>
                                    </div>
                                    <div style={{'float':'left', 'padding-top': '8px'}}>
                                           <span style={{'vertical-align':'middle'}}>{result_.name}</span>
                                    </div>
                                </li>;
                    })}
                </ul>
            </div>
        )
    }

});

module.exports = FileUploadView;

