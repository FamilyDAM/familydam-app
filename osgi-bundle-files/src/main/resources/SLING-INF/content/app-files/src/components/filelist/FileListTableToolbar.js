import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";
import classNames from 'classnames';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import DeleteIcon from 'material-ui-icons/Delete';
import FileDownloadIcon from 'material-ui-icons/FileDownload';



const styleSheet = theme => ({
    root: {
        paddingRight: 2,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.A700,
                backgroundColor: theme.palette.secondary.A100,
            }
            : {
                color: theme.palette.secondary.A100,
                backgroundColor: theme.palette.secondary.A700,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});



class FileListTableToolbar extends Component {

    render(){
        let {files, classes} = this.props;
        let numSelected = files.length;

        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}>
                <div className={classes.title}>
                    {numSelected > 0 ? (
                        <Typography type="subheading">{numSelected} selected</Typography>
                    ) : (
                        <Typography type="title">Files</Typography>
                    )}
                </div>
                <div className={classes.spacer}/>
                <div className={classes.actions} style={{marginRight:'8px'}}>
                    {numSelected > 0 && (
                        <IconButton aria-label="Delete">
                            <DeleteIcon/>
                            <FileDownloadIcon/>
                        </IconButton>
                    )}
                </div>
            </Toolbar>
        );
    }
}

FileListTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    file: PropTypes.array,
};

export default withStyles(styleSheet)(FileListTableToolbar);

