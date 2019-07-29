/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
//import AppActions from "../../actions/AppActions";
import {FormattedMessage} from 'react-intl'; //, FormattedPlural, FormattedDate
import filesize from 'filesize';
import uuid from 'uuid';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
//import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import FileUploadIcon from '@material-ui/icons/CloudUpload';

import {Receiver} from 'react-file-uploader';
import FileActions from '../../actions/FileActions';



const styleSheet = (theme) => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
});


function SlideTransition(props) {
    return <Slide direction="up" {...props} />;
}


class UploadDialog extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted: true,
            isReceiverOpen: false,
            files: [],
            filter: 'all'
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFolderChange = this.handleFolderChange.bind(this);
        this.handleSelectFileBtnClick = this.handleSelectFileBtnClick.bind(this);
        this.handleSelectFolderBtnClick = this.handleSelectFolderBtnClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted: true, files: []});


        //.takeWhile(() => this.state.isMounted)
        FileActions.uploadFile.sink.subscribe((file_) => {
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if (file_.id === _fileInState.id) {
                    _fileInState.progress = 100;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


        FileActions.uploadProgress.subscribe(file_ => {
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if (file_.id === _fileInState.id && file_.progress !== 100) {
                    _fileInState.progress = file_.progress;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


        FileActions.uploadError.subscribe((file_) => {
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if (file_.id === _fileInState.id) {
                    _fileInState.error = file_.error;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


    }


    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    handleClose() {
        this.setState({files: [], filter: "all"});

        if (this.props.onClose) {
            this.props.onClose();
        }
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

    handleFilterChange(event) {
        //debugger;
        this.setState({filter: event.target.value});
    }


    handleSelectFileBtnClick(event) {
        //debugger;
        this.refs.fileInputField.click();
    }

    handleSelectFolderBtnClick(event) {
        this.refs.folderInputField.setAttribute("directory", "directory");
        this.refs.folderInputField.setAttribute("webkitdirectory", "webkitdirectory");
        this.refs.folderInputField.click();
    }


    handleFileChange(event, files) {
        var _files = event.currentTarget.files;
        this.handleAddFile(event, _files);
    }

    handleFolderChange(event) {
        var _files = event.currentTarget.files;
        this.handleAddFile(event, _files);
    }


    handleAddFile(e, files) {
        var _fileList = this.state.files;
        var _items = e.dataTransfer.items;
        // close the Receiver after file dropped

        var processFile = function(file_, path_, relPath_){
            _fileList.push(file_);
            if (!file_.id) {
                file_.id = uuid();
            }
            file_.progress = 0;
            file_.uploadPath = path_;
            if( relPath_ ){
                file_.relativePath = relPath_;
            }
            FileActions.uploadFile.source.next(file_);
        };

        var readDir = function(entry, file, path){
            // Get folder contents
            //var file = dataTransferItem.getAsFile();
            var dirReader = entry.createReader();
            dirReader.readEntries(function(entries) {

                for (let j = 0; j < entries.length; j++) {
                    var entry = entries[j];
                    console.dir(entry);
                    console.dir(entry.file);
                    console.dir(entry.fullPath);
                    const relPath = entry.fullPath;
                    if(entry.isFile) {
                        entry.file( (f)=>{
                            processFile(f, path, relPath);
                        });
                    }else if (entry.isDirectory) {
                        readDir(entry, file, path);
                    }
                }

            });
        };

        for (var i = 0; i < _items.length; i++) {
            const _path = this.props.path;
            var dataTransferItem = _items[i];
            var file = dataTransferItem.getAsFile();
            var entry = dataTransferItem.webkitGetAsEntry();

            if( entry.isFile ) {
                processFile(file, _path)
            }else if (entry.isDirectory) {
                readDir(entry, file, _path);
            }
        }

        this.setState({isReceiverOpen: false, files: _fileList});
    }


    render() {
        var classes = this.props.classes;

        var completedFiles = this.state.files.filter(file_ => file_.progress === 100).length;
        var completedFilesPercentage = 100 * (completedFiles / this.state.files.length);


        var filteredFiles =
            this.state.files.filter(file_ => {
                if (this.state.filter === "completed") {
                    return file_.progress === 100;
                } else if (this.state.filter === "uploading") {
                    return file_.progress > 0 && file_.progress < 100;
                } else if (this.state.filter === "waiting") {
                    return file_.progress === 0;
                } else {
                    return true; //all
                }
            });



        console.log("render")
        let uploadDragBorderStyles = {marginLeft: '24px', marginRight: '24px', marginBottom: '24px', height: '100%', 'border': '3px #ccc dashed'};
        if( this.state.isReceiverOpen ){
            uploadDragBorderStyles.border = '5px #ccc dashed';
        }



        return (
            <Dialog
                maxWidth="md"
                fullScreen={true}
                open={this.props.open}
                transition={SlideTransition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Import Files
                        </Typography>
                        <Button onClick={this.handleClose} disabled={completedFiles !== this.state.files.length} style={{'color':'white'}}>
                            close
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{paddingTop: '24px', paddingBottom: '24px', width: '100%', display: 'flex'}}>
                    <Button className="btn btn-default" onClick={this.handleSelectFileBtnClick}>
                        <FormattedMessage
                            id="selectFiles"
                            defaultMessage="Select Files"
                        />
                    </Button>
                    <Button className="btn btn-default" onClick={this.handleSelectFolderBtnClick}>
                        <FormattedMessage
                            id="selectFiles"
                            defaultMessage="Select Folder"
                        />
                    </Button>

                    <Select
                        value={this.state.filter}
                        onChange={this.handleFilterChange}
                        defaultValue={"all"}
                        input={<Input id="filterInput"/>}
                        style={{textAlign: 'right', right: '24px', position: 'absolute', minWidth: '100px'}}
                        autoWidth
                    >
                        <MenuItem value="all"><em>All</em></MenuItem>
                        <MenuItem value="waiting">Waiting</MenuItem>
                        <MenuItem value="uploading">Uploading</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </div>


                {this.state.files.length === 0 &&
                    <Receiver
                        style={uploadDragBorderStyles}
                        isOpen={true}
                        onDragEnter={this.handleOnDragEnter}
                        onDragOver={this.handleOnDragOver}
                        onDragLeave={this.handleOnDragLeave}
                        onFileDrop={this.handleAddFile}>

                        {this.state.files.length === 0 &&
                        <Table style={{minHeight: '150px', maxHeight: '70%', minWidth: '50%', margin:'24px'}}>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{padding: '0 8px 0 8px', border: '0px'}}>
                                        <div onClick={this.handleSelectFileBtnClick} style={{margin: '40px', textAlign: 'center', fontSize:'1.4rem'}}>
                                            Click or drag files to this area to upload
                                            <div style={{margin: '16px'}}>
                                                <FileUploadIcon style={{fontSize:'2rem'}}/>
                                            </div>
                                            <p style={{fontSize:'1rem'}}>
                                                {this.props.path}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        }
                    </Receiver>
                }

                {this.state.files.length > 0  &&
                    <div style={{paddingLeft:'24px', paddingRight:'24px', position:'absolute', top:'135px', right:'24px', left:'24px'}}>
                        <Typography style={{'display': 'inline'}}>{completedFiles} / {this.state.files.length}</Typography>
                        <LinearProgress variant="determinate" value={Math.min(completedFilesPercentage, 100)}/>
                        <Typography>Files will be added to: <strong>{this.props.path}</strong></Typography>
                    </div>
                }


                {(this.state.files.length > 0 && filteredFiles.length > 0) &&
                    <div  style={{marginLeft: '24px', marginRight: '24px', height: '100%', top:'180px', position: 'absolute', left:'16px', right:'16px'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width: '32px', padding: '0 8px 0 8px'}}></TableCell>
                                <TableCell style={{width: '100%', padding: '0 8px 0 8px'}}>Name</TableCell>
                                <TableCell style={{width: '50px', padding: '0 8px 0 8px'}} numeric>Size</TableCell>
                                <TableCell style={{width: '50px', padding: '0 8px 0 8px'}} numeric>Progress</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFiles.map(file_ => {
                                return (
                                    <TableRow key={file_.id}>
                                        <TableCell style={{padding: '0 8px 0 8px'}}>
                                            {file_.progress < 100 ?
                                                <CircularProgress size={24}/>
                                                :<CheckIcon color="primary"/>
                                            }
                                        </TableCell>
                                        <TableCell style={{padding: '0 8px 0 8px'}}>
                                            <Typography>{file_.name}</Typography>
                                            <Typography>{file_.webkitRelativePath}  {file_.error}</Typography>
                                        </TableCell>
                                        <TableCell style={{padding: '0 8px 0 8px'}} numeric>{filesize(file_.size, {base: 10})}</TableCell>
                                        <TableCell style={{padding: '0 8px 0 8px'}} numeric>
                                            {Math.round(file_.progress)}%
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    </div>
                }



                <input type="file"
                       ref="fileInputField"
                       multiple
                       style={{'display': 'none'}}
                       onChange={this.handleFileChange}/>
                <input type="file"
                       ref="folderInputField"
                       style={{'display': 'none'}}
                       onChange={this.handleFolderChange}/>


            </Dialog>

        );
    }

}


export default withStyles(styleSheet)(UploadDialog);