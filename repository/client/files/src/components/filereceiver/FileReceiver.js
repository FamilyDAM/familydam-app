import React, {Component} from 'react';

import {Receiver} from 'react-file-uploader';
import FileScanner from '../../utilities/FileScanner';


class FileReceiver extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isMounted: true
        };

        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleAddFile = this.handleAddFile.bind(this);
    }

    componentWillMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
    }

    handleOnDragEnter(e) {
        //console.log("onDragEnter");
        this.setState({isReceiverOpen: true});
    }

    handleOnDragOver(e) {
        // your codes here
        if( this.state.isReceiverOpen ) {
            this.setState({isReceiverOpen: true});
        }
    }

    handleOnDragLeave(e) {
        this.setState({isReceiverOpen: false});
    }

    handleAddFile(e, files) {
        new FileScanner().scanFiles(e, this.props.path, files);
    }

    render() {
        //var classes = this.props.classes;

        return (
            <Receiver
                onDragEnter={this.handleOnDragEnter}
                onDragOver={this.handleOnDragOver}
                onDragLeave={this.handleOnDragLeave}
                onFileDrop={this.handleAddFile}/>
        )
    }
}

export default FileReceiver;