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
        borderBottom: '1px solid #000000'
    },
    formContainer:{
        marginLeft:'16px',
        marginRight:'16px'
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

        this.state = {
            selectedUser:2,
            selectedTab:0
        };
    }


    handleTabChange(event, value){
        this.setState({ 'selectedTab': value });
    }


    render(){
        var classes = this.props.classes;


        return(
            <Paper  className={classes.outerContainer}>
                <div className={classes.headerContainer}>
                    <Typography type="title" color={'primary'} className={classes.title}>Mike Nimer</Typography>
                </div>
                <div className={classes.formContainer}>
                    <form className={classes.container} noValidate autoComplete="off">
                        <div className={classes.twoColumnGrid}>
                            <div className={classes.leftColumn}>
                                <TextField
                                    id="firstName"
                                    label="First Name"
                                    className={classes.textField}
                                    margin="normal"
                                />
                            </div>
                            <div className={classes.rightColumn}>
                                <TextField
                                    id="lastName"
                                    label="Last Name"
                                    className={classes.textField}
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
                                    margin="normal"
                                />
                            </div>

                            <div className={classes.fullColumn} style={{gridRow: '2', 'textAlign':'right'}}>
                                <LoadingButton
                                    style={{width:'100px'}}
                                    label={"Save"}></LoadingButton>
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