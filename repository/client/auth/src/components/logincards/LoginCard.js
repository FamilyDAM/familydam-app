/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AccountCircle from '@material-ui/icons/AccountCircle';

import LoadingButton from '../../library/loadingButton/LoadingButton';

const styleSheet = (theme) => ({
    personalCard: {
        border: '1px solid'
    },
    extendedContainer: {
        display: 'grid',
        gridGap: '16px',
        gridTemplateColumn: '125px auto auto auto',
        gridTemplateRows: '16px auto auto auto auto 16px'
    }
});

class LoginCard extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            user: {
                "firstName": "",
                "lastName": "",
                "email": ""
            },
            password:'',
            mode: "minimal",
            isLoading:false
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }


    componentWillMount() {
        this.setState({"isLoading":false});
    }

    componentDidMount() {
        if (this.refs.pwdField) this.refs.pwdField.focus();

        /**
         $(".loginCard").bind('keypress',function(e){
            if(e.keyCode === 13)
            {
                this.handleLogin(e);
            }
        }.bind(this));
         **/
    }


    handleCancel() {
        this.setState({mode: 'minimal', 'isLoading':false});

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    handleLogin(){
        this.setState({"isLoading":true});

        if (this.props.onLogin) {
            this.props.onLogin(this.props.user.id, this.state.password);
        }
    }

    handleKeyDown(e){
        if (e.key === 'Enter') {
            this.handleLogin();
        }
    }


    handleSelect() {
        this.setState({mode: 'extended'});

        if (this.props.onSelect) {
            this.props.onSelect(this.props.user);
        }
    }


    render() {
        var classes = this.props.classes;

        if (this.state.mode === "minimal") {
            return (
                <Paper style={{width: '150px', height: '176px'}}>
                    <ButtonBase focusRipple
                                onClick={this.handleSelect}
                                style={{'width': '100%', 'backgroundColor': '#fff'}}>
                        <AccountCircle
                            style={{'width': 120, 'height': 120}}
                        />
                    </ButtonBase>
                    <ButtonBase focusRipple
                                onClick={this.handleSelect}
                                style={{'width': '100%', 'backgroundColor': '#fff'}}>
                        <h2 style={{'textAlign': 'center'}}>{this.props.user.firstName}</h2>
                    </ButtonBase>
                </Paper>
            );
        } else {
            return (
                <Paper style={{width: '450px', height: '200px'}}>
                    <div className={classes.extendedContainer}>
                        <div style={{gridRow: '2/5', gridColumn: '1', 'textAlign':'center'}}>
                            <AccountCircle
                                style={{'width': 120, 'height': 120}}
                            />
                        </div>
                        <div style={{gridRow: '2', gridColumn: '2'}}>
                            <Typography type="title" style={{'textAlign': 'left'}}>{this.props.user.firstName}</Typography>
                        </div>
                        <div style={{gridRow: '3', gridColumn: '2'}}>
                            <TextField
                                type="password"
                                label="Password"
                                required={true}
                                style={{'width':'100%'}}
                                value={this.state.password}
                                onKeyDown={this.handleKeyDown}
                                onChange={(e)=> {
                                    this.setState({password: e.target.value})
                                }}
                            />
                        </div>
                        <div style={{gridRow: '4', gridColumn: '2'}}>
                            <Button color="primary" onClick={this.handleCancel}>Cancel</Button>

                            <LoadingButton
                                isLoading={this.state.isLoading}
                                label="Login"
                                onClick={this.handleLogin}></LoadingButton>
                        </div>
                    </div>
                </Paper>
            );
        }
    }

}


export default withStyles(styleSheet)(LoginCard);