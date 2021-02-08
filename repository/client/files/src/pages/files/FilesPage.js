/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
//import i18n from '../../i18n/i18n.js';

import {withStyles} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import {Breadcrumb, Button, message, Space, Upload} from 'antd';
import {FileOutlined, FolderAddOutlined, FolderOutlined, HomeOutlined} from '@ant-design/icons';

import AppShell from '../../library/appShell/AppShell';
import NewFolderDialog from '../../components/newfolderdialog/NewFolderDialog';
import Typography from "@material-ui/core/Typography";
import GetFilesAndFoldersService from "../../services/GetFileAndFoldersService";
import TableView from "../../components/tableView/TableView";
import CreateFolderService from "../../services/CreateFolderService";
import AppSettings from "../../library/actions/AppSettings";
import UploadFileService from "../../services/UploadFileService";
import DeleteFileOrFolderService from "../../services/DeleteFileOrFolderService";
import SaveFileOrFolderService from "../../services/SaveFileOrFolderService";

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


class FilesPage extends React.PureComponent {


    constructor(props, context) {
        super(props);

        this.state = {
            isLoading:true,
            isMounted:true,
            canAddFile:true,
            canAddFolder:true,
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
        this.uploadRef = React.createRef();

        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleNodeChange = this.handleNodeChange.bind(this);

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


        SaveFileOrFolderService.sink.takeWhile(() => this.state.isMounted).subscribe({
            next: (v) => message.info('Item has been saved'),
            error: (e) => message.info('Error saving item')
        });


        //trigger load of all folders and files
        if( this.props.location.pathname.startsWith(this.state.path)) {
            this.setState({path: this.props.location.pathname, showNewFolderDialog:false})
            GetFilesAndFoldersService.source.next(this.props.location.pathname );
        }else{
            this.setState({showNewFolderDialog:false});
            GetFilesAndFoldersService.source.next(this.state.path);
        }
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }


    componentDidUpdate(props_, state_) {
        const currentPath = this.state.path;
        const newPath = this.validatePath();
        if( currentPath !== newPath ) {
            GetFilesAndFoldersService.source.next(newPath);
        }
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return this.props.location.pathname != nextProps.location.pathname
    //         || this.state.folders != nextState.folders
    //         || this.state.files != nextState.files
    //         || this.state.showNewFolderDialog != nextState.showNewFolderDialog
    //         || this.state.isLoading != nextState.isLoading;
    // }


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
        for (let i = 2; i < parts.length; i++) {
            const p = parts[i];
            visibleParts.push( {label: p, path: '/' +parts.slice(0, i+1).join("/")} )
        }
        return visibleParts;
    }


    handleCreateFolder(folderName){
        const parentId = this.state.folder.id || null;
        const basehost = AppSettings.baseHost.value;

        CreateFolderService.sink.takeWhile(() => this.state.isMounted).subscribe(function (location_) {
            console.log("Create Folder:" +location_);
            this.setState({showUploadSidebar:false, showNewFolderDialog:false, showUploadDialog:false});

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


    handleFileDownload(name_, path_){
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=path_ ;
        link.download=name_;
        link.click();
        link.remove();
    }


    UploadOnChangeHandler(info){
        //console.log("Upload OnChange");
        //console.dir(info);
        //console.dir(this.uploadRef);

        const { status } = info.file;
        if (status !== 'uploading') {
            //console.log(info.file, info.fileList);
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
                    //console.log("done");
                }
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    UploadCustomRequestHandler(req){
        UploadFileService.source.next({path:req.action, file:req.file, onError:req.onError, onProgress:req.onProgress, onSuccess:req.onSuccess})
    }

    /**
     * remove file items that have been uploaded successfully
     * @param originNode : ReactElement
     * @param file
     * @param fileList
     * @return originNode
     * @constructor
     */
    UploadItemRenderHandler(originNode, file, fileList){
        if( file.status !== "done" ) {
            return originNode;
        }
    }


    handleOnRowClick(event){
        console.log(event);
    }



    //Node has been update, save changes
    handleNodeChange(node){
        SaveFileOrFolderService.source.next(node);
    }


    handleCloseNewFolderDialog = (e) =>{
        this.setState({showNewFolderDialog:false});
        console.log(this.state.showNewFolderDialog)
    }



    render() {
        //console.log("render:" +this.state.uploadFiles.length);
        var classes = this.props.classes;
        const { t } = this.props;

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
            onChange: this.UploadOnChangeHandler.bind(this),
            customRequest: this.UploadCustomRequestHandler.bind(this),
            itemRender: this.UploadItemRenderHandler.bind(this)
        };

        message.config({
            top: 24,
            duration: .5,
            maxCount: 3
        });

        //console.dir(draggerProps);

        const pathParts = this.parseBreadcrumbPath(this.props.location.pathname);


        return (
            <AppShell user={this.props.user} open={false}>
                <div className={classes.fileGrid}>
                    <AppBar color="default" position="static" elevation={0} className={classes.fileGridAppBar}>

                        <Toolbar className={classes.toolbarContainer}>
                            <Typography variant="h6" className={classes.title}>
                                <Breadcrumb>
                                    <Breadcrumb.Item href="/home/index.html">
                                        <HomeOutlined />
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item href={'#/'}>
                                        <FileOutlined />
                                        <span>{t('label.files', 'Files')}</span>
                                    </Breadcrumb.Item>
                                    {pathParts.map((p)=>{
                                        return (<Breadcrumb.Item key={p.path}><Link to={p.path} >{p.label}</Link></Breadcrumb.Item>);
                                    })}
                                </Breadcrumb>
                            </Typography>
                            <Space>
                                <Button type="primary"
                                        disabled={!this.state.canAddFolder}
                                        onClick={()=>this.setState({'showNewFolderDialog':true})}
                                        icon={<FolderAddOutlined />}>{t('label.newFolder', 'New Folder')}</Button>
                            </Space>
                        </Toolbar>
                    </AppBar>


                    <div className={classes.fileGridFileList} style={{gridColumn:_sidebarVisible?'1/2':'1/3'}}>

                        <TableView
                            loading={this.state.isLoading}
                            folders={this.state.folders}
                            files={this.state.files}
                            onRowClick={this.handleOnRowClick}
                            onNodeChange={this.handleNodeChange}
                            onDownload={this.handleFileDownload}
                            onDeleteFile={this.handleFileDelete}
                            onDeleteFolder={this.handleFolderDelete}/>


                        <div style={{marginTop:'24px'}}>
                            <Dragger {...draggerProps} ref={this.uploadRef}>
                                <p className="ant-upload-drag-icon">
                                    <FolderOutlined />
                                </p>
                                <p className="ant-upload-text">{t('instr.clickOrDrag', 'Click or drag file to this area to upload')}</p>
                                <p className="ant-upload-hint">
                                    {t('instr.clickOrDragDesc', 'Support for a single or bulk upload.')}
                                </p>
                            </Dragger>
                        </div>
                    </div>


                    <NewFolderDialog
                        onSave={this.handleCreateFolder.bind(this)}
                        onCancel={this.handleCloseNewFolderDialog}
                        open={this.state.showNewFolderDialog}
                        path={this.state.path}/>
                </div>


                <input type="file"
                       ref={this.fileInputFieldRef}
                       style={{'display': 'none'}}
                       multiple
                       onChange={this.handleFileChange}/>

            </AppShell>
        );

    }
}


export default withTranslation()(withRouter(withStyles(styleSheet)(FilesPage)));