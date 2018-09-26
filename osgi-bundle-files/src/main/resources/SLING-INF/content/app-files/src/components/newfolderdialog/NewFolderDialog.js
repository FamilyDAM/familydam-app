/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
//import AppActions from "../../actions/AppActions";

import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import FileActions from '../../actions/FileActions';

const styleSheet = (theme) => ({ });


function SlideTransition(props) {
    return <Slide direction="up" {...props} />;
}


class UploadDialog extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            folderName:""
        };

        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted:true});
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }


    handleSave(){
        //send event
        FileActions.createFolder.source.next({name:this.state.folderName, path:this.props.path});

        FileActions.createFolder.sink.subscribe( ()=> {
            if( this.props.onClose ) this.props.onClose();
        });
    }


    render() {
        //var classes = this.props.classes;
        return (
            <Dialog
                maxWidth="md"
                fullScreen={false}
                open={this.props.open}
                transition={SlideTransition}>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>

                    <TextField
                        id="newFolderName"
                        label="Folder Name"
                        value={this.state.folderName}
                        onChange={(e)=>this.setState({folderName: e.target.value})}
                        margin="dense"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                    <Button raised color="primary" onClick={this.handleSave}>
                        Save
                    </Button>
                </DialogActions>


                <input type="file"
                       ref="fileInputField"
                       multiple
                       style={{'display': 'none'}}
                       onChange={this.handleFileChange}/>
                <input type="file"
                       ref="folderInputField"
                       style={{'display': 'none'}}
                       onChange={this.handleFolderChange}/>

            </Dialog>

        );
    }

}


export default withStyles(styleSheet)(UploadDialog);