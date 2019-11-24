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
import FileUpload from '@material-ui/icons/Folder';//todo change back to upload icon
import FolderIcon from '@material-ui/icons/Folder';
import NewFolderIcon from '@material-ui/icons/CreateNewFolder';


import AppShell from '../../library/appShell/AppShell';
import AppActions from '../../library/actions/AppActions';
import Breadcrumb from '../../library/breadcrumb/Breadcrumb';
import FileList from '../../components/filelist/FileList';
import FileInfoSidebar from '../../components/fileinfosidebar/FileInfoSidebar';
import UploadDialog from '../../components/uploaddialog/UploadDialog';
import NewFolderDialog from '../../components/newfolderdialog/NewFolderDialog';
import fileActions from "../../actions/FileActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

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
    },
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
            showUploadDialog:false,
            showNewFolderDialog:false,
            selectedFiles:[],
            root:"/content",
            visibleRoot:"/content/files",
            path:"/content/files"
        };

        this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
        this.handleUploadClosed = this.handleUploadClosed.bind(this);
        this.handleAfterOnDelete = this.handleAfterOnDelete.bind(this);
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
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        this.validatePath();
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


    handleFileSelectionChange(files){
        this.setState({selectedFiles:files});
    }

    handleUploadClosed(){
        this.setState({'showUploadDialog':false});
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



    render() {
        var classes = this.props.classes;

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
                                    onClick={()=>{this.setState({'showUploadDialog':true})}}>
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


                    <div className={classes.fileGridFileList} style={{gridColumn:this.state.selectedFiles.length>0?'1/2':'1/3'}}>
                        <FileList
                            path={this.state.path}
                            onSelectionChange={this.handleFileSelectionChange}
                            onDelete={this.handleAfterOnDelete}
                            style={{gridRow:"1 / 4", gridColumn:"1 / 3"}}/>
                    </div>

                    <FileInfoSidebar
                        files={this.state.selectedFiles}
                        className={classes.fileGridSidebar}
                        style={{display:this.state.selectedFiles.length>0?'block':'none'}}
                    />

                    <UploadDialog
                        onClose={this.handleUploadClosed}
                        open={this.state.showUploadDialog}
                        path={this.state.path}/>

                    <NewFolderDialog
                        onClose={()=>{this.setState({'showNewFolderDialog':false})}}
                        open={this.state.showNewFolderDialog}
                        path={this.state.path}/>
                </div>

            </AppShell>
        );

    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(FilesPage)));