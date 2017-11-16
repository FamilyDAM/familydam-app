/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";
//import AppActions from "../../actions/AppActions";
import {FormattedMessage} from 'react-intl'; //, FormattedPlural, FormattedDate
import filesize from 'filesize';
import uuid from 'uuid';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
//import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';

import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import {CircularProgress, LinearProgress} from 'material-ui/Progress';
import CheckIcon from 'material-ui-icons/Check';
import FileUploadIcon from 'material-ui-icons/FileUpload';

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
        this.setState({isReceiverOpen: true});
    }

    handleOnDragOver(e) {
        // your codes here
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
        // close the Receiver after file dropped

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            _fileList.push(file);
            if (!file.id) {
                file.id = uuid();
            }
            file.progress = 0;
            file.uploadPath = this.props.path;
            FileActions.uploadFile.source.next(file);
        }

        this.setState({isReceiverOpen: false, files: _fileList});
    }


    render() {
        var classes = this.props.classes;

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


        var completedFiles = this.state.files.filter(file_ => file_.progress === 100).length;
        var completedFilesPercentage = 100 * (completedFiles / this.state.files.length);


        return (
            <Dialog
                ignoreBackdropClick
                ignoreEscapeKeyUp
                maxWidth="md"
                fullScreen={true}
                open={this.props.open}
                transition={SlideTransition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Import Files
                        </Typography>
                        <Button onClick={this.handleClose} color="contrast" disabled={completedFiles !== this.state.files.length}>
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
                        style={{marginLeft: '24px', marginRight: '24px', marginBottom: '24px', height: '100%', 'border': '1px #ccc dashed'}}
                        isOpen={true}
                        onDragEnter={this.handleOnDragEnter}
                        onDragOver={this.handleOnDragOver}
                        onDragLeave={this.handleOnDragLeave}
                        onFileDrop={this.handleAddFile}>

                        {this.state.files.length === 0 &&
                        <Table style={{minHeight: '150px', maxHeight: '70%', minWidth: '50%', margin:'24px'}}>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{padding: '0 8px 0 8px'}}>
                                        <div onClick={this.handleSelectFileBtnClick} style={{margin: '40px', textAlign: 'center'}}>
                                            Click or drag files to this area to upload
                                            <div style={{margin: '16px'}}>
                                                <FileUploadIcon/>
                                            </div>
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
                        <LinearProgress mode="determinate" value={completedFilesPercentage}/>
                        <Typography>Files will be added to: <strong>{this.props.path}</strong></Typography>
                    </div>
                }


                {(this.state.files.length > 0 && filteredFiles.length > 0) &&
                    <div  style={{marginLeft: '24px', marginRight: '24px', height: '100%', top:'180px', position: 'absolute'}}>
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
                                                :
                                                <CheckIcon color="green"/>
                                            }
                                        </TableCell>
                                        <TableCell style={{padding: '0 8px 0 8px'}}>
                                            <Typography>{file_.name}</Typography>
                                            <Typography>{file_.path} {file_.webkitRelativePath}  {file_.error}</Typography>
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