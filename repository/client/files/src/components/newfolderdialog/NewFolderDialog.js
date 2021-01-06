/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
//import AppActions from "../../actions/AppActions";

import { Modal } from 'antd';
import TextField from '@material-ui/core/TextField';

import FileActions from '../../actions/FileActions';
import GetFilesAndFoldersService from "../../services/GetFileAndFoldersService";

const styleSheet = (theme) => ({ });



class NewFolderDialog extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            folderName:"",
            open:false
        };

        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted:true});
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        this.setState({"open":newProps.open})
    }


    showModal = () => {
        this.setState({
            open: true,
        });
    };

    hideModal = () => {
        this.setState({
            open: false,
        });
    };


    handleSave(){
        if( this.props.handleSave && this.state.folderName.length > 0) {
            this.props.handleSave(this.state.folderName)
        }
    }


    render() {
        //var classes = this.props.classes;
        return (
            <Modal
                visible={this.state.open}
                onCancel={this.hideModal}
                onOk={this.handleSave}
                okText="Create"
                cancelText="Cancel"
                title="New Folder">

                    <TextField
                        id="newFolderName"
                        label="Folder Name"
                        value={this.state.folderName}
                        onChange={(e)=>this.setState({folderName: e.target.value})}
                        margin="dense"
                    />

            </Modal>

        );
    }

}


export default withStyles(styleSheet)(NewFolderDialog);