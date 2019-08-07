/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LoadingButton from "../../library/loadingButton/LoadingButton";

import UserManagerActions from '../../actions/UserManagerActions';
import UserActions from "../../library/actions/UserActions";

const styleSheet = (theme) => ({
    outerContainer:{
        width:'100%',
        height:'100%',
        backgroundColor: '#FFFFFF'
    },
    title:{
        padding:'16px'
    },
    headerContainer:{
        height: '64px',
        borderBottom: '1px solid #000000'
    },
    formContainer:{
        marginLeft:'16px',
        marginRight:'16px',
        clear: 'left'
    },
    oneColumnGrid:{
        display:'grid',
        gridGap: '0px',
        gridTemplateRows: "auto auto 40px auto auto",
        gridTemplateColumns: "1fr"
    },
    twoColumnGrid:{
        display:'grid',
        gridGap: '16px',
        gridTemplateRows: "auto",
        gridTemplateColumns: "1fr 1fr"
    },
    leftColumn:{
        gridColumn: "1",
        gridRow: "1"
    },
    rightColumn:{
        gridColumn: "2",
        gridRow: "1"
    },
    fullColumn:{
        gridColumn: "1/2",
        gridRow: "1"
    },
    textField:{
        width:'100%',
        minWidth:'200px'
    },
    tabContainer:{
        width:'100%',
        minHeight:'200px',
        minWidth:'200px',
        padding:'24px'
    },
    rightTextField:{
        textAlign:'right',
        margin:'16px',
        width:'100%',
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class UserEditForm extends Component {

    constructor(props, context) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.state = {
            selectedUser:2,
            selectedTab:0,
            user: this.props.user
        };
    }


    componentWillMount(){
        this.setState({"isMounted":true, "isLoading": true});

        UserManagerActions.saveUser.sink.takeWhile(() => this.state.isMounted).subscribe(user_ => {
            this.setState({user: user_});
            this.setState({"isLoading": false});
        });
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }



    handleTabChange(event, value){
        this.setState({ 'selectedTab': value });
    }

    handleFormChange(event){
        let _user = this.state.user;
        _user[event.target.id] = event.target.value;
        this.setState({ user: _user});
    }

    handleSave(event){
        this.setState({"isLoading": true});
        UserManagerActions.saveUser.source.next(this.state.user);
    }


    render(){
        var classes = this.props.classes;


        return(
            <Paper  className={classes.outerContainer}>
                <div className={classes.headerContainer}>
                    <Typography type="title" variant="h4" color={'primary'} className={classes.title} style={{'float': 'left'}} display="inline">
                        {this.state.user.firstName} {this.state.user.lastName}
                    </Typography>

                    <div style={{'float': 'right', 'margin':'16px'}}>
                        <LoadingButton
                            style={{width:'100px'}}
                            onClick={this.handleSave}
                            label={"Save"}></LoadingButton>
                    </div>
                </div>
                <div className={classes.formContainer}>
                    <form className={classes.container} noValidate autoComplete="off">
                        <div className={classes.twoColumnGrid}>
                            <div className={classes.leftColumn}>
                                <TextField
                                    id="firstName"
                                    label="First Name"
                                    className={classes.textField}
                                    value={this.state.user.firstName}
                                    onChange={this.handleFormChange}
                                    margin="normal"
                                />
                            </div>
                            <div className={classes.rightColumn}>
                                <TextField
                                    id="lastName"
                                    label="Last Name"
                                    className={classes.textField}
                                    value={this.state.user.lastName}
                                    onChange={this.handleFormChange}
                                    margin="normal"
                                />
                            </div>
                        </div>

                        <div className={classes.oneColumnGrid}>
                            <div className={classes.fullColumn}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    className={classes.textField}
                                    value={this.state.user.email}
                                    onChange={this.handleFormChange}
                                    margin="normal"
                                />
                            </div>



                            <div className={classes.fullColumn} style={{gridRow: '4'}}>
                                <Tabs
                                    value={this.state.selectedTab}
                                    fullWidth={true}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    className={classes.textField}
                                    onChange={this.handleTabChange}>
                                    <Tab label="Social Networks" />
                                    <Tab label="Permission" />
                                    <Tab label="Friends" />
                                </Tabs>

                                {this.state.selectedTab === 0 && <div className={classes.tabContainer}>TBD Social Networks</div>}
                                {this.state.selectedTab === 1 && <div className={classes.tabContainer}>TBD Permission</div>}
                                {this.state.selectedTab === 2 && <div className={classes.tabContainer}>TBD Friends</div>}
                            </div>
                        </div>

                    </form>
                </div>
            </Paper>
        )
    }

}



export default withStyles(styleSheet)(UserEditForm);