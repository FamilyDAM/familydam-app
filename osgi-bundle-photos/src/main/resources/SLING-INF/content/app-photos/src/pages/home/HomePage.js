/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import {CircularProgress} from 'material-ui/Progress';
//import Typography from 'material-ui/Typography';


import AppShell from '../../library/appShell/AppShell';
//import AppActions from '../../library/actions/AppActions';
import PhotoActions from "../../actions/PhotoActions";
import PhotoGroup from "../../components/PhotoGroup/PhotoGroup";


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'

    },

});


class HomePage extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isLoading:true,
            path:"/content/family/files",
            photos:[]
        };
    }

    componentWillMount(){
        this.setState({'isLoading':true, "isMounted":true});

        PhotoActions.listPhotos.sink.subscribe( results => {
           this.setState({'isLoading':false, 'photos': results.body} );
        });

        PhotoActions.listPhotos.source.next({path:this.state.path});
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }



    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <AppShell user={this.props.user||{}}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }else {
            return (
                <AppShell user={this.props.user||{}}>
                    {this.state.photos.map( (p)=>{
                        return (
                            <PhotoGroup key={p.value} photos={p}></PhotoGroup>
                        )
                    })}
                </AppShell>
            );
        }
    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(HomePage)));