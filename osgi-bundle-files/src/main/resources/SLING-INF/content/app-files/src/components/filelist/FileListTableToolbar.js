import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import classNames from 'classnames';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FileDownloadIcon from '@material-ui/icons/CloudDownload';



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
        display:'flex'
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
                    {(files.length > 1 ) && <Typography type="subheading">{numSelected} selected</Typography>}
                    {(files.length === 1) && <Typography type="title">{files[0].substr(files[0].lastIndexOf('/')+1)}</Typography>}
                </div>
                <div className={classes.spacer}/>
                <div className={classes.actions} style={{width:'100px', marginRight:'8px'}}>

                    <IconButton aria-label="Delete">
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton aria-label="Download">
                        <FileDownloadIcon/>
                    </IconButton>

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

