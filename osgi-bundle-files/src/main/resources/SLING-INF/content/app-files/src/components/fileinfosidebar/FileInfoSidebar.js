import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {GridList, GridListTile, GridListTileBar} from '@material-ui/core/GridList';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';


import FileListTableToolbar from '../filelist/FileListTableToolbar';

//import AppActions from '../../actions/AppActions';
import FileActions from '../../actions/FileActions';

const styleSheet = (theme) => ({

    gridListRoot: {
        marginTop: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper,
    },
    gridList: {
        width: '390px',
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    gridSingleItemInfo: {
        width: '100%',
        height: '100%',
        padding: '24px',
        marginTop: '24px'
    },
    title: {
        color: theme.palette.primary[200],
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

});

class FileInfoSidebar extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            fileNodes: [],
            isMounted: true
        };
    }

    componentWillMount() {
        this.setState({isMounted: true});

        FileActions.getFilesByPath.sink.takeWhile(() => this.state.isMounted).subscribe((files) => {
            this.setState({"fileNodes": files});
        });

        FileActions.getFilesByPath.source.next(this.props.files);
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;

        FileActions.getFilesByPath.source.next(this.props.files);
    }

    render() {
        var classes = this.props.classes;

        return (
            <Paper style={this.props.style}>
                <FileListTableToolbar
                    files={this.props.files}/>


                <div className={classes.gridListRoot}>
                    <GridList className={classes.gridList} cols={2.5}>
                        {this.state.fileNodes.map(file => (
                            <GridListTile key={file['jcr:path']}>
                                <img src={"http://localhost:9000" + file['jcr:path']}
                                     alt={file['jcr:path']}/>
                                <GridListTileBar
                                    title={file['jcr:path']}
                                    classes={{
                                        root: classes.titleBar,
                                        title: classes.title,
                                    }}
                                    actionIcon={
                                        <IconButton>
                                            <StarBorderIcon className={classes.title}/>
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        ))}
                    </GridList>



                    {this.state.fileNodes.length === 1 &&
                        <div className={classes.gridItemInfo}>
                            <Typography>Path</Typography>
                            <div>{this.state.fileNodes[0]['jcr:path']}</div>
                        </div>
                    }



                    {this.state.fileNodes.length > 1 &&
                    <div className={classes.gridItemInfo}>
                        <Typography>Paths</Typography>
                        {this.state.fileNodes.map(file => (
                            <div>{file['jcr:path']}</div>
                        ))}

                    </div>
                    }
                </div>

            </Paper>
        )
    }
}


FileList.propTypes = {
    files: PropTypes.array.isRequired,
};

export default withRouter(withStyles(styleSheet)(FileInfoSidebar));