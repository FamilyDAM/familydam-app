import React, {Component} from 'react';
import uuid from 'uuid';
import {Receiver} from 'react-file-uploader';
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";


const styleSheet = (theme) => ({

});

class RenderProgress extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
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
        if( this.props.data === 0 ){
            return (
                <Button
                    onClick={()=>this.props.onDelete(this.props.data)}
                    style={{minWidth:'24px', padding:"4px"}}><DeleteIcon /></Button>
            );
        }
        return (
            <CircularProgress
                variant="determinate"
                value={this.props.data}
                onClick={()=>this.props.onProgress(this.props.data)} />
        )
    }
}

export default RenderProgress;