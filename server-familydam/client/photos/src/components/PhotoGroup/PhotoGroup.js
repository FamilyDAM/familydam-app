import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';


import Gallery from 'react-grid-gallery';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
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
    imgGroup: {
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid rgb(221, 221, 221)",
        overflow: "auto",
        padding: "24px"
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
    thumbnailSmall: {
        border: '5px solid red'
    }

});


class PhotoGroup extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            images: this.props.photos.children,
            showInfoModel: false,
            showEditModel: false,
            showDeleteModel: false,
            selectedImage: null
        };
        this.onSelectImage = this.onSelectImage.bind(this);
        this.handleInfoClose = this.handleInfoClose.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }

    onSelectImage(index, image) {

        var images = this.state.images.slice();
        var img = images[index];
        if (img.hasOwnProperty("isSelected")) {
            img.isSelected = !img.isSelected;
        }
        this.setState({images: images});

        //send to parent only the selected images
        this.props.onImageSelect(img);
    }

    handleInfo(name_, path_) {
        this.setState({"showInfoModel": true, selectedImage: name_})
    }
    handleInfoClose() {
        this.setState({"showInfoModel": false})
    }

    handleEdit(name_, path_) {
        this.setState({"showEditModel": true, selectedImage: name_})
    }
    handleEditClose() {
        this.setState({"showEditModel": false})
    }


    handleDelete(name_, path_) {
        this.setState({"showDeleteModel": true, selectedImage: name_})
    }
    handleDeleteClose() {
        this.setState({"showDeleteModel": false})
    }

    handleDownload(name_, path_) {
        console.dir("Download: " + name_ + "=" + path_);

        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = path_;
        link.download = name_;
        link.click();

        return false;
    }

    render() {
        const classes = this.props.classes;

        var images =
            this.state.images.map((i) => {
                i.thumbnailCaption = (
                    <div>
                        <IconButton aria-label="info" className={classes.margin}
                                    onClick={(e) => {
                                        this.handleInfo(i.name, i.path);
                                    }}>
                            <InfoIcon fontSize="small"/>
                        </IconButton>
                        <IconButton aria-label="edit" className={classes.margin}
                                    onClick={(e) => {
                                        this.handleEdit(i.name, i.path);
                                    }}>
                            <EditIcon fontSize="small"/>
                        </IconButton>
                        <IconButton aria-label="delete" className={classes.margin}
                                    onClick={(e) => {
                                        this.handleDelete(i.name, i.path);
                                    }}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                        <IconButton data-name={i.name} data-image={i.path}
                                    aria-label="delete" className={classes.margin} style={{float: 'right'}}
                                    onClick={(e) => {
                                        this.handleDownload(i.name, i.path);
                                    }}>
                            <DownloadIcon fontSize="small"/>
                        </IconButton>
                    </div>
                );
                return i;
            });

        return (

            <div className={classes.imgGroup}>
                <Typography>{this.props.photos.label}</Typography>
                <Gallery
                    onSelectImage={this.onSelectImage}
                    images={images}
                    showLightboxThumbnails={true}
                    thumbnailWidth="190px"
                    margin="4px"
                />

                {this.state.showInfoModel &&
                    <Dialog onClose={this.handleInfoClose} aria-labelledby="simple-dialog-title" open={true}>
                        <DialogTitle id="simple-dialog-title">Image Info: {this.state.selectedImage}</DialogTitle>
                    </Dialog>
                }
                {this.state.showEditModel &&
                    <Dialog onClose={this.handleEditClose} aria-labelledby="simple-dialog-title" open={true}>
                        <DialogTitle id="simple-dialog-title">Image Edit: {this.state.selectedImage}</DialogTitle>
                    </Dialog>
                }
                {this.state.showDeleteModel &&
                    <Dialog onClose={this.handleDeleteClose} aria-labelledby="simple-dialog-title" open={true}>
                        <DialogTitle id="simple-dialog-title">Image Delete: {this.state.selectedImage}</DialogTitle>
                    </Dialog>
                }
            </div>

        )
    }

}


FileList.propTypes = {
    photos: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(PhotoGroup));