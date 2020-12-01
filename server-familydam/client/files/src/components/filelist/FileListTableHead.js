import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';


import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';


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
        const { classes, order, orderBy } = this.props;

        return (
            <TableHead className={classes.tableHead}>
                <TableRow>
                    <TableCell padding="none" style={{width:'100%', padding:'16px 8px 16px 16px'}}>
                        <TableSortLabel
                            active={orderBy === "name"}
                            direction={order}
                            onClick={this.createSortHandler("name")}>
                            Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell padding="none" style={{minWidth:'200px', padding:'16px 8px'}}>
                        <TableSortLabel
                            active={orderBy === "dam:date.created"}
                            direction={order}
                            onClick={this.createSortHandler("dam:date.created")}>
                            Created
                        </TableSortLabel>
                    </TableCell>
                    <TableCell padding="none" style={{textAlign:'center', minWidth:'100px', padding:'16px 8px'}}>
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
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}


export default withStyles(styleSheet)(FileListTableHead);

