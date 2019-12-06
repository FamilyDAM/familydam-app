import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {AutoSizer, Column, Table} from 'react-virtualized'; //SortIndicator
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';


const styleSheet = (theme) => ({
    gridListRoot: {
        margin: '24px',
        background: theme.palette.background.paper,
        justifyContent: 'center'
    },
    title: {
        color: theme.palette.primary[200],
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    }
});

class UploadSidebar extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            files: [],
            isMounted: true
        };

        this._rowGetter = this._rowGetter.bind(this);
    }

    componentWillMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }

    _noRowsRenderer() {
        return <div>Pick Files to Add</div>;
    }

    _nameCellRenderer(props) {
        //cellData, columnData, columnIndex, dataKey, isScrolling, parent, rowData, rowIndex
        return(
            <div>{props.cellData}</div>
        );
    }

    _closeCellRenderer(cellData, columnData, columnIndex, dataKey, isScrolling, parent, rowData, rowIndex) {
        return(
            <Button><CloseIcon/></Button>
        );
    }

    _rowGetter(index){
        return this.props.files[index];
    }


    render() {
        //var classes = this.props.classes;
        var _files = this.props.files;

        return (
            <Paper className={this.props.className} style={this.props.style}>
                <Toolbar>
                    <Typography type="title">Add Files to: {this.props.path}</Typography>
                </Toolbar>

                <div style={{ height: '90%', width: '100%' }}>
                <AutoSizer>
                    {({height, width}) => (
                        <Table
                            width={width}
                            height={height}
                            headerHeight={20}
                            rowHeight={34}
                            rowCount={_files.length}
                            rowGetter={({index}) => _files[index]}
                            noRowsRenderer={this._noRowsRenderer}
                        >
                            <Column
                                dataKey="name"
                                cellRenderer={this._nameCellRenderer}
                                width={100} />

                            <Column width={40}
                                dataKey="uploadProgress"
                                cellRenderer={this._closeCellRenderer}/>
                        </Table>
                    )}
                </AutoSizer>
                </div>

            </Paper>

        )
    }


}

export default withRouter(withStyles(styleSheet)(UploadSidebar));