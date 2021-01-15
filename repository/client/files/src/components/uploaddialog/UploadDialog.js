/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
//import AppActions from "../../actions/AppActions";
//import {FormattedMessage} from 'react-intl'; //, FormattedPlural, FormattedDate
import filesize from 'filesize';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import CloseIcon from '@material-ui/icons/Close';
//import {Receiver} from 'react-file-uploader';
import FileActions from '../../actions/FileActions';
//import FileUploadIcon from '@material-ui/icons/CloudUpload';


const styleSheet = (theme) => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    dialogPaper: {
        minHeight: '90%',
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
    }

    componentDidMount() {
        this.setState({isMounted: true});

        FileActions.uploadProgress.subscribe(file_ => {
            let _files = [];
            for (var i = 0; i < this.props.files.length; i++) {
                var _fileInState = this.props.files[i];
                if (file_.id === _fileInState.id && file_.progress !== 100) {
                    _fileInState.progress = file_.progress;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });

        FileActions.uploadError.subscribe((file_) => {
            let _files = [];
            for (var i = 0; i < this.props.files.length; i++) {
                var _fileInState = this.props.files[i];
                if (file_.id === _fileInState.id) {
                    _fileInState.error = file_.error;
                }
                _files.push(_fileInState);
            }
            this.setState({files: _files});
        });

        setTimeout(()=>this.startFileUploads(this.props.files), 500);
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        setTimeout(()=>this.startFileUploads(this.props.files), 1000);
    }

    handleClose() {
        this.setState({files: [], filter: "all"});

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    startFileUploads(files) {
        if( this.props.files.length > 0 ) {
            for (let i = 0; i < Math.min(3, this.props.files.length); i++) {
                //console.log("Upload; " + this.props.files[i].path);
                //FileActions.uploadFile.source.next(this.props.files[i]);
            }

            for (let file of this.props.files) {
                if(file.status === "uploadReady") {
                    //console.log("Upload; " + file);
                    file.status = "uploading";
                    FileActions.uploadFile.source.next(file);
                }
            }
        }
    }

    render() {
        var classes = this.props.classes;

        var completedFiles = this.props.files.filter(file_ => file_.progress === 100).length;
        var completedFilesPercentage = 100 * (completedFiles / this.props.files.length);


        var filteredFiles =
            this.props.files.filter(file_ => {
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

        filteredFiles.sort((a,b)=>{
            if (a.progress < b.progress) return 1;
            if (a.progress > b.progress) return -1;
            return 0;
        });

        return (
            <Dialog
                maxWidth="lg"
                fullWidth={true}
                open={this.props.open}
                transition={SlideTransition}
                classes={{ paper: classes.dialogPaper }}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Adding Files
                        </Typography>
                        <Button onClick={this.handleClose} style={{'color':'white'}}>
                            close
                        </Button>
                    </Toolbar>
                </AppBar>



                {this.props.files.length > 0  &&
                    <div style={{position:'absolute', top:'80px', right:'24px', left:'24px'}}>
                        <Typography style={{'display': 'inline'}}>{completedFiles} / {this.props.files.length}</Typography>
                        <LinearProgress variant="determinate" value={Math.min(completedFilesPercentage, 100)}/>
                        <Typography>Files will be added to: <strong>{this.props.path}</strong></Typography>
                    </div>
                }

                {(this.props.files.length > 0 && filteredFiles.length > 0) &&
                    <div  style={{height: '100%',overflow: 'scroll', position: 'absolute',top:'148px', bottom: '24px', left:'16px', right:'16px'}}>
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
                                if( file_.progress < 100 ) {
                                    return (
                                        <TableRow key={file_.id}>
                                            <TableCell style={{padding: '0 8px 0 8px'}}>
                                                {file_.progress > 0.0 ?
                                                    <CircularProgress size={24}/>
                                                    : <CloseIcon color="primary"/>
                                                }
                                            </TableCell>
                                            <TableCell style={{padding: '0 8px 0 8px'}}>
                                                <Typography>{file_.name}</Typography>
                                                <Typography
                                                    variant="caption">{file_.relativePath} {file_.error}</Typography>
                                                <LinearProgress variant="determinate" value={file_.progress} style={{'height':'4px'}} />
                                            </TableCell>
                                            <TableCell style={{padding: '0 8px 0 8px'}}
                                                       numeric>{filesize(file_.size, {base: 10})}</TableCell>
                                            <TableCell style={{padding: '0 8px 0 8px'}} numeric>
                                                {Math.round(file_.progress)}%
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                                else {
                                    return "";
                                }
                            })}
                        </TableBody>
                    </Table>
                    </div>
                }


            </Dialog>

        );
    }

}


//export default withStyles(styleSheet)(UploadDialog);