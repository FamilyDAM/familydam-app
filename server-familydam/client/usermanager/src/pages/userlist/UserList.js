/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
//import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';

import {withStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
//import AccountCircle from '@material-ui/icons/AccountCircle';


import AppShell from '../../library/appShell/AppShell';
import UserActions from "../../library/actions/UserActions";
import AppActions from "../../library/actions/AppActions";
import UserListCard from "../../components/userlistcard";
import AddUserCard from "../../components/addusercard";


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
        height:'100%',
        display:'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gridAutoRows: 'auto',
        gridGap: '16px'
    }
});


class UserList extends Component {


    constructor(props, context) {
        super(props);

        this.handleAddUserClick = this.handleAddUserClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.state = {
            isMounted:true,
            isLoading:false,
            anchorEl:null,
            users:[]
        };
    }

    componentWillMount(){
        this.setState({"isMounted":true, "isLoading": true});

        UserActions.getAllUsers.sink.takeWhile(() => this.state.isMounted).subscribe(users_ => {
            if (users_) {
                this.setState({"isLoading": false, "users": users_});
            }
        });

        UserActions.getAllUsers.source.next(true);
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }

    handleAddUserClick() {
        //todo
    }


    handleClick(event) {
        this.setState({anchorEl:event.currentTarget});
    }

    handleClose() {
        this.setState({anchorEl:null});
    }

    handleEdit(user_) {
        this.setState({anchorEl:null});
        AppActions.navigateTo.next("/u/" +user_.id)
    }


    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <AppShell user={this.props.user}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }else {
            return (
                <AppShell user={this.props.user}>
                    <div className={classes.container}>
                        {this.state.users.map( user_ =>
                            <UserListCard user={user_} onEdit={this.handleEdit}/>
                        )}
                        <AddUserCard/>
                    </div>
                </AppShell>
            );
        }
    }
}


export default injectIntl(withStyles(styleSheet)(UserList));