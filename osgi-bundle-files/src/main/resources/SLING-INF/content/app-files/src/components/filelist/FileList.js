import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "material-ui/styles";
import PropTypes from 'prop-types';
import keycode from 'keycode';


import Table, {
    TableBody,
    TableCell,
    TableRow
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import Typography from 'material-ui/Typography';
import FolderIcon from 'material-ui-icons/Folder';
import PhotoIcon from 'material-ui-icons/Photo';
import DownloadIcon from 'material-ui-icons/FileDownload';
import DeleteIcon from 'material-ui-icons/Delete';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';

import FileListTableHead from './FileListTableHead';
import AppActions from '../../library/actions/AppActions';
import fileActions from '../../actions/FileActions';

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

    constructor(props) {
        super(props);
        this.state = {
            files:[],
            rootPath:'/content',
            isMounted:true,
            order: 'asc',
            orderBy: 'name',
            selected: [],
            showDeleteFileDialog:false
        };

        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleFileDownload = this.handleFileDownload.bind(this);
        this.handleFolderDownload = this.handleFolderDownload.bind(this);
        this.handleCancelDialog = this.handleCancelDialog.bind(this);
        this.handleFileDeleteOk = this.handleFileDeleteOk.bind(this);
        this.handleFolderDeleteOk = this.handleFolderDeleteOk.bind(this);

    }


    componentWillMount(){
        this.setState({isMounted:true});

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

    handleSelectAllClick = (event, checked) => {
        debugger;
        if (checked) {
            var _files = this.state.files
                .filter(n=> n['jcr:primaryType'] !== "dam:folder" && n['jcr:primaryType']!=='sling:Folder' && n['jcr:primaryType']!=='nt:folder')
                .map(n => n.path);

            this.setState({ selected: _files });

            if( this.props.onSelectionChange ){
                this.props.onSelectionChange(_files);
            }
            return;

        }else {

            this.setState({selected: []});
            if (this.props.onSelectionChange) {
                this.props.onSelectionChange([]);
            }
        }
    };

    handleKeyDown = (event, id) => {
        if (keycode(event) === 'space') {
            this.handleClick(event, id);
        }
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });

        if( this.props.onSelectionChange ){
            this.props.onSelectionChange(newSelected);
        }
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
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={files.length}
                            columns={[
                                { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
                                { id: 'created', numeric: true, disablePadding: false, label: 'Created', stylesheet:{width:'150px'} }
                            ]}
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
                                                 onKeyDown={(event, path_) => this.handleKeyDown(event, path_)}
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
                        <Button raised color="primary" onClick={this.handleFileDeleteOk} >
                            Delete
                        </Button>
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
                        <Button raised color="primary" onClick={this.handleFolderDeleteOk} >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>


            </Paper>
        );
    }

}


const FolderRow = (props, context) => (
    <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        selected={props.isSelected}
        aria-checked={props.isSelected}>
        <TableCell checkbox></TableCell>
        <TableCell
            onClick={()=>props.onNavigate(props.folder.path)}
            disablePadding>
            <FolderIcon />
        </TableCell>
        <TableCell
            disablePadding
            onClick={()=>props.onNavigate(props.folder.path)}>
            <Typography component="span">{props.folder.name}</Typography>
        </TableCell>
        <TableCell numeric></TableCell>
        <TableCell>
            <Button onClick={()=>props.onDelete(props.folder.path)} style={{padding:'4px', minWidth:'24px'}}><DeleteIcon /></Button>
            <Button onClick={()=>props.onDownload(props.folder.path)} style={{padding:'4px', minWidth:'24px'}}><DownloadIcon /></Button>
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
        <TableCell checkbox>
            <Checkbox checked={props.isSelected} onClick={event => {console.log('checkbox clicked'); props.onClick(event, props.file.path)}} />
        </TableCell>
        <TableCell
            onClick={event => props.onClick(event, props.file.path)}
            disablePadding>
            { (props.file['path'].toString().endsWith(".jpg") || props.file['path'].toString().endsWith(".png") ) ?
                <img src={"http://localhost:9000" +props.file.path} alt="" style={{maxWidth:'64px', padding:'8px'}}/> : <PhotoIcon/>
            }

        </TableCell>
        <TableCell disablePadding
                   onClick={event => props.onClick(event, props.file.path)}>
            <Typography component="span">{props.file.name}</Typography>
            <Typography component="span">{props.file.path}</Typography>
        </TableCell>
        <TableCell numeric>{props.file['jcr:created']}</TableCell>
        <TableCell >
            <Button onClick={()=>props.onDelete(props.file.path)} style={{padding:'4px', minWidth:'24px'}}><DeleteIcon /></Button>
            {props.file._links.download &&
               <Button onClick={()=>props.onDownload(props.file.name, props.file._links.download)} style={{padding:'4px', minWidth:'24px'}}><DownloadIcon/></Button>
            }
        </TableCell>
    </TableRow>
);




FileList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(FileList));