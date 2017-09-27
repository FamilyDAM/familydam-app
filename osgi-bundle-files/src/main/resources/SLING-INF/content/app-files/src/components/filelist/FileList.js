import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


const styleSheet = (theme) => ({
    main:{
        width:'100%',
        height:'100%',
        backgroundColor: '#fff'
    }
});


class FileList extends Component{

    render(){
        var classes = this.props.classes;

        return (
            <Paper className={classes.main} style={this.props.style}>
                <Typography type="title">File List</Typography>
            </Paper>
        );
    }
}

export default withStyles(styleSheet)(FileList);