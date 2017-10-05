/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import {CircularProgress} from 'material-ui/Progress';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import FileUpload from 'material-ui-icons/FileUpload';
import FolderIcon from 'material-ui-icons/Folder';
import NewFolderIcon from 'material-ui-icons/CreateNewFolder';


import AppShell from '../../library/appShell/AppShell';
import AppActions from '../../actions/AppActions';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import FileList from '../../components/filelist/FileList';
import FileInfoSidebar from '../../components/fileinfosidebar/FileInfoSidebar';
import UploadDialog from '../../components/uploaddialog/UploadDialog';

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
        display:'grid',
        gridTemplateRows:'auto',
        gridTemplateColumns:'48px auto auto'
    },

    fileGrid:{
        height:'100%',
        display:'grid',
        gridTemplateRows:'64px auto',
        gridTemplateColumns:'4fr 2fr'
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
        display:'grid',
        gridGap:'16px',
        gridTemplateRows:'1fr 1fr 1fr',
        gridTemplateColumns:'2fr 6fr'
    }
});


class FilesPage extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isLoading:false,
            canAddFile:true,
            canAddFolder:true,
            showAddFolderDialog:false,
            showUploadDialog:false,
            selectedFiles:[],
            visibleRoot:"/content",
            path:"/content"
        };

        this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
    }

    componentWillMount(){

        this.validatePath();
        this.setState({"isMounted":true});


        AppActions.navigateTo.takeWhile(() => this.state.isMounted).subscribe(function(path){
            if (path.substring(0, 3) === "://") {
                window.location.href = path.substring(2);
            }else{
                this.props.history.push(path);
            }
        }.bind(this));
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
            this.setState({"path": _path, "isMounted":true});
        }else{
            //todo show invalid path
        }
    }


    handleFileSelectionChange(files){
        this.setState({selectedFiles:files});
    }



    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <AppShell>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }



        return (
            <AppShell>
                <div className={classes.fileGrid}>
                    <AppBar color="default" position="static" elevation={0}
                            className={classes.fileGridAppBar}
                            style={{'colorDefault':'#eeeeee'}}>

                        <Toolbar className={classes.toolbarContainer}>
                            <div style={{gridRow:'1', gridColumn:'1'}}>
                                <FolderIcon style={{width:'36px', height:'36px'}}/>
                            </div>
                            <div style={{gridRow:'1', gridColumn:'2'}}>
                                <Breadcrumb path={this.state.path}/>
                            </div>
                            <div style={{gridRow:'1', gridColumn:'3', textAlign:'right'}}>
                                <Button
                                    color="primary"
                                    disabled={!this.state.canAddFile}
                                    onClick={()=>{this.setState({'showUploadDialog':true})}}>
                                    <FileUpload/> Add Files
                                </Button>

                                <Button
                                    label="New Folder"
                                    color="primary"
                                    disabled={!this.state.canAddFolder}
                                    onClick={()=>{this.setState({'showAddFolderDialog':true})}}>
                                    <NewFolderIcon/> New Folder
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar>


                    <div className={classes.fileGridFileList} style={{gridColumn:this.state.selectedFiles.length>0?'1/2':'1/3'}}>
                        <div className={classes.mainGrid}>
                            <FileList
                                path={this.state.path}
                                onSelectionChange={this.handleFileSelectionChange}
                                style={{gridRow:"1 / 4", gridColumn:"1 / 3"}}/>

                        </div>
                    </div>

                    <FileInfoSidebar
                        files={this.state.selectedFiles}
                        className={classes.fileGridSidebar}
                        style={{display:this.state.selectedFiles.length>0?'block':'none'}}
                    />

                    <UploadDialog
                        onClose={()=>{this.setState({'showUploadDialog':false})}}
                        open={this.state.showUploadDialog}
                        path={this.state.path}/>
                </div>

            </AppShell>
        );

    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(FilesPage)));