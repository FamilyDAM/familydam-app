/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';

import {withStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
//import AccountCircle from '@material-ui/icons/AccountCircle';



import AppShell from '../../library/appShell/AppShell';
import UserActions from "../../library/actions/UserActions";
import UserEditForm from "../../components/usereditform";
import {Typography} from "@material-ui/core";


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


    container:{
        margin: '48px',
        height:'100%'
    }
});


class UserDetails extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isLoading:false,
            anchorEl:null,
            error:null,
            user:props.user,
            selectedUser:{id:null, firstName:"", lastName:""}
        };
    }

    componentWillMount(){
        this.setState({"isMounted":true, "isLoading": true});

        const _userId = this.props.userId;
        UserActions.getAllUsers.sink.takeWhile(() => this.state.isMounted).subscribe(users_ => {
            if (users_) {
                this.setState({"isLoading": false});
                for (const user of users_) {
                    if( user.id === _userId){
                        this.setState({"selectedUser": user});
                        break;
                    }
                }
            }
        });

        UserActions.getAllUsers.source.next(true);

        if( !_userId ){
            this.setState({"isMounted":true, "isLoading":false});
        }
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }


    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <AppShell>
                    <CircularProgress className={classes.progress} size={50} />

                    {this.state.error &&
                        <Typography>
                            {this.state.error}
                        </Typography>
                    }
                </AppShell>
            );
        }else {
            //Edit User
            return (
                <AppShell user={this.state.user}>
                    <div className={classes.container}>
                        <UserEditForm user={this.state.selectedUser}/>
                    </div>
                </AppShell>
            );
        }
    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(UserDetails)));