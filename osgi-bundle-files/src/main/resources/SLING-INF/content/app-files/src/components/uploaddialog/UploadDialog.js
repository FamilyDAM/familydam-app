/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";
//import AppActions from "../../actions/AppActions";
import filesize from 'filesize';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
//import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import {CircularProgress} from 'material-ui/Progress';
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
            files:[]
        };

        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);

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
    handleAddFile(e, files){
        // close the Receiver after file dropped
        this.setState({ isReceiverOpen: false,  files: this.state.files.concat(files) });

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            file.uploadPath=this.props.path;
            FileActions.uploadFile.source.next(file);
            //FileActions.uploadFile.source.next({file:file, path:this.props.path});
        }
    }


    render() {
        //var classes = this.props.classes;

        return (
            <Dialog
                ignoreBackdropClick
                ignoreEscapeKeyUp
                maxWidth="md"
                fullScreen={true}
                open={this.props.open}>
                <DialogTitle>Upload/Import Manager</DialogTitle>
                <DialogContent>

                    <div style={{minWidth:'500px'}} >
                        Upload to: {this.props.path}
                        <hr/>

                        <Button>Select Files</Button>
                        <Button>Select Folders</Button>

                        <br/><br/>
                        <Receiver
                            style={{width:'100%', height:'100%', order:'1px solid #eee dashed'}}
                            isOpen={true}
                            onDragEnter={this.handleOnDragEnter}
                            onDragOver={this.handleOnDragOver}
                            onDragLeave={this.handleOnDragLeave}
                            onFileDrop={this.handleAddFile}>

                            {this.state.files.length === 0 &&
                                <div style={{margin:'40px', textAlign:'center'}}>
                                    Click or drag files to this area to upload
                                    <div style={{margin:'16px'}}>
                                        <FileUploadIcon/>
                                    </div>
                                </div>
                            }


                            {this.state.files.length > 0 &&
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
                                    {this.state.files.map(file_ => {
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
                                                    <Typography>{file_.error} {file_.path}</Typography>
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

                        </Receiver>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        );
    }

}


export default withStyles(styleSheet)(UploadDialog);