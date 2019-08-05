/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
//import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';

import {withStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';


import AppShell from '../../library/appShell/AppShell';
import UserList from '../../components/userlist';
import UserEditForm from "../../components/userEditForm";


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
        height:'100%',
        display:'grid',
        gridGap: '0px',
        gridTemplateRows: "auto",
        gridTemplateColumns: "minmax(200px, 250px) 5fr"
    },
    userListSidebar:{
        gridColumn: "1",
        gridRow: "1",
        border: "1px solid"
    },
    detailContainer:{
        gridColumn: "2",
        gridRow: "1"
    }

});


class HomePage extends Component {


    constructor(props, context) {
        super(props);

        this.handleAddUserClick = this.handleAddUserClick.bind(this);

        this.state = {
            isMounted:true,
            isLoading:false
        };
    }

    componentWillMount(){
        this.setState({"isMounted":true});

    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }

    handleAddUserClick() {
        //todo
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
                        <div className={classes.userListSidebar}>
                            <UserList></UserList>
                        </div>
                        <div className={classes.detailContainer}>
                            <UserEditForm/>
                        </div>
                    </div>
                </AppShell>
            );
        }
    }
}


export default injectIntl(withStyles(styleSheet)(HomePage));