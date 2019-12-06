import React from 'react';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import {withStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import {AutoSizer, Column, Table} from 'react-virtualized';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});

class VirtualizedTable extends React.PureComponent {
    static defaultProps = {
        headerHeight: 48,
        rowHeight: 48,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };


    cellRenderer = ({ cellData, columnData, columnIndex, dataKey, isScrolling, parent, rowData, rowIndex }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;

        if( columns[columnIndex].icons ){
            return (
                columns[columnIndex].icons.map( icon => {
                    if( "delete" === icon ){
                        return (<Button onClick={()=>this.props.onDelete(this.props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><DeleteIcon /></Button>);
                    }
                    else if( "download" === icon ){
                        return (<Button onClick={()=>this.props.onDownload(this.props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><DownloadIcon /></Button>);
                    }
                    else if( "close" === icon ){
                        return (<Button onClick={()=>this.props.onClose(this.props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><CloseIcon /></Button>);
                    }
                    else if( "xdelete" === icon ){
                        return (<Button onClick={()=>this.props.onDelete(this.props.folder.path)} style={{minWidth:'24px', padding:"4px"}}><CloseIcon /></Button>);
                    }
                    else {
                        return (<div></div>)
                    }
                })
            )
        }
        else if( columns[columnIndex].component ){
            return React.cloneElement(columns[columnIndex].component, cellData);
        }else {
            return (
                <TableCell
                    component="div"
                    className={clsx(classes.tableCell, classes.flexContainer, {
                        [classes.noClick]: onRowClick == null,
                    })}
                    variant="body"
                    style={{height: rowHeight}}
                    align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
                >
                    {cellData}
                </TableCell>
            );
        }
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table height={height} width={width} {...tableProps} rowClassName={this.getRowClassName}>
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

export default withStyles(styles)(VirtualizedTable);