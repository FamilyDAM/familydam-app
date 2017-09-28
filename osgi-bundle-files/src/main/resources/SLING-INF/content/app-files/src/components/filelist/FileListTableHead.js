import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";
import PropTypes from 'prop-types';

import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';



const styleSheet = theme => ({
    tableHead:{
        backgroundColor: '#fff',
        fontSize:'16px'
    }
});



class FileListTableHead extends Component {

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead className={classes.tableHead}>
                <TableRow>
                    <TableCell checkbox style={{width:'50px'}}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    <TableCell disablePadding style={{width:'50px', margin:'auto'}}>
                    </TableCell>
                    {this.props.columns.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                disablePadding={column.disablePadding}
                                style={{width:column.width}}

                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        );
                    }, this)}
                    <TableCell checkbox style={{width:'50px'}}>
                        Actions
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }
}

FileListTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}


export default withStyles(styleSheet)(FileListTableHead);

