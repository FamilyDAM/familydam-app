import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";


const styleSheet = (theme) => ({
    btn: {
        padding: '4px 12px'
    },
    progress: {
        marginRight: `8px`
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

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.label !== this.props.label);
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
                color="primary"
                variant="contained"
                className={classes.btn}
                style={this.props.style}
                onClick={this.handleClick}>
                {this.props.isLoading &&
                    <CircularProgress className={classes.progress} color="#fff" size={25}/>
                }
                {this.props.label}
            </Button>

        );
    }
}

export default withStyles(styleSheet)(LoadingButton);