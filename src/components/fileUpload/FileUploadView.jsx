

/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
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

        this.addFileSubscription = UploadActions.addFileAction.subscribe(function (data_) {
            if( _this.isMounted() ) _this.forceUpdate();
        });
        this.removeFileSubscription = UploadActions.removeFileAction.subscribe(function (data_) {
            if( _this.isMounted() ) _this.forceUpdate();
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
        UploadActions.uploadFileAction.source.onNext(file_);
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
                                    <div style={{'float':'left', 'paddingTop': '8px'}}>
                                           <div style={{'verticalAlign':'middle'}}>{result_.name}</div>
                                           <div style={{'verticalAlign':'middle'}}><strong>copy to:</strong> {result_.uploadPath}</div>
                                    </div>
                                </li>;
                    })}
                </ul>
            </div>
        )
    }
});

module.exports = FileUploadView;

