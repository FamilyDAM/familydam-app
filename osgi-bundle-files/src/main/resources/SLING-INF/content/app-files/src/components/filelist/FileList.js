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
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import Typography from 'material-ui/Typography';
import FolderIcon from 'material-ui-icons/Folder';
import PhotoIcon from 'material-ui-icons/Photo';
import DownloadIcon from 'material-ui-icons/FileDownload';
import DeleteIcon from 'material-ui-icons/Delete';

import FileListTableHead from './FileListTableHead';
import AppActions from '../../actions/AppActions';
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
            selected: []
        };

        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleFileDownload = this.handleFileDownload.bind(this);
        this.handleFolderDownload = this.handleFolderDownload.bind(this);
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

        let _path = this.props.path;
        if( this.props.location.pathname && this.props.location.pathname.toString().startsWith(this.state.rootPath) ){
            _path = this.props.location.pathname;
        }

        fileActions.getFileAndFolders.source.next(_path);
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;

        let _path = this.props.path;
        if( this.props.location.pathname ){
            _path = this.props.location.pathname;
        }

        //this.setState({"selected":[]});
        fileActions.getFileAndFolders.source.next(_path);
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
        }
        this.setState({ selected: [] });
        if( this.props.onSelectionChange ){
            this.props.onSelectionChange([]);
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
        return false;
    }

    handleFolderDelete(path_){
        return false;
    }

    handleFileDownload(path_){
        return false;
    }

    handleFolderDownload(path_){
        return false;
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
                                { id: 'name', numeric: false, disablePadding: true, label: 'Name', width:'100%' },
                                { id: 'created', numeric: true, disablePadding: false, label: 'Created', width:'100px' },
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
                                                 onDelete={this.handleFileDelete}
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
        aria-checked={props.isSelected}
        onClick={()=>props.onNavigate(props.folder.path)}
    >
        <TableCell checkbox
                   style={{width:'50px'}}>
        </TableCell>
        <TableCell
            style={{width:'50px', margin:'auto'}}
            disablePadding>
            <FolderIcon/>
        </TableCell>
        <TableCell disablePadding onClick={()=>props.onNavigate(props.folder.path)}>
            <Typography component="span">{props.folder.name}</Typography>
        </TableCell>
        <TableCell numeric></TableCell>
        <TableCell>
            <DeleteIcon onClick={()=>props.onDelete(props.folder.path)}/>
            <DownloadIcon onClick={()=>props.onDownload(props.folder.path)}/>
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
        onClick={event => props.onClick(event, props.file.path)}
    >
        <TableCell checkbox
                   style={{width:'50px'}}
        >
            <Checkbox checked={props.isSelected} />
        </TableCell>
        <TableCell
            style={{width:'50px', margin:'auto'}}
            disablePadding>
            <PhotoIcon/>
        </TableCell>
        <TableCell disablePadding>
            <Typography component="span">{props.file.name}</Typography>
        </TableCell>
        <TableCell numeric>{props.file['jcr:created']}</TableCell>
        <TableCell>
            <DeleteIcon onClick={()=>props.onDelete(props.file.path)}/>
            <DownloadIcon onClick={()=>props.onDownload(props.file.path)}/>
        </TableCell>
    </TableRow>
);




FileList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(FileList));