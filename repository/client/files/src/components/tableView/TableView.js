import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';

import { Table, Tag, Space } from 'antd';
import { format, parseISO } from 'date-fns'


class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: true,
            folders: [],
            files: []
        };

        this.handleRowClick = this.handleRowClick.bind(this);
    }

    handleRowClick(e){
        const id = e.currentTarget.attributes['data-id'].value;
        this.props.onRowClick(id);
    }

    onTableChangeHandler(pagination, filters, sorter, extra: { currentDataSource: [], action: paginate | sort | filter }){
        console.log("onTableChange");
    }



    getColumns(){
        return [
            {
                title: 'type',
                dataIndex: 'type',
                width: 80,
                render: (text, record) => <span>{record.contentType}</span>, //todo: replace with icon
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={record.id}>{text}</Link>,
            },
            {
                title: 'Date Created',
                dataIndex: 'createdDate',
                key: 'createdDate',
                width: 200,
                render: text => <span>{text?format(parseISO(text || ""),'yyyy-MM-dd hh:mm:ss a'):''}</span>,
            },
            {
                title: 'Action',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <Space size="middle">
                        <a>Info</a>
                        <a>Delete</a>
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

        const rowSelection = this.getRowSelection();

        return (
            <Table rowKey="id"
                   loading={this.props.loading}
                   columns={this.getColumns()}
                   dataSource={rows}
                   size="small"
                   pagination={{hideOnSinglePage:false}}
                   rowSelection={{
                       type: "checkbox",
                       ...rowSelection,
                   }}
                   onChange={this.onTableChangeHandler}/>
        );

    }
}



TableView.propTypes = {
    files: PropTypes.array.isRequired,
    folders: PropTypes.array.isRequired,
};

export default withRouter(TableView);