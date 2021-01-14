/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import { Button, Breadcrumb, Space, Upload, message } from 'antd';
import { HomeOutlined, FileOutlined, UploadOutlined, FolderOutlined, FolderAddOutlined, InboxOutlined } from '@ant-design/icons';

import AppShell from '../../library/appShell/AppShell';
import FileInfoSidebar from '../../components/fileinfosidebar/FileInfoSidebar';
import UploadDialog from '../../components/uploaddialog/UploadDialog';
import NewFolderDialog from '../../components/newfolderdialog/NewFolderDialog';
import Typography from "@material-ui/core/Typography";
import FileReceiver from "../../components/filereceiver/FileReceiver";
import GetFilesAndFoldersService from "../../services/GetFileAndFoldersService";
import TableView from "../../components/tableView/TableView";
import CreateFolderService from "../../services/CreateFolderService";
import AppSettings from "../../library/actions/AppSettings";
import UploadFileService from "../../services/UploadFileService";
import DeleteFileOrFolderService from "../../services/DeleteFileOrFolderService";

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
            path:"/content/files",
            visibleRoot:"/content/files",
            folders:[],
            files:[]
        };

        //create refs
        this.fileInputFieldRef = React.createRef();

        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);

        //this.handleFileSelect  = this.handleFileSelect.bind(this);
        //this.handleUploadClosed  = this.handleUploadClosed.bind(this);
        //this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
        //this.handleUploadClosed = this.handleUploadClosed.bind(this);
        //this.handleAfterOnDelete = this.handleAfterOnDelete.bind(this);
        //this.handleOnFileDrop  = this.handleOnFileDrop.bind(this);
    }

    componentDidMount(){
        this.setState({isMounted:true});
        this.validatePath();

        GetFilesAndFoldersService.isLoading.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            this.setState({'isLoading': data_ });
        });
        CreateFolderService.isLoading.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            this.setState({'isLoading': data_ });
        });

        GetFilesAndFoldersService.sink.takeWhile(() => this.state.isMounted).subscribe((data_)=>{
            const folder = data_;
            const folders = data_.folders || [];
            const files = data_.files || [];

            this.setState({'folder': data_, 'folders': data_, 'files': files});
        });

        //trigger load of all folders and files
        if( this.props.location.pathname.startsWith(this.state.path)) {
            GetFilesAndFoldersService.source.next(this.props.location.pathname );
        }else{
            GetFilesAndFoldersService.source.next(this.state.path);
        }
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        this.setState({showAddFolderDialog:false, showUploadSidebar:false, showNewFolderDialog:false, showUploadDialog:false});

        var newPath = this.validatePath();
        GetFilesAndFoldersService.source.next(newPath);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.location.pathname != nextProps.location.pathname
            || this.state.folders != nextState.folders
            || this.state.files != nextState.files
            || this.state.showNewFolderDialog != nextState.showNewFolderDialog
            || this.state.isLoading != nextState.isLoading;
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
            return _path;
        }else{
            //todo show invalid path
            console.log("Invalid Path: " +_path);
            return this.props.path;
        }
    }


    parseBreadcrumbPath(path, part){
        let parts = path.split("/");
        if(path.startsWith("/")){
            parts = parts.slice(1)
        }

        const visibleParts = [];
        for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            visibleParts.push( {label: p, path: '/' +parts.slice(0, i+1).join("/")} )
        }
        return visibleParts;
    }


    handleCreateFolder(folderName){
        const parentId = this.state.folder.id || null;
        const basehost = AppSettings.baseHost.value;

        CreateFolderService.sink.subscribe(function (location_) {
            console.log("Create Folder:" +location_);
            this.setState({showAddFolderDialog:false, showUploadSidebar:false, showNewFolderDialog:false, showUploadDialog:false});

            //const relPath = location_.substring( basehost.length );
            //this.props.history.push(relPath);
            //trigger load of all folders and files
            GetFilesAndFoldersService.source.next(this.state.path);
        }.bind(this));
        CreateFolderService.source.next({"path": this.state.path, "name": folderName});
    }


    async handleFileDelete(path_){
        await DeleteFileOrFolderService.execute(path_);
        //reload after deletion
        GetFilesAndFoldersService.source.next(this.state.path);
    }

    async handleFolderDelete(path_){
        await DeleteFileOrFolderService.execute(path_);
        //reload after deletion
        GetFilesAndFoldersService.source.next(this.state.path);
    }


    /**
     * Upload Dialog methods

     handleFileSelect(){
        this.fileInputFieldRef.current.click();
    }

     handleUploadClosed(){
        this.setState({'showUploadDialog':false, uploadFiles:[]});
        GetFileAndFoldersService.source.next(this.state.path);
    }*/

    /**
    handleFileSelectionChange(files){
        this.setState({selectedFiles:files, showUploadSidebar:false});
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
        const {Dragger} = Upload;
        const location = this.props.location;

        const draggerProps = {
            name: 'file',
            multiple: true,
            listType: 'picture',
            withCredentials: true,
            directory:true,
            showUploadList: {showRemoveIcon:true, showPreviewIcon:false, showDownloadIcon:false},
            action: this.props.location.pathname,
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                    if(info.fileList){
                        let allDone = true;
                        info.fileList.forEach((x)=>{
                            if( x.status !== "done"){
                                allDone = false;
                            }
                        });

                        if( allDone ){
                            //GetFilesAndFoldersService.source.next(this.props.location.pathname);
                            //window.location = location.pathname;
                            window.location.reload();
                        }
                    }
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            customRequest(req) {
                UploadFileService.source.next({path:req.action, file:req.file, onError:req.onError, onProgress:req.onProgress, onSuccess:req.onSuccess})
            }
        };

        console.dir(draggerProps);

        const pathParts = this.parseBreadcrumbPath(this.props.location.pathname);


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
                                    <Breadcrumb.Item href={'#/'}>
                                        <FileOutlined />
                                        <span>Files</span>
                                    </Breadcrumb.Item>
                                    {pathParts.map((p)=>{
                                        return (<Breadcrumb.Item><Link to={p.path} >{p.label}</Link></Breadcrumb.Item>);
                                    })}
                                </Breadcrumb>
                            </Typography>
                            <Space>
                                <Button type="primary"
                                        disabled={!this.state.canAddFolder}
                                        onClick={()=>{this.setState({'showNewFolderDialog':true})}}
                                        icon={<FolderAddOutlined />}>New Folder</Button>
                            </Space>
                        </Toolbar>
                    </AppBar>


                    <div className={classes.fileGridFileList} style={{gridColumn:_sidebarVisible?'1/2':'1/3'}}>

                        <TableView
                            loading={this.state.isLoading}
                            folders={this.state.folders}
                            files={this.state.files}
                            onRowClick={this.handleOnRowClick}
                            onDeleteFile={this.handleFileDelete}
                            onDeleteFolder={this.handleFolderDelete}/>


                        <div style={{marginTop:'24px', height:'200px'}}>
                            <Dragger {...draggerProps}>
                                <p className="ant-upload-drag-icon">
                                    <FolderOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                    band files
                                </p>
                            </Dragger>
                        </div>
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
                        onSave={this.handleCreateFolder.bind(this)}
                        onClose={()=>{this.setState({'showNewFolderDialog':false})}}
                        open={this.state.showNewFolderDialog}
                        path={this.state.path}/>
                </div>


                <input type="file"
                       ref="fileInputField"
                       ref={this.fileInputFieldRef}
                       style={{'display': 'none'}}
                       multiple
                       onChange={this.handleFileChange}/>

            </AppShell>
        );

    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(FilesPage)));