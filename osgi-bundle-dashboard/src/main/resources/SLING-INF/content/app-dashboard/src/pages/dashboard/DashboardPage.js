/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import {CircularProgress} from 'material-ui/Progress';

import AppActions from '../../actions/AppActions';

const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
});

class DashboardPage extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
        };
    }

    componentWillMount(){
        this.setState({"isMounted":true});


        AppActions.navigateTo.takeWhile(() => this.state.isMounted).subscribe((path) => {
            debugger;
            if (path.substring(0, 3) === "://") {
                window.location.href = path.substring(2);
            }else{
                this.props.history.push(path);
            }
        });
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }




    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <div>
                    <CircularProgress className={classes.progress} size={50}/>
                </div>
            );
        }else {
            return (
                <div >
                    Dashboard TODO
                </div>
            );
        }
    }
}


export default injectIntl(withStyles(styleSheet)(DashboardPage));