import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";

import FileListTableToolbar from '../filelist/FileListTableToolbar';
import FileActions from '../../actions/FileActions';
import SingleImageView from "./SingleImageView";
import MultiImageView from "./MultiImageView";

const styleSheet = (theme) => ({


    gridSingleItemInfo: {

    },
    title: {
        color: theme.palette.primary[200],
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

});

class FileInfoSidebar extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            fileNodes: [],
            isMounted: true,
            tabIndex: 0
        };
    }

    componentDidMount() {
        this.setState({isMounted: true, fileActions: FileActions});
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);

        if( this.props.fileNodes ){  //used by Storyboard
            this.setState({"fileNodes": this.props.fileNodes});
        }else {
            FileActions.getFileData.sink.takeWhile(() => this.state.isMounted).subscribe((files) => {
                console.log(JSON.stringify(files));
                this.setState({"fileNodes": files});
            });

            FileActions.getFileData.source.next(this.props.files);
        }
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;

        FileActions.getFileData.source.next(this.props.files);
    }


    handleRatingChange(event, newValue) {
        //set value on current object
        const nodes = this.state.fileNodes;
        nodes[0]['dam:rating'] = newValue;
        this.setState({"fileNodes": nodes});

        //create message
        const msg = {"path":this.props.files[0], "dam:rating":newValue};
        FileActions.setFileProperty.source.next(msg)
    }

    handleTagChange( newValue) {
        var values = newValue;
        if( !Array.isArray(newValue) ) {
            values = newValue.split(',');
        }

        //set value on current object
        const nodes = this.state.fileNodes;
        nodes[0]['dam:tags'] = values;
        this.setState({"fileNodes": nodes});

        //create message
        const msg  = {"path":this.props.files[0], "dam:tags":values };
        this.state.fileActions.setFileProperty.source.next(msg)
    }

    render() {
        var classes = this.props.classes;

        return (
            <Paper style={this.props.style}>
                <FileListTableToolbar
                    onDownload={this.props.handleDownload}
                    files={this.props.files}/>

                {(this.state.fileNodes.length===1 && this.state.fileNodes[0]['jcr:mixinTypes'].indexOf('dam:image') > -1) &&
                    <SingleImageView
                        node={this.state.fileNodes[0]}
                        tabIndex={this.state.tabIndex}
                        handleTabChange={this.handleTabChange}
                        handleRatingChange={this.handleRatingChange}
                        handleTagChange={this.handleTagChange}/>
                }

                {(this.state.fileNodes.length > 1) &&
                    <MultiImageView
                        nodes={this.state.fileNodes}/>
                }

            </Paper>
        )
    }
}



FileList.propTypes = {
    files: PropTypes.array.isRequired,
};

//export default withRouter(withStyles(styleSheet)(FileInfoSidebar));