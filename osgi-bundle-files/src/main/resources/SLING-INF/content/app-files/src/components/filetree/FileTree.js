import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styleSheet = (theme) => ({

    main:{
        width:'100%',
        minHeight:'250px',
        backgroundColor: '#fff'
    }
});


class FileTree extends Component{

    render(){
        var classes = this.props.classes;

        return (
            <Paper className={classes.main} style={this.props.style}>
                <Typography type="title">File Tree</Typography>
            </Paper>
        );
    }
}

export default withStyles(styleSheet)(FileTree);