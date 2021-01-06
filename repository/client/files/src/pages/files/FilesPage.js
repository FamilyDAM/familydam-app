/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import { Button, Breadcrumb, Space } from 'antd';
import { HomeOutlined, FileOutlined, UploadOutlined, FolderAddOutlined } from '@ant-design/icons';

import AppShell from '../../library/appShell/AppShell';
import FileInfoSidebar from '../../components/fileinfosidebar/FileInfoSidebar';
import UploadDialog from '../../components/uploaddialog/UploadDialog';
import NewFolderDialog from '../../components/newfolderdialog/NewFolderDialog';
import Typography from "@material-ui/core/Typography";
import FileReceiver from "../../components/filereceiver/FileReceiver";
import GetFilesAndFoldersService from "../../services/GetFileAndFoldersService";
import TableView from "../../components/tableView/TableView";
import CreateFolderService from "../../services/CreateFolderService";

const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing() * 2}px`,
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
        gridColumn:'1/3',
        zIndex:500,
        colorDefault:'#eeeeee'
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
            isLoading:true,
            isMounted:true,
            canAddFile:true,
            canAddFolder:true,
            showAddFolderDialog:false,
            showUploadSidebar:false,
            showNewFolderDialog:false,
            showUploadDialog:false,
            selectedFiles:[],
            uploadFiles:[],
            root:"/",
            visibleRoot:"/",
            path:"/",
            folders:[],
            files:[]
        };

        //this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
        //this.handleUploadClosed = this.handleUploadClosed.bind(this);
        //this.handleAfterOnDelete = this.handleAfterOnDelete.bind(this);
        //this.handleOnFileDrop  = this.handleOnFileDrop.bind(this);
        //this.handleFileSelect  = this.handleFileSelect.bind(this);
        //this.handleFileChange  = this.handleFileChange.bind(this);
    }

    componentDidMount(){
        this.setState({isMounted:true});

        GetFilesAndFoldersService.isLoading.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            this.setState({'isLoading': data_ });
        });
        CreateFolderService.isLoading.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            this.setState({'isLoading': data_ });
        });

        GetFilesAndFoldersService.sink.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            let folders = [];
            let files = [];
            let folder = data_;

            if( data_._embedded){
                folders = data_._embedded.folders || [];
            }

            if( data_._embedded ){
                files = data_._embedded.files || [];
            }

            this.setState({'folder': data_, 'folders': folders, 'files': files});
        });

        //trigger load of all folders and files
        GetFilesAndFoldersService.source.next(this.props.location.pathname);
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        if( this.props.location.pathname !== newProps.location.pathname) {
            GetFilesAndFoldersService.source.next(newProps.location.pathname);
        }
        this.props = newProps;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.location.pathname != nextProps.location.pathname
            || this.state.folders != nextState.folders
            || this.state.files != nextState.files
            || this.state.showNewFolderDialog != nextState.showNewFolderDialog
            || this.state.isLoading != nextState.isLoading;
    }

    handleCreateFolder(folderName){
        var parentId = this.state.folder.id || null;

        CreateFolderService.sink.subscribe(function (results_) {
            console.log(results_);
        }.bind(this));
        CreateFolderService.source.next({"parentId": parentId, "name": folderName});
    }


    /**
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
        GetFileAndFoldersService.source.next(this.state.path);
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

        GetFileAndFoldersService.source.next(null);
    }
**/

    /**
    handleOnFileDrop(files_){
        const _files = this.state.uploadFiles;
        _files.push(files_);
        this.setState({"uploadFiles":_files})
    }**/

    /**
    handleFileChange(e, files) {
        new FileScanner().scanFiles(e, this.state.path, e.target.files);
    } **/



    /**
    handleFileDownload(name_, path_){
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=path_ ;
        link.download=name_;
        link.click();

        return false;
    }**/


    render() {
        //console.log("render:" +this.state.uploadFiles.length);
        var classes = this.props.classes;
        const _sidebarVisible = this.state.showUploadSidebar || this.state.uploadFiles.length>0 || this.state.selectedFiles.length>0;

        return (
            <AppShell user={this.props.user} open={false}>
                <div className={classes.fileGrid}>
                    <AppBar color="default" position="static" elevation={0}
                            className={classes.fileGridAppBar}>

                        <Toolbar className={classes.toolbarContainer}>
                            <Typography variant="h6" className={classes.title}>
                                <Breadcrumb>
                                    <Breadcrumb.Item href="/">
                                        <HomeOutlined />
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item href="/files">
                                        <FileOutlined />
                                        <span>Files</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>{this.props.path}</Breadcrumb.Item>
                                </Breadcrumb>
                            </Typography>
                            <Space>
                                <Button type="primary"
                                        disabled={!this.state.canAddFile}
                                        onClick={this.handleFileSelect}
                                        icon={<UploadOutlined />}>Add Files</Button>

                                <Button type="primary"
                                        disabled={!this.state.canAddFolder}
                                        onClick={()=>{this.setState({'showNewFolderDialog':true})}}
                                        icon={<FolderAddOutlined />}>New Folder</Button>
                            </Space>
                        </Toolbar>
                    </AppBar>


                    <div className={classes.fileGridFileList} style={{gridColumn:_sidebarVisible?'1/2':'1/3'}}>
                        <FileReceiver
                            path={this.state.path}
                            onFileDrop={this.handleOnFileDrop}/>

                        <TableView
                            loading={this.state.isLoading}
                            folders={this.state.folders}
                            files={this.state.files}
                            onRowClick={this.handleOnRowClick} />
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
                        onSave={this.handleCreateFolder}
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