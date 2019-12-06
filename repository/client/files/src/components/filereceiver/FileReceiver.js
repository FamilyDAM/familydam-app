import React, {Component} from 'react';
import uuid from 'uuid';
import {Receiver} from 'react-file-uploader';


//const styleSheet = (theme) => ({});

class FileReceiver extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isMounted: true
        };

        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
    }

    componentWillMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }

    handleOnDragEnter(e) {
        //console.log("onDragEnter");
        this.setState({isReceiverOpen: true});
    }

    handleOnDragOver(e) {
        // your codes here
        if( this.state.isReceiverOpen ) {
            this.setState({isReceiverOpen: true});
        }
    }

    handleOnDragLeave(e) {
        this.setState({isReceiverOpen: false});
    }

    handleAddFile(e, files) {
        //var _fileList = [];
        // close the Receiver after file dropped

        var processFile = function(file_, path_, relPath_){
            //_fileList.push(file_);
            if (!file_.id) {
                file_.id = uuid();
            }
            file_.progress = 0;
            file_.status = "uploadReady";
            file_.uploadPath = path_;
            file_.uploadProgress = 30.0;
            if( relPath_ ){
                file_.relativePath = relPath_;
            }
            this.props.onFileDrop(file_);
        }.bind(this);


        var readDir = function (entry, file, path) {
            // Get folder contents
            //var file = dataTransferItem.getAsFile();
            var dirReader = entry.createReader();
            dirReader.readEntries(function (entries) {

                for (let j = 0; j < entries.length; j++) {
                    var entry = entries[j];
                    console.dir(entry);
                    console.dir(entry.file);
                    console.dir(entry.fullPath);
                    const relPath = entry.fullPath;
                    if (entry.isFile) {
                        entry.file((f) => {
                            processFile(f, path, relPath);
                        });
                    } else if (entry.isDirectory) {
                        readDir(entry, file, path);
                    }
                }

            });
        };

        if( e.dataTransfer ) {
            var _items = e.dataTransfer.items;
            for (var i = 0; i < _items.length; i++) {
                const _path = this.props.path;
                var dataTransferItem = _items[i];
                var file = dataTransferItem.getAsFile();
                var entry = dataTransferItem.webkitGetAsEntry();

                if (entry.isFile) {
                    processFile(file, _path)
                } else if (entry.isDirectory) {
                    readDir(entry, file, _path);
                }
            }
        } else if( files ){
            const _path = this.props.path;
            for (const file of files) {
                processFile(file, _path);
            }
        }
    }

    render() {
        //var classes = this.props.classes;

        return (
            <Receiver
                onDragEnter={this.handleOnDragEnter}
                onDragOver={this.handleOnDragOver}
                onDragLeave={this.handleOnDragLeave}
                onFileDrop={this.handleAddFile}/>
        )
    }
}

export default FileReceiver;