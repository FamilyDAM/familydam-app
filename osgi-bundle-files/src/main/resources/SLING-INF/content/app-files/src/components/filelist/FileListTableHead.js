import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';


import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';



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
                    <TableCell padding="checkbox" style={{width:'20px'}}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>

                    <TableCell padding="none" style={{minWidth:'49px'}}></TableCell>

                    {this.props.columns.map(column => {
                        return (
                            <TableCell
                                padding="default"
                                key={column.id}
                                numeric={column.numeric}
                                style={column.stylesheet}>

                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}>
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        );
                    }, this)}

                    <TableCell padding="default" style={{minWidth:'100px'}}>
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

