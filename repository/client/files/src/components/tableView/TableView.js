import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import {Drawer, Modal, Space, Table} from 'antd';
import {FileOutlined, FolderOutlined} from '@ant-design/icons';



import Button from "@material-ui/core/Button";
import SingleImageView from "../fileinfosidebar/SingleImageView";


class TableView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: true,
            showDeleteFileDialog: false,
            showSidebar: false,
            pendingFileToDelete: [],
            folders: [],
            files: [],
            selectedFile: {}
        };

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.handleFileDeleteConfirmation = this.handleFileDeleteConfirmation.bind(this);
        this.handleFolderDelete = this.handleFolderDelete.bind(this);
        this.handleFolderDeleteConfirmation = this.handleFolderDeleteConfirmation.bind(this);
        this.handleNodeChange = this.handleNodeChange.bind(this);
    }

    handleRowClick(e){
        const id = e.currentTarget.attributes['data-id'].value;
        this.props.onRowClick(id);
    }

    onTableChangeHandler(pagination, filters, sorter, extra){
        //extra: { currentDataSource: [], action: paginate | sort | filter }
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

    //Save changes
    handleNodeChange(node){
        if( this.props.onNodeChange ){
            this.props.onNodeChange(node);
        }
    }


    fieldNameSorter(a, b, c){
        //first put folders before files
        console.log(c);
        if( a.primaryType==="nt:folder" && b.primaryType==="nt:file") return -1;
        else if( a.primaryType==="nt:file" && b.primaryType==="nt:folder") return 1;
        else if( a.primaryType === b.primaryType) {
            // sort by field
            if( a.name.trim().toLowerCase() < b.name.trim().toLowerCase() ) return -1;//c==="descend")?-1:1;
            else if( a.name.trim().toLowerCase() > b.name.trim().toLowerCase() ) return 1;//c==="descend")?1:-1;
            else return 0;
        }
        else return 0;
    }

    fieldDateSorter(a, b, c, d){
        //first put folders before files
        if( a.primaryType==="nt:folder" && b.primaryType==="nt:file") return -1;
        else if( a.primaryType==="nt:file" && b.primaryType==="nt:folder") return 1;
        else if( a.primaryType === b.primaryType) {
            // sort by field
            if( a.createdDate < b.createdDate ) return c==="ascend"?1:-1;
            else if( a.createdDate > b.createdDate ) return c==="ascend"?-1:1;
            else return 0;
        }
        else return 0;
    }




    getColumns(){
        const { t } = this.props;
        return [
            {
                title: '',
                dataIndex: 'type',
                width: 30,
                render: (text, record) => {
                    if( record.primaryType === "nt:folder" ){
                        return (<FolderOutlined style={{fontSize:'24px'}}/>);
                    }if( record.primaryType === "nt:file" && record.mimeType.startsWith("image/") ){
                        return (<img src={record.path +"?size=100"} alt="" style={{width:'24px'}}/>);
                    }else{
                        return (<FileOutlined style={{fontSize:'24px'}}/>);
                    }
                }
            }, {
                title: t('label.name', 'Name'),
                dataIndex: 'name',
                key: 'name',
                sorter: this.fieldNameSorter,
                render: (text, record) => {

                    if( record.primaryType === "nt:folder" ){
                        return (<Link to={record.path}>{text}</Link>);
                    }else{
                        return (<a onClick={()=>this.setState({showSidebar:true, selectedFile: record})}>{text}</a>);
                    }
                },
            },
            {
                title: t('label.dateCreated', "Date Created"),
                dataIndex: 'dateCreated',
                key: 'dateCreated',
                width: 200,
                responsive: ['md'],
                sorter: this.fieldDateSorter,
                render: text => <span>{text? t('date', {date: text}):''}</span>,
            },
            {
                title: t('label.action', 'Action'),
                key: 'action',
                width: 200,
                render: (text, record) => {
                    const downloadBtn = record._links.download && this.props.onDownload? <Button type="link" data-path={record.path} onClick={()=>this.props.onDownload(record.name, record._links.download.href)}>{t('label.download', 'Download')}</Button> : <span/>;
                    const deleteBtn = record._links.self? <Button type="link" data-path={record.path} onClick={this.handleFileDelete}>{t('label.delete', 'Delete')}</Button> : <span/>;
                    const editBtn = <span/>; //<Button type="link" data-path={record.path} onClick={()=>this.setState({showSidebar:true, selectedFile: record})}>Edit</Button>

                    if (record.primaryType === 'nt:file' && record.mimeType.startsWith("image/")) {
                        return (<Space size="middle">
                            {downloadBtn}
                            {deleteBtn}
                            {editBtn}
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            {downloadBtn}
                            {deleteBtn}
                        </Space>)
                    }
                },
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
        const { t } = this.props;

        let rows = [];
        rows = rows.concat(this.props.folders);
        rows = rows.concat(this.props.files);
        rows.sort(this.fieldNameSorter);

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

                <Drawer
                    title={t('label.fileInfo', 'File Info')}
                    placement="right"
                    closable={true}
                    getContainer={false}
                    width="350"
                    bodyStyle={{padding:'0px'}}
                    onClose={()=>this.setState({showSidebar:false, selectedFile:{}})}
                    visible={this.state.showSidebar}
                >
                    <SingleImageView
                        node={this.state.selectedFile}
                        onRatingChange={this.handleNodeChange}
                        onDescriptionChange={this.handleNodeChange}
                        onTagChange={this.handleNodeChange}/>
                </Drawer>

                <Modal
                    visible={this.state.showDeleteFileDialog}
                    onCancel={() => {this.setState({showDeleteFileDialog: false})}}
                    onOk={this.handleFileDeleteConfirmation}
                    okText={t('label.yes', 'Yes')}
                    cancelText={t('label.no', 'No')}
                    title={t('instr.areYouSure', 'Are you sure?')}>
                    <p>{t('instr.deleteFolderTitle', 'Do you want to delete this file?')}</p>
                </Modal>

                <Modal
                    visible={this.state.showDeleteFolderDialog}
                    onCancel={() => {this.setState({showDeleteFolderDialog: false})}}
                    onOk={this.handleFolderDeleteConfirmation}
                    okText={t('label.yes', 'Yes')}
                    cancelText={t('label.no', 'No')}
                    title={t('instr.areYouSure', 'Are you sure?')}>
                    <p>{t('instr.deleteFolderConfirmation', 'Do you want to delete this folder and all files in it?')}</p>
                </Modal>
            </div>

    );

    }
}

TableView.propTypes = {
    files: PropTypes.array.isRequired,
    folders: PropTypes.array.isRequired,
};

export default  withTranslation()(withRouter(TableView));