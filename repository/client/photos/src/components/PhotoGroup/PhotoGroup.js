import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import Gallery from 'react-grid-gallery';
import Typography from '@material-ui/core/Typography';


const styleSheet = (theme) => ({
    imgGroup:{
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid rgb(221, 221, 221)",
        overflow: "auto",
        padding:"24px"
    },

});


class PhotoGroup extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
    }

    render() {
        const classes = this.props.classes;

        return(

            <div className={classes.imgGroup} >
                <Typography>{this.props.photos.label}</Typography>
                <Gallery images={this.props.photos.children}/>
            </div>

        )
    }

}



FileList.propTypes = {
    photos: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(PhotoGroup));