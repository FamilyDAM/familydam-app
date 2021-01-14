import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';

import {Table, Tag, Space, Modal} from 'antd';
import { format, parseISO } from 'date-fns'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import LoadingButton from "../../library/loadingButton/LoadingButton";
import Paper from "@material-ui/core/Paper";


class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: true,
            showDeleteFileDialog: false,
            pendingFileToDelete: [],
            folders: [],
            files: []
        };

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFileDeleteConfirmation = this.handleFileDeleteConfirmation.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleFolderDeleteConfirmation = this.handleFolderDeleteConfirmation.bind(this);
    }

    handleRowClick(e){
        const id = e.currentTarget.attributes['data-id'].value;
        this.props.onRowClick(id);
    }

    onTableChangeHandler(pagination, filters, sorter, extra: { currentDataSource: [], action: paginate | sort | filter }){
        console.log("onTableChange");
    }

    handleFileDelete(event_){
        const path = event_.currentTarget.attributes['data-path'].value;
        this.setState({showDeleteFileDialog:true, deletePath:path});//, pendingFileToDelete: path_
        return false;
    }

    handleFileDeleteConfirmation(event_){
        if( this.props.onDeleteFile ) this.props.onDeleteFile(this.state.deletePath);
        this.setState({showDeleteFileDialog:false, deletePath:null}); //, pendingFileToDelete: path_
        return false;
    }

    handleFolderDelete(event_){
        const path = event_.currentTarget.attributes['data-path'].value;
        this.setState({showDeleteFolderDialog:true, deletePath:path}); //, pendingFolderToDelete: path_
        return false;
    }

    handleFolderDeleteConfirmation(event_){
        if( this.props.onDeleteFolder ) this.props.onDeleteFolder(this.state.deletePath);
        this.setState({showDeleteFolderDialog:false, deletePath:null}); //, pendingFolderToDelete: path_
        return false;
    }




    getColumns(){
        return [
            {
                title: 'type',
                dataIndex: 'type',
                width: 80,
                render: (text, record) => <span>{record.primaryType}</span>, //todo: replace with icon
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={record.path}>{text}</Link>,
            },
            {
                title: 'Date Created',
                dataIndex: 'createdDate',
                key: 'createdDate',
                width: 200,
                responsive: ['md'],
                render: text => <span>{text?format(parseISO(text || ""),'yyyy-MM-dd hh:mm:ss a'):''}</span>,
            },
            {
                title: 'Action',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <Space size="middle">
                        <Button type="link">Info</Button>
                        <Button type="link" data-path={record.path} onClick={record.primaryType==='nt:file'?this.handleFileDelete:this.handleFolderDelete}>Delete</Button>
                    </Space>
                ),
            },
        ];
    }

    getRowSelection(){
        return  {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.contentType === 'application/folder', // Column configuration not to be checked
                name: record.name,
            }),
        };
    }



    render() {
        const classes = this.props.classes;


        let rows = [];
        rows = rows.concat(this.props.folders);
        rows = rows.concat(this.props.files);

        rows.sort((a, b)=>{
            if( a.primaryType > b.primaryType) return -1;
            else if( a.primaryType < b.primaryType) return 1;
            else if( a.primaryType === b.primaryType) {
                if( a.name.trim().toLowerCase() < b.name.trim().toLowerCase() ) return -1;
                else if( a.name.trim().toLowerCase() > b.name.trim().toLowerCase() ) return 1;
                else return 0;
            }
            else return 0;
        })

        const rowSelection = this.getRowSelection();

        return (
            <div>
                <Table rowKey="path"
                       loading={this.props.loading}
                       columns={this.getColumns()}
                       dataSource={rows}
                       size="small"
                       pagination={{'pageSize':10, hideOnSinglePage:false}}
                       sortDirections={['ascend', 'descend']}
                       rowSelection={{
                           type: "checkbox",
                           ...rowSelection,
                       }}
                       onChange={this.onTableChangeHandler}></Table>

                <Modal
                    visible={this.state.showDeleteFileDialog}
                    onCancel={() => {this.setState({showDeleteFileDialog: false})}}
                    onOk={this.handleFileDeleteConfirmation}
                    okText="Yes"
                    cancelText="No"
                    title="Are you sure?">
                    <p>Do you want to delete this file?</p>
                </Modal>

                <Modal
                    visible={this.state.showDeleteFolderDialog}
                    onCancel={() => {this.setState({showDeleteFolderDialog: false})}}
                    onOk={this.handleFolderDeleteConfirmation}
                    okText="Yes"
                    cancelText="No"
                    title="Are you sure?">
                    <p>Do you want to delete this folder and all files in it?</p>
                </Modal>
            </div>

    );

    }
}

/***
 *
 *
 <Dialog
 ignoreBackdropClick
 maxWidth="sm"
 open={this.state.showDeleteFileDialog}
 style={{'padding':'8px'}}>
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
 onKeyDown={(e)=>{if(e.keyCode===13) this.handleFileDeleteOk()}}
 onClick={this.handleFileDeleteOk}></LoadingButton>
 </DialogActions>
 </Dialog>

 <Dialog
 ignoreBackdropClick
 maxWidth="sm"
 open={this.state.showDeleteFolderDialog}
 style={{'padding':'8px'}}>
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
 onKeyDown={(e)=>{if(e.keyCode===13) this.handleFolderDeleteOk()}}
 onClick={this.handleFolderDeleteOk}></LoadingButton>
 </DialogActions>
 </Dialog>
 */


TableView.propTypes = {
    files: PropTypes.array.isRequired,
    folders: PropTypes.array.isRequired,
};

export default withRouter(TableView);