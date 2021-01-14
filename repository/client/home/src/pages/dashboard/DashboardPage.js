/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FileIcon from '@material-ui/icons//InsertDriveFile';
//import PhotoIcon from '@material-ui/icons//PhotoLibrary';
import Paper from '@material-ui/core/Paper';

import AppShell from '../../library/appShell/AppShell';
import AppActions from '../../library/actions/AppActions';
import LoadClientAppsService from "../../library/services/LoadClientAppsService";


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing(2)}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },

    contentContainer:{
        height:'100%',
        margin:'auto',
        display:"grid",
        gridGap:'24px',
        gridTemplateRows: "auto 125px 150px 150px auto",
        gridTemplateColumns: "auto 300px 300px auto",
        gridAutoFlow: 'column'
    },
    contentHeader:{
        gridColumn: "2/4",
        gridRow: 2,
        marginTop: "auto"
    },
    contentHeaderLabel:{
        fontSize:'96px',
        color: theme.accentColor,
        lineHeight: '104px',
        textTransform: 'capitalize'
    },
    contentAppCard0:{
        gridColumn: "2/3",
        gridRow: 3,
        textAlign: 'center',
        padding:'32px'
    },
    contentAppCard1:{
        gridColumn: "3/4",
        gridRow: 3,
        textAlign: 'center',
        padding:'32px'
    },
    contentAppCard2:{
        gridColumn: "2/3",
        gridRow: 4,
        textAlign: 'center',
        padding:'32px'
    },
    contentAppCard3:{
        gridColumn: "3/4",
        gridRow: 4,
        textAlign: 'center',
        padding:'32px'
    }
});


class DashboardPage extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
        };
    }

    componentDidMount(){
        this.setState({"isMounted":true});


        LoadClientAppsService.sink.takeWhile(() => this.state.isMounted).subscribe( (data)=> {
            if( data ) {
               this.setState({
                    "primaryApps": data.primaryApps,
                    "secondaryApps": data.secondaryApps
                });
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
                <AppShell user={this.props.user} history={this.props.history}>
                    <div className={classes.contentContainer}>
                        <div className={classes.contentHeader}>
                            <Typography style={{fontSize:'24px', lineHeight:'24px'}}>Where would you like to start?</Typography>
                        </div>

                        {this.state.primaryApps && this.state.primaryApps.filter(app=>app.slug !== "home").map((app, indx)=> {
                            return (
                                <Paper key={app.path} data-indx={indx} className={classes['contentAppCard' +indx]} onClick={() => window.location.href = app.path}>
                                    <FileIcon style={{width: '48px', height: '48px'}}/>
                                    <Typography style={{fontSize: '24px'}}>{app.label}</Typography>
                                </Paper>
                            )
                        })}

                    </div>

                </AppShell>
            );
        }
    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(DashboardPage)));