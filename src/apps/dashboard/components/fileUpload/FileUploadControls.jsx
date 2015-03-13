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
var Rx = require('rx');
var React = require('react');
var UploadStore = require("../../stores/UploadStore");
var DirectoryStore = require("../../stores/DirectoryStore");
var DirectoryActions = require("../../actions/DirectoryActions");

var Button = require('react-bootstrap').Button;


var FileUploadControls = React.createClass({


    getDefaultProps: function(){
        return {}
    },

    getInitialState: function(){
        return {"uploadPath":"/"}
    },

    componentWillMount: function(){
        
    },
    
    componentDidMount: function(){
        var _this = this;
        DirectoryActions.selectFolder.subscribe(function(d_){
            _this.setState( {"uploadPath": d_.path} );
            _this.setState( {"uploadPathFriendly": d_.path.replace('/dam:files/', '/')} );
        });
        
        
        DirectoryActions.uploadCompleteFileAction.subscribe(function(file_){
            console.log("** upload complete file action **");
            console.dir(file_);
            _this.forceUpdate();
        });
        
        //$(this.refs.fileInputField.getDOMNode()).fileinput(_options);
        //this.refs.folderInputField.getDOMNode().setAttribute("webkitdirectory", "");
        //this.refs.folderInputField.getDOMNode().setAttribute("directory", "");
    },

    handleFileChange: function(event_){
        console.dir(event_);
        var _files = event_.currentTarget.files;
        console.dir(_files);
        
        var _this = this;

        Rx.Observable.from(_files).forEach(function(item_){
            UploadStore.addFile(item_);
        })
        
        //save for later, dir check
        // if( _file.webkitRelativePath.length > 0 && _file.path.endsWith(_file.webkitRelativePath) ) {//is a dir.}

    },

    handleUploadAllFiles:function(){
        UploadStore.uploadAllFiles(this.state.uploadPath);
    },


    handleRemoveAll:function(){
        UploadStore.removeAll();
    },

    
    clickFileInputField:function(){
        this.refs.fileInputField.getDOMNode().click();
    },
    


    render: function() {
        var _this = this;

        var _fileList = UploadStore.getFiles();
        var _uploadFolders = "/home/photos/mike/2015/02-12-2015";//DirectoryStore.getLastSelectedFolder().subscribe(function(d_){return d_;});

        
        var _selectFileBtnClass = "btn btn-primary btn-raised";
        var _uploadFileBtnClass = "btn btn-default btn-raised";
        var _removeBtnClass = "btn btn-default btn-raised";
        
        if( _fileList.length > 0){
            _selectFileBtnClass = "btn btn-default btn-raised";
            _uploadFileBtnClass = "btn btn-primary btn-raised";
            _removeBtnClass = "btn btn-default btn-raised";
        }

        return (
            <div className="FileUploadControls container" >
                <div className="row">
                    <div className="col-sm-4">
                        <div className="background">
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="">
                            <p>
                                <span>Select one or more files to copy into your FamilyD.A.M.</span>
                            </p>
                            <div className="file-wrapper" onClick={this.clickFileInputField} style={{'width':'100%'}}>
                                <input type="file"
                                    ref="fileInputField"
                                    onChange={this.handleFileChange}
                                    multiple="true"/>
                                <span className={_selectFileBtnClass} style={{'width':'360px'}}>Select Files</span>
                            </div>
                            <br/>
                            <div className="file-wrapper" onClick={this.handleUploadAllFiles}>
                                <span className={_uploadFileBtnClass}>Upload All Files</span>
                            </div>

                            <div className="file-wrapper" onClick={this.handleRemoveAll}>
                                <span className={_removeBtnClass}>Remove All Files</span>
                            </div>

                            <p>
                                <span>Files will be copied into: <strong>{this.state.uploadPathFriendly}</strong></span>
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }

});

module.exports = FileUploadControls;
