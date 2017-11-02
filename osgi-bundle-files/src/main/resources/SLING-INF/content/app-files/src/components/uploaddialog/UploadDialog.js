/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";
//import AppActions from "../../actions/AppActions";
import {FormattedMessage} from 'react-intl'; //, FormattedPlural, FormattedDate
import filesize from 'filesize';
import uuid from 'uuid';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
//import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';

import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import {CircularProgress,LinearProgress} from 'material-ui/Progress';
import CheckIcon from 'material-ui-icons/Check';
import FileUploadIcon from 'material-ui-icons/FileUpload';

import { Receiver } from 'react-file-uploader';
import FileActions from '../../actions/FileActions';


const styleSheet = (theme) => ({ });


class UploadDialog extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isReceiverOpen:false,
            files:[],
            filter:'uploadingAndWaiting'
        };

        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFolderChange = this.handleFolderChange.bind(this);
        this.handleSelectFileBtnClick = this.handleSelectFileBtnClick.bind(this);
        this.handleSelectFolderBtnClick = this.handleSelectFolderBtnClick.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted:true});


        //.takeWhile(() => this.state.isMounted)
        FileActions.uploadFile.sink.subscribe((file_)=>{
            debugger;
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if( file_.id === _fileInState.id ){
                    _fileInState.progress = 100;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


        FileActions.uploadProgress.subscribe(file_=>{
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if( file_.id === _fileInState.id && file_.progress !== 100 ){
                    _fileInState.progress = file_.progress;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


        FileActions.uploadError.subscribe((file_)=>{
            debugger;
            let _files = [];
            for (var i = 0; i < this.state.files.length; i++) {
                var _fileInState = this.state.files[i];
                if( file_.id === _fileInState.id ) {
                    _fileInState.error = file_.error;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });


    }


    componentWillUnmount(){
        debugger;
        this.setState({isMounted:false});
    }


    handleOnDragEnter(e) {
        this.setState({ isReceiverOpen: true });
    }
    handleOnDragOver(e) {
        // your codes here
    }
    handleOnDragLeave(e) {
        this.setState({ isReceiverOpen: false });
    }

    handleSelectFileBtnClick(event){
        //debugger;
        this.refs.fileInputField.click();
    }

    handleSelectFolderBtnClick(event){
        this.refs.folderInputField.setAttribute("directory", "directory");
        this.refs.folderInputField.setAttribute("webkitdirectory", "webkitdirectory");
        this.refs.folderInputField.click();
    }


    handleFileChange(event, files){
        debugger;
        var _files = event.currentTarget.files;
        this.handleAddFile(event, _files);
    }

    handleFolderChange(event){
        debugger;
        var _files = event.currentTarget.files;
        this.handleAddFile(event, _files);
    }


    handleAddFile(e, files){
        debugger;
        var _fileList = this.state.files;
        // close the Receiver after file dropped

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            _fileList.push(file);
            if( !file.id){
                file.id = uuid();
            }
            file.progress = 0;
            file.uploadPath=this.props.path;
            FileActions.uploadFile.source.next(file);
        }

        this.setState({ isReceiverOpen: false,  files: _fileList });
    }


    render() {
        //var classes = this.props.classes;

        var filteredFiles =
            this.state.files.filter(file_ => {
                if( this.state.filter === "completed") {
                    return file_.progress === 100;
                }else if( this.state.filter === "uploading") {
                    return file_.progress > 0 && file_.progress < 100;
                }else if( this.state.filter === "waiting") {
                    return file_.progress === 0;
                }else if( this.state.filter === "uploadingAndWaiting") {
                    return file_.progress === 0 && file_.progress < 100;
                }else {
                    return true;
                }
            });

        var completedFiles = 0;
        if( this.state.filter === "completed"){
            completedFiles = this.state.files.length - filteredFiles.length;
        }else{
            completedFiles = this.state.files.filter(file_ => file_.progress === 100);
        }



        return (
            <Dialog
                ignoreBackdropClick
                ignoreEscapeKeyUp
                maxWidth="md"
                fullScreen={false}
                open={this.props.open}
                transition={<Slide direction="up" />}>
                <DialogTitle>Add Files</DialogTitle>
                <DialogContent>

                    <div style={{minWidth:'500px'}} >

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

                        <br/><br/>
                        <Receiver
                            style={{width:'100%', height:'100%','border': '1px #ccc dashed'}}
                            isOpen={true}
                            onDragEnter={this.handleOnDragEnter}
                            onDragOver={this.handleOnDragOver}
                            onDragLeave={this.handleOnDragLeave}
                            onFileDrop={this.handleAddFile}>

                            {this.state.files.length === 0 &&
                                <div onClick={this.handleSelectFileBtnClick} style={{margin:'40px', textAlign:'center'}}>
                                    Click or drag files to this area to upload
                                    <div style={{margin:'16px'}}>
                                        <FileUploadIcon/>
                                    </div>
                                </div>
                            }


                            {(this.state.files.length > 0  && filteredFiles.length > 0) &&
                            <Table style={{maxHeight:'300px'}}>
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
                                                    <Typography>{file_.error} {file_.path} {file_.webkitRelativePath}</Typography>
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
                            }

                            {this.state.files.length > 0 && filteredFiles.length == 0 &&
                                <div style={{'textAlign':'center'}}>
                                    <Typography>All Files have been uploaded</Typography>
                                </div>
                            }

                        </Receiver>
                        <p>
                        Files will be added to: <strong>{this.props.path}</strong>
                        </p>
                        {this.state.files.length > 0 &&
                        <div>
                            <LinearProgress mode="determinate" value={completedFiles}/>
                        </div>
                        }
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>


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