

/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var UUID = require('uuid-js');

import {
    FontIcon,
    IconButton,
    Paper,
    RaisedButton,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator
} from 'material-ui';


var FileUploadControls = require("./FileUploadControls.jsx");
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

        this.addFileSubscription = UploadActions.addFileAction.subscribe(function (data_) {
            if( _this.isMounted() ) _this.forceUpdate();
        });
        this.removeFileSubscription = UploadActions.removeFileAction.subscribe(function (data_) {
            //if( _this.isMounted() ) _this.forceUpdate();
        });
    },

    componentDidMount: function () {
        //$(this.refs.fileInputField.getDOMNode()).fileinput(_options);
        //this.refs.folderInputField.getDOMNode().setAttribute("webkitdirectory", "");
        //this.refs.folderInputField.getDOMNode().setAttribute("directory", "");
    },

    componentWillUnmount: function () {
        if( this.addFileSubscription !== undefined ){
            this.addFileSubscription.dispose();
        }
        if( this.removeFileSubscription !== undefined ){
            this.removeFileSubscription.dispose();
        }
    },


    handleRemoveFile: function(item_, event_, component_){
        //console.dir(item_);
        UploadActions.removeFileAction.onNext(item_);

    },


    handleUploadSingleFile: function(file_, event_, component_){
        //console.dir(item_);
        var _files = [];
        _files.push(file_);
        UploadActions.uploadFileAction.source.onNext(_files);
    },


    handleUploadAllFiles:function(){
        UploadActions.uploadAllFilesAction.onNext(true);
    },


    handleRemoveAll:function(){
        UploadActions.removeAllFilesAction.onNext(true);
        if( this.isMounted() ) this.forceUpdate();
    },



    render: function () {
        var _this = this;


        var _fileList = UploadStore.getFiles();
        var _fileListSize = _fileList.length;



        return (
            <div className="row">
                <div className="col-xs-10 col-xs-offset-1">

                    <Paper zDepth={1}>

                        {(() => {

                            if( _fileList.length == 0 ){
                                return (<FileUploadControls
                                    mode="full"
                                    currentFolder={this.props.currentFolder}
                                    uploadPath={this.props.uploadPath}/>);

                            }else{
                                return (
                                <Table>
                                    <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                                        <TableRow>
                                            <TableHeaderColumn colSpan="2" style={{textAlign: 'left'}}>
                                                <FileUploadControls
                                                    mode="simple"
                                                    currentFolder={this.props.currentFolder}
                                                    uploadPath={this.props.uploadPath}/>
                                            </TableHeaderColumn>
                                            <TableHeaderColumn colSpan="3" style={{textAlign: 'right'}}>
                                                <RaisedButton label="Remove All Files"
                                                              onTouchTap={this.handleRemoveAll}
                                                              style={{'marginRight':'10px'}}/>
                                                <RaisedButton label="Upload All Files"
                                                              primary={true}
                                                              onTouchTap={this.handleUploadAllFiles}/>
                                            </TableHeaderColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableHeaderColumn colSpan="2" >Name</TableHeaderColumn>
                                            <TableHeaderColumn colSpan="1" >Type</TableHeaderColumn>
                                            <TableHeaderColumn colSpan="1" >Size</TableHeaderColumn>
                                            <TableHeaderColumn colSpan="1" >Actions</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        showRowHover={true}
                                        stripedRows={false}>

                                            {_fileList.map(function (result_, a2, a3) {

                                                if( !result_.id ){
                                                    result_.id = UUID.create().toString();
                                                }

                                                var _key = result_.name +'/' +result_.id;
                                                if( result_.uploadPath ){
                                                    _key = result_.uploadPath +'/' +result_.name +'/' +result_.id;
                                                }

                                                //<Glyphicon glyph="remove"  style={{'padding': '8px 8px;', 'margin':'0px 0px'}}  className="btn" onClick={_this.handleRemoveFile.bind(_this, result_)}/>
                                                //<Glyphicon glyph="cloud-upload" style={{'padding': '8px 8px;', 'margin':'0px 0px'}} className="btn" onClick={_this.handleUploadSingleFile.bind(_this, result_)}/>

                                                return (
                                                    <TableRow key={_key}>
                                                        <TableRowColumn colSpan="2">
                                                            {result_.name}
                                                            <br/>
                                                            <span>{result_.webkitRelativePath}</span>
                                                        </TableRowColumn>
                                                        <TableRowColumn colSpan="1">{result_.type}</TableRowColumn>
                                                        <TableRowColumn colSpan="1">{result_.size}</TableRowColumn>
                                                        <TableRowColumn colSpan="1">
                                                            <IconButton
                                                                    tooltip="Upload Single File"
                                                                    onClick={()=>{_this.handleUploadSingleFile(result_)}}><FontIcon className="material-icons">backup</FontIcon></IconButton>
                                                            <IconButton
                                                                    tooltip="Remove File"
                                                                    onClick={()=>{_this.handleRemoveFile(result_)}}><FontIcon className="material-icons">delete_forever</FontIcon></IconButton></TableRowColumn>
                                                    </TableRow>
                                                );

                                            })}

                                    </TableBody>
                                </Table>
                                );
                            }
                        })()}

                    </Paper>
                </div>
            </div>
        )
    }
});

/****
 *
 *

 <span>Hello</span>
 <Table>
 <TableRow>
 <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
 <span>test 123</span>
 <div className="file-wrapper" onClick={this.clickFileInputField}
 style={{'width':'200px', 'margin':'10px'}}>
 <input type="file"
 ref="fileInputField"
 onChange={this.handleFileChange}
 style={{'display':'none'}}
 multiple="true"/>

 <RaisedButton label="Select Files" primary={true} style={{'width':'100%'}}/>
 </div>
 <div className="file-wrapper" onClick={this.clickFolderInputField}
 style={{'width':'200px', 'margin':'10px'}}>
 <input type="file"
 ref="folderInputField"
 onChange={this.handleFolderChange}
 style={{'display':'none'}}
 multiple="true" webkitdirectory="webkitdirectory" directory="true"/>

 <RaisedButton label="Select Folder" primary={true} style={{'width':'100%'}}/>
 </div>
 </TableHeaderColumn>
 </TableRow>
 <TableRow>
 <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
 <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
 <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
 </TableRow>
 <TableBody
 displayRowCheckbox={false}
 showRowHover={true}
 stripedRows={false}
 >

 </TableBody>
 </Table>




 *
 <ul className="fileList">
 {_fileList.map(function (result_) {
     return <li key={result_.name}  style={{'height': '50px'}}>
                 <div style={{'width': '100px', 'float':'left'}}>
                     <Glyphicon glyph="remove"  style={{'padding': '8px 8px;', 'margin':'0px 0px'}}  className="btn" onClick={_this.handleRemoveFile.bind(_this, result_)}/>
                     <Glyphicon glyph="cloud-upload" style={{'padding': '8px 8px;', 'margin':'0px 0px'}} className="btn" onClick={_this.handleUploadSingleFile.bind(_this, result_)}/>
                 </div>
                 <div style={{'float':'left', 'paddingTop': '8px'}}>
                        <div style={{'verticalAlign':'middle'}}>{result_.name}</div>
                        <div style={{'verticalAlign':'middle'}}><strong>copy to:</strong> {result_.uploadPath}</div>
                 </div>
             </li>;
 })}
 </ul>
 */

module.exports = FileUploadView;

