import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


const styleSheet = (theme) => ({
    progress: {

    }
});

class LoadingButton extends Component {

    constructor(props, context) {
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
        var styles = {};
        if( this.props.style ){
            styles = this.props.style;
        }
        if( !styles.minWidth ) styles.minWidth = '40px';
        if( !styles.color ) styles.color = '#fff';
        if( this.props.isLoading ){
            styles['paddingLeft'] = '16px'
        }

        return (
            <Button variant="contained"
                color="primary"
                style={{"height": '25px', "padding": '0px 16px'}} onClick={this.handleClick}>
                {this.props.isLoading &&
                    <CircularProgress className={classes.progress} color="#fff" size={25}/>
                }
                <Typography style={styles}>{this.props.label}</Typography>
            </Button>

        );
    }
}

export default injectIntl(withStyles(styleSheet)(LoadingButton));