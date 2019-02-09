import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '3px',
        transform: 'translate(-50%, -50%)'
    }
});

class LoadingButton extends Component {

    constructor(props, context) {

        if( !props.style ){
            props.style = {};
        }

        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        console.log("loading button click");
        if( this.props.onClick ){
            this.props.onClick(e);
        }else{
            console.dir(this.props);
        }
    }

    render() {
        var classes = this.props.classes;

        return (
            <Button
                raised
                color="accent"
                style={this.props.style}
                onClick={this.handleClick}>
                {this.props.isLoading &&
                <CircularProgress className={classes.progress} color="#fff" size={25}/>
                }
                <Typography style={{"paddingLeft":"8px", color:"#fff"}}>{this.props.label} *</Typography>
            </Button>
        );
    }
}

export default injectIntl(withStyles(styleSheet)(LoadingButton));