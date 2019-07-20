import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import keycode from 'keycode';
import moment from 'moment';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import PhotoIcon from '@material-ui/icons/Photo';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import FileListTableHead from './FileListTableHead';
import AppActions from '../../library/actions/AppActions';
import fileActions from '../../actions/FileActions';
import LoadingButton from '../../library/loadingButton/LoadingButton';
import VirtualizedTable from "../virtualizedTable/VirtualizedTable";

const styleSheet = (theme) => ({
    main:{
        width:'100%',
        height:'100%',
        backgroundColor: '#fff'
    },
    root: {
        gridRow: '1/4',
        gridColumn: '1/4'
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});


class FileList extends Component{

    isCntlPressed = false;
    isSpacePressed = false;

    constructor(props) {
        super(props);
        this.state = {
            files:[],
            rootPath:'/content',
            isMounted:true,
            order: 'asc',
            orderBy: 'name',
            selected: [],
            showDeleteFileDialog:false,
            showDeleteFolderDialog:false
        };

        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleFileDownload = this.handleFileDownload.bind(this);
        this.handleFolderDownload = this.handleFolderDownload.bind(this);
        this.handleCancelDialog = this.handleCancelDialog.bind(this);
        this.handleFileDeleteOk = this.handleFileDeleteOk.bind(this);
        this.handleFolderDeleteOk = this.handleFolderDeleteOk.bind(this);

    }


    componentDidMount(){
        this.setState({isMounted:true});
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("keyup", this.handleKeyUp, false);
        document.addEventListener("contextmenu", function(e){
            e.preventDefault();
        }, false);

        //used by storybook
        if( this.props.files){
            this.setState({'files': this.props.files});
        }



        fileActions.getFileAndFolders.sink.takeWhile(() => this.state.isMounted).subscribe((data_)=>{

            var sortBy = this.state.orderBy;
            var sortedFiles = data_.sort((a, b) => {

                if( a['jcr:primaryType'] && b['jcr:primaryType'] ){
                    if( a['jcr:primaryType'] !== b['jcr:primaryType'] ){
                        //folders before files
                        return a['jcr:primaryType'] > b['jcr:primaryType']?-1:1
                    }
                }
                if( a[sortBy] && b[sortBy]) {
                    return (a[sortBy].toString().toLowerCase() < b[sortBy].toString().toLowerCase() ? -1 : 1);
                }else{
                    return 0;
                }

            });

            console.log(JSON.stringify(sortedFiles));
            this.setState({'files': sortedFiles});
        });


        fileActions.getFileAndFolders.source.next(this.props.path);
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        fileActions.getFileAndFolders.source.next(this.props.path);
    }


    handleKeyDown(e){
        console.log("keydown=" +e.keyCode);
        switch (e.keyCode) {
            case 17:
                this.isCntlPressed = true;
                break;
            case 91:
                this.isCntlPressed = true;
                break;
            case 16: //space
                this.isSpacePressed = true;
                break;
            case 32: //space
                //todo: open preview
                break;
        }
    }

    handleKeyUp(e){
        console.log("keyup=" +e.keyCode);
        switch (e.keyCode) {
            case 17:
                this.isCntlPressed = false;
                break;
            case 91:
                this.isCntlPressed = false;
                break;
            case 16: //space
                this.isSpacePressed = false;
                break;
        }
    }


    handleClick = (event, id) => {
        //console.log("handle click | id=" +id +" | " +this.isCntlPressed);
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if( this.isCntlPressed ){
            //newSelected = selected
        }

        console.log('selected =' +selectedIndex);
        if( selectedIndex == -1 ) {
            newSelected.push(id);
        }else{
            newSelected = [];
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        //console.dir(selected);

        this.setState({ selected: newSelected });

        if( this.props.onSelectionChange ){
            this.props.onSelectionChange(newSelected);
        }
    };



    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const data =
            order === 'desc'
                ? this.state.files.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.files.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

        this.setState({ data, order, orderBy });
    };



    handleFileDelete(path_){
        this.setState({showDeleteFileDialog:true, pendingFileToDelete: path_});
        return false;
    }

    handleFolderDelete(path_){
        this.setState({showDeleteFolderDialog:true, pendingFolderToDelete: path_});
        return false;
    }

    handleFileDownload(name_, path_){
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href="http://localhost:9000" +path_ ;
        link.download=name_;
        link.click();

        return false;
    }

    handleFolderDownload(path_){
        return false;
    }

    handleFileDeleteOk(){
        fileActions.deleteFileOrFolder.source.next(this.state.pendingFileToDelete);

        var _fileToDelete = this.state.pendingFileToDelete;
        fileActions.deleteFileOrFolder.sink.subscribe(()=>{
            if( this.props.onDelete){
                this.props.onDelete(_fileToDelete);
            }
        });

        this.setState({showDeleteFileDialog:false, pendingFileToDelete:null});
    }

    handleFolderDeleteOk(path_){
        fileActions.deleteFileOrFolder.source.next(this.state.pendingFolderToDelete);

        fileActions.deleteFileOrFolder.sink.subscribe(()=>{
            if( this.props.onDelete){
                this.props.onDelete(this.state.pendingFolderToDelete);
            }
        });

        this.setState({showDeleteFolderDialog:false, pendingFolderToDelete:null});
    }

    handleCancelDialog(path_){
        this.setState({showDeleteFileDialog:false, showDeleteFolderDialog:false, pendingFileToDelete:null});
    }



    render() {
        const classes = this.props.classes;
        const { files, order, orderBy, selected } = this.state;
        let checkIsSelected = path => this.state.selected.indexOf(path) !== -1;

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table>
                        <FileListTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={files.length}
                        />
                        <TableBody>
                            {this.state.files.filter((f=>!f.toString().startsWith(".") && !f.toString().startsWith("jcr:")  )).map(node => {


                                const isSelected = checkIsSelected(node.path);

                                if( (node['jcr:primaryType'] === "dam:folder" || node['jcr:primaryType'] === "sling:Folder" || node['jcr:primaryType'] === "nt:folder") ){

                                    return (
                                       <FolderRow key={node.path}
                                                  folder={node}
                                                  isSelected={isSelected}
                                                  onDelete={this.handleFolderDelete}
                                                  onDownload={this.handleFolderDownload}
                                                  onNavigate={(path_)=>AppActions.navigateTo.next(path_)}/>
                                    );

                                }else {

                                    return (
                                        <FileRow key={node.path}
                                                 file={node}
                                                 isSelected={isSelected}
                                                 onDelete={()=>this.handleFileDelete(node.path)}
                                                 onDownload={this.handleFileDownload}
                                                 onClick={(event, path_) => this.handleClick(event, path_)}
                                                 onKeyDown={(event, path_) => this.handleClick(event, path_)}
                                                 onNavigate={(path_) => AppActions.navigateTo.next(path_)}/>
                                    )
                                }
                            })}
                        </TableBody>

                    </Table>
                </div>


                <Dialog
                    ignoreBackdropClick
                    ignoreEscapeKeyUp
                    maxWidth="xs"
                    open={this.state.showDeleteFileDialog}>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this file?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancelDialog} color="primary">
                            Cancel
                        </Button>
                        <LoadingButton
                            isLoading={this.state.isLoading}
                            label="Delete"
                            onClick={this.handleFileDeleteOk}></LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    ignoreBackdropClick
                    ignoreEscapeKeyUp
                    maxWidth="xs"
                    open={this.state.showDeleteFolderDialog}>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this folder and all of the files in it?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancelDialog} color="primary">
                            Cancel
                        </Button>
                        <LoadingButton
                            isLoading={this.state.isLoading}
                            label="Delete"
                            onClick={this.handleFolderDeleteOk}></LoadingButton>
                    </DialogActions>
                </Dialog>


            </Paper>
        );
    }




    renderVirtualTable() {

        const columns = [
            {width: 300, label: 'Name', dataKey: 'name'},
            {width: 150, label: 'Created', dataKey: 'jcr:created'},
            {width: 150, label: 'Actions', actions: ['delete', 'download']}

        ];

        return (
            <Paper style={{ height: '100%', width: '100%' }}>
                <VirtualizedTable
                    rowCount={this.state.files.length}
                    rowGetter={({ index }) => this.state.files[index]}
                    columns={columns}
                />
            </Paper>
        )
    }

}


const FolderRow = (props, context) => (
    <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        selected={props.isSelected}
        aria-checked={props.isSelected}>

        <TableCell
            padding="default"
            style={{padding:'8px 8px 8px 16px'}}
            onClick={()=>props.onNavigate(props.folder.path)}>
            <FolderIcon  />
            <Typography component="span" style={{display:'inline', paddingLeft:'16px'}}>{props.folder.name}</Typography>
        </TableCell>
        <TableCell padding="default"></TableCell>
        <TableCell padding="default" style={{padding:'8px', textAlign:'center'}}>
            <Button onClick={()=>props.onDelete(props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><DeleteIcon /></Button>
            <Button onClick={()=>props.onDownload(props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><DownloadIcon /></Button>
        </TableCell>
    </TableRow>
);






const FileRow = (props, context) => (
    <TableRow
        hover
        role="checkbox"
        aria-checked={props.isSelected}
        tabIndex={-1}
        selected={props.isSelected}
    >
        <TableCell
            padding="default"
            style={{padding:'8px 8px 8px 16px'}}
            onClick={event => {console.log('onclick');props.onClick(event, props.file.path)}}>
            { (props.file['path'].toString().toLowerCase().endsWith(".jpg") || props.file['path'].toString().toLowerCase().endsWith(".png") ) ?
                <img src={"http://localhost:9000" +props.file.path} alt="" style={{width:'25px'}}/> : <PhotoIcon/>
            }
            <Typography style={{display:'inline', paddingLeft:'16px'}}>{props.file.name}</Typography>
        </TableCell>
        <TableCell  padding="default" style={{padding:'8px'}}>{moment(props.file['dam:datecreated']?props.file['dam:datecreated']:props.file['jcr:created']).format('MMM Do YYYY, h:mm:ss a')}</TableCell>
        <TableCell  padding="default" style={{padding:'8px', textAlign:'center'}}>
            <Button onClick={()=>props.onDelete(props.file.path)} style={{minWidth:'24px', padding:"4px"}}><DeleteIcon /></Button>
            {props.file._links.download &&
               <Button onClick={()=>props.onDownload(props.file.name, props.file._links.download)} style={{minWidth:'24px', padding:"4px"}}><DownloadIcon/></Button>
            }
        </TableCell>
    </TableRow>
);




FileList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(FileList));