/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import FileUpload from '@material-ui/icons/Folder'; //todo change back to upload icon
import FolderIcon from '@material-ui/icons/Folder';
import NewFolderIcon from '@material-ui/icons/CreateNewFolder';
import FileScanner from '../../utilities/FileScanner';

import AppShell from '../../library/appShell/AppShell';
import AppActions from '../../library/actions/AppActions';
import Breadcrumb from '../../library/breadcrumb/Breadcrumb';
import FileList from '../../components/filelist/FileList';
import FileInfoSidebar from '../../components/fileinfosidebar/FileInfoSidebar';
import UploadDialog from '../../components/uploaddialog/UploadDialog';
import NewFolderDialog from '../../components/newfolderdialog/NewFolderDialog';
import fileActions from "../../actions/FileActions";
import FileActions from "../../actions/FileActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FileReceiver from "../../components/filereceiver/FileReceiver";

const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },

    toolbarContainer:{

    },

    fileGrid:{
        height:'100%',
        display:'grid',
        gridTemplateRows:'64px auto',
        gridTemplateColumns:'4fr minmax(2px, 400px)'
    },

    fileGridAppBar:{
        gridRow:'1',
        gridColumn:'1/3'
    },

    fileGridFileList:{
        gridRow:'2',
        gridColumn:'1',
        margin: '24px'
    },

    fileGridSidebar:{
        gridRow:'2',
        gridColumn:'2',
        margin: '24px'
    },

    filePondSidebar:{
        gridRow:'2',
        gridColumn:'2',
        margin: '24px'
    },



    mainGrid:{
        height: '100%',
        overflow: 'scroll',
        display:'grid',
        gridGap:'16px',
        gridTemplateRows:'1fr 1fr 1fr',
        gridTemplateColumns:'2fr 6fr'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
});


class FilesPage extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:false,
            isLoading:false,
            canAddFile:true,
            canAddFolder:true,
            showAddFolderDialog:false,
            showUploadSidebar:false,
            showNewFolderDialog:false,
            selectedFiles:[],
            uploadFiles:[],
            root:"/content",
            visibleRoot:"/content/files",
            path:"/content/files"
        };

        this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
        this.handleUploadClosed = this.handleUploadClosed.bind(this);
        this.handleAfterOnDelete = this.handleAfterOnDelete.bind(this);
        //this.handleOnFileDrop  = this.handleOnFileDrop.bind(this);
        this.handleFileSelect  = this.handleFileSelect.bind(this);
        this.handleFileChange  = this.handleFileChange.bind(this);
    }

    componentWillMount(){
        this.setState({isMounted:true});
        this.validatePath();
    }

    componentDidMount(){
        AppActions.navigateTo.takeWhile(() => this.state.isMounted).subscribe((path)=>{
            console.log("{FilesPage} navigateTo=" +path);
            if (path.substring(0, 3) === "://") {
                if( window.location.href.substring( window.location.href.indexOf("#")+1) !== path.substring(2) ){
                    window.location.href = path.substring(2);
                }
            }else{
                this.props.history.push(path);
            }

            //this.setState({"selectedFiles":[]});
        });

        //.takeWhile(() => this.state.isMounted)
        FileActions.stageFile.bufferTime(5).subscribe((files_)=>{
            if( files_.length > 0) {
                var _files = this.state.uploadFiles;
                for (const f of files_) {
                    _files.push(f);
                }
                console.log("stage file || files=" +files_.length +"/" +_files.length);
                this.setState({showUploadDialog: true, uploadFiles: _files})
            }
        });

        FileActions.stageAction.subscribe((action_)=>{
            this.setState({showUploadDialog:true})
        });

    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        this.validatePath();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.path !== this.props.path
            || nextProps.location !== this.props.location
            || nextProps.user !== this.props.user
            || nextState.path !== this.state.path
            || nextState.root !== this.state.root
            || nextState.selectedFiles !== this.state.selectedFiles
            || nextState.showUploadDialog !== this.state.showUploadDialog
            || nextState.showNewFolderDialog !== this.state.showNewFolderDialog
        );
    }



    validatePath() {
        let _path = this.props.path;
        if( this.props.location.pathname && this.props.location.pathname.toString().startsWith(this.state.visibleRoot) ){
            _path = this.props.location.pathname;
        }
        if( !_path ){
            _path = this.state.visibleRoot;
        }

        if( _path.toString().startsWith(this.state.visibleRoot)) {
            this.setState({"path": _path});
        }else{
            //todo show invalid path
            console.log("Invalid Path: " +_path);
        }
    }

    handleFileSelect(){
        this.refs.fileInputField.click();
    }

    handleFileSelectionChange(files){
        this.setState({selectedFiles:files, showUploadSidebar:false});
    }

    handleUploadClosed(){
        this.setState({'showUploadDialog':false, uploadFiles:[]});
        fileActions.getFileAndFolders.source.next(this.state.path);
    }

    handleAfterOnDelete(path_){
        //console.log("handleAfterOnDelete: " +this.state.path);

        //remove deleted item from list of selectedfiles
        var selectedFiles = [];
        for (var i = 0; i < this.state.selectedFiles.length; i++) {
            var obj = this.state.selectedFiles[i];
            if( obj !== path_){
                selectedFiles.push(obj);
            }
        }
        this.setState({selectedFiles:selectedFiles});

        fileActions.getFileAndFolders.source.next(this.state.path);
    }

    /**
    handleOnFileDrop(files_){
        const _files = this.state.uploadFiles;
        _files.push(files_);
        this.setState({"uploadFiles":_files})
    }**/

    handleFileChange(e, files) {
        new FileScanner().scanFiles(e, this.state.path, e.target.files);
    }



    handleFileDownload(name_, path_){
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=path_ ;
        link.download=name_;
        link.click();

        return false;
    }


    render() {
        //console.log("render:" +this.state.uploadFiles.length);
        var classes = this.props.classes;
        const _sidebarVisible = this.state.showUploadSidebar || this.state.uploadFiles.length>0 || this.state.selectedFiles.length>0;

        if( this.state.isLoading ){
            return (
                <AppShell user={this.props.user}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }



        return (
            <AppShell user={this.props.user} open={false}>
                <div className={classes.fileGrid}>
                    <AppBar color="default" position="static" elevation={0}
                            className={classes.fileGridAppBar}
                            style={{'colorDefault':'#eeeeee'}}>

                        <Toolbar className={classes.toolbarContainer}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <FolderIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                <Breadcrumb root={this.state.root} path={this.state.path}/>
                            </Typography>
                            <div>
                                <Button
                                    color="primary"
                                    disabled={!this.state.canAddFile}
                                    onClick={this.handleFileSelect}>
                                    <FileUpload/>&nbsp;&nbsp;Add Files
                                </Button>

                                <Button
                                    label="New Folder"
                                    color="primary"
                                    disabled={!this.state.canAddFolder}
                                    onClick={()=>{this.setState({'showNewFolderDialog':true})}}>
                                    <NewFolderIcon/>&nbsp;&nbsp;New Folder
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar>


                    <div className={classes.fileGridFileList} style={{gridColumn:_sidebarVisible?'1/2':'1/3'}}>
                        <FileReceiver
                            path={this.state.path}
                            onFileDrop={this.handleOnFileDrop}/>

                        <FileList
                            path={this.state.path}
                            onSelectionChange={this.handleFileSelectionChange}
                            onDelete={this.handleAfterOnDelete}
                            style={{gridRow:"1 / 4", gridColumn:"1 / 3"}}/>

                    </div>




                    <FileInfoSidebar
                        files={this.state.selectedFiles}
                        className={classes.fileGridSidebar}
                        onDelete={this.handleAfterOnDelete}
                        onDownload={this.handleFileDownload}
                        style={{display:this.state.selectedFiles.length>0?'block':'none'}}
                    />

                    <UploadDialog
                        onClose={this.handleUploadClosed}
                        open={this.state.showUploadDialog}
                        files={this.state.uploadFiles}
                        path={this.state.path}/>

                    <NewFolderDialog
                        onClose={()=>{this.setState({'showNewFolderDialog':false})}}
                        open={this.state.showNewFolderDialog}
                        path={this.state.path}/>
                </div>


                <input type="file"
                       ref="fileInputField"
                       multiple
                       style={{'display': 'none'}}
                       onChange={this.handleFileChange}/>

            </AppShell>
        );

    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(FilesPage)));