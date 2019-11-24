import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import Gallery from 'react-grid-gallery';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DownloadIcon from '@material-ui/icons/CloudDownload';


const styleSheet = (theme) => ({
    margin: {
        margin: '8px',
        padding: '0px'
    },
    imgGroup:{
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid rgb(221, 221, 221)",
        overflow: "auto",
        padding:"24px"
    },
    captionStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        maxHeight: "240px",
        overflow: "hidden",
        position: "absolute",
        bottom: "0",
        width: "100%",
        color: "white",
        padding: "2px",
        fontSize: "90%"
    },
    thumbnailSmall:{
        border:'5px solid red'
    }

});


class PhotoGroup extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {images: this.props.photos.children};
        this.onSelectImage = this.onSelectImage.bind(this);
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

    onSelectImage (index, image) {

        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected")) {
            img.isSelected = !img.isSelected;
        }
        this.setState({images: images});

        //send to parent only the selected images
        this.props.onImageSelect(img);
    }

    render() {
        const classes = this.props.classes;

        var images =
            this.state.images.map((i) => {
                i.thumbnailCaption = (
                    <div>
                        <IconButton aria-label="delete" className={classes.margin} onClick={(e)=>{e.preventDefault();console.log('todo:info');}}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete" className={classes.margin} onClick={(e)=>{e.preventDefault();console.log('todo:edit');}}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete" className={classes.margin} onClick={(e)=>{e.preventDefault();console.log('todo:delete');}}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete" className={classes.margin} style={{float: 'right'}} onClick={(e)=>{e.preventDefault();console.log('todo:download');}}>
                            <DownloadIcon fontSize="small" />
                        </IconButton>
                    </div>
                );
                return i;
            });

        return(

            <div className={classes.imgGroup} >
                <Typography>{this.props.photos.label}</Typography>
                <Gallery
                    onSelectImage={this.onSelectImage}
                    images={images}
                    showLightboxThumbnails={true}
                    thumbnailWidth="190px"
                    margin="4px"
                    customControls={[
                        <button key="editImage" onClick={()=>console.log('todo:edit')}>edit</button>,
                        <button key="deleteImage" onClick={()=>console.log('todo:delete')}>delete</button>
                    ]}/>
            </div>

        )
    }

}



FileList.propTypes = {
    photos: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(PhotoGroup));