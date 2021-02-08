/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {withStyles} from "@material-ui/core/styles";

import { Modal } from 'antd';
import TextField from '@material-ui/core/TextField';

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
        this.setState({isMounted:true, "open":this.props.open});
    }


    componentWillUnmount(){
        this.setState({isMounted:false});
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

        if( this.props.onCancel ){
            this.props.onCancel();
        }
    };


    handleSave(){
        if( this.props.onSave && this.state.folderName.length > 0) {
            this.props.onSave(this.state.folderName)
        }
        this.setState({"open":false});
    }


    render() {
        //var classes = this.props.classes;
        const { t } = this.props;

        return (
            <Modal
                visible={this.state.open}
                onCancel={this.hideModal}
                onOk={this.handleSave}
                okText={t('label.create')}
                cancelText={t('label.cancel')}
                title={t('label.createNewFolder')}>

                    <TextField
                        id="newFolderName"
                        label={t('label.folderName')}
                        value={this.state.folderName}
                        onChange={(e)=>this.setState({folderName: e.target.value})}
                        margin="dense"
                    />

            </Modal>

        );
    }

}


export default withTranslation()(withStyles(styleSheet)(NewFolderDialog));