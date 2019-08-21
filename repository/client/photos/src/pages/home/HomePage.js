/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from '@material-ui/core/CircularProgress';
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
            path:"/content/files",
            photos:[]
        };
    }

    componentWillMount(){
        this.setState({'isLoading':true, "isMounted":true});

        PhotoActions.listPhotos.sink.subscribe( results => {


            let groups = {};
            let photoList = this.state.photos.concat(results);
            for (const node of photoList) {  //todo, append to this.state.photos
                if( node['dam:date.created'] ) {
                    try {
                        var groupDate = node['dam:date.created'];
                        groupDate = new Date(Date.parse(groupDate));
                        groupDate = (groupDate.getYear()+1900) + "-" + groupDate.getMonth() + "-" + groupDate.getDate();
                        if (!groups[groupDate]) {
                            var group = {};
                            group.label = groupDate;
                            group.children = [];
                            groups[groupDate] = group;
                        }

                        groups[groupDate].children.push(node);
                    }catch(err){
                        //skip image
                    }
                }
            }

            let photos = [];
            for (const group in groups){
                photos.push(groups[group]);
            }
            photos.sort((a, b) => a.label - b.label);


            //
            this.setState({'isLoading':false, 'photos': photos} );
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
                <AppShell user={this.props.user||{}} open={false}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }else {
            return (
                <AppShell user={this.props.user||{}} open={false}>
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