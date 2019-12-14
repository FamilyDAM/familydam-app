import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import './filepond.css';
import {FilePond, registerPlugin, setOptions} from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilepondPluginFileMetadata from 'filepond-plugin-file-metadata';
registerPlugin(FilePondPluginImageExifOrientation);
registerPlugin(FilepondPluginFileMetadata);




const styleSheet = (theme) => ({
    gridListRoot: {
        margin: '24px',
        background: theme.palette.background.paper,
        justifyContent: 'center'
    },
    title: {
        color: theme.palette.primary[200],
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

class FilePondSidebar extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            files: [],
            isMounted: true
        };

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

    render() {
        var classes = this.props.classes;

        return (
            <Paper className={this.props.className} style={this.props.style}>
                <Toolbar>
                    <Typography type="title">Add Files to: {this.props.path}</Typography>
                </Toolbar>

                <div className={classes.gridListRoot}>
                    <FilePond
                        ref={ref => this.pond = ref}
                        files={this.state.files}
                        allowMultiple={true}
                        chunkUploads={true}
                        instantUpload={true}
                        maxParallelUploads={3}
                        imagePreviewHeight={50}
                        server={this.props.path}
                        onupdatefiles={(fileItems) => {
                            // Set current file objects to this.state
                            this.setState({
                                files: fileItems.map(fileItem => {
                                    var f = fileItem.file;
                                    f.options =  {"metadata":{"destination": this.props.path}}
                                    return f;
                                })
                            })}}
                        labelIdle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
                        labelInvalidField='Field contains invalid files'
                        labelFileWaitingForSize='Waiting for size'
                        labelFileSizeNotAvailable='Size not available'
                        labelFileLoading='Loading'
                        labelFileLoadError='Error during load'
                        labelFileProcessing='Uploading'
                        labelFileProcessingComplete='Upload complete'
                        labelFileProcessingAborted='Upload cancelled'
                        labelFileProcessingError='Error during upload'
                        labelFileProcessingRevertError='Error during revert'
                        labelFileRemoveError='Error during remove'
                        labelTapToCancel='tap to cancel'
                        labelTapToRetry='tap to retry'
                        labelTapToUndo='tap to undo'
                        labelButtonRemoveItem='Remove'
                        labelButtonAbortItemLoad='Abort'
                        labelButtonRetryItemLoad='Retry'
                        labelButtonAbortItemProcessing='Cancel'
                        labelButtonUndoItemProcessing='Undo'
                        labelButtonRetryItemProcessing='Retry'
                        labelButtonProcessItem='Upload'/>
                </div>
            </Paper>





        )
    }
}

export default withRouter(withStyles(styleSheet)(FilePondSidebar));