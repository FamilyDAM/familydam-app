/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from "react";
import {injectIntl, FormattedMessage} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import { GridContainer, GridItem } from "../../library/CssGrid";

import LoadingButton from '../../library/loadingButton/LoadingButton';
//import AppActions from "../../actions/AppActions";
import UserActions from "../../actions/UserActions";

const styleSheet = (theme) => ({
    loginCardForm:{
        padding: "20px",
        width: "100%",
        backgroundColor: "#ffffff"
    },
    textField:{
        "width":"100%"
    }
});



class SignupCard extends Component {

    constructor(props, context){
        super(props);

        this.state = {
            isLoading: false,
            firstNameError:'',
            lastNameError:'',
            emailError:'',
            passwordError:'',
            confirmPasswordError:'',
            user: {
                "firstName":"",
                "lastName":"",
                "email":"",
                "password":"",
                "confirmPassword":""
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentWillUnMount(){
        if( this.createUserSubscription !== undefined ){
            //this.createUserSubscription.dispose();
        }
    }


    componentDidMount(){
        /**
        $(".loginCardForm").bind("keypress",(e)=>{
            if(e.keyCode === 13) {
                this.handleSubmit(e);
                //put button.click() here
            }
        });
         **/
    }


    clearValidationErrors(){
        this.setState({firstNameError:'',
            lastNameError:'',
            emailError:'',
            passwordError:'',
            confirmPasswordError:''});
    }


    isValidForm(){
        this.clearValidationErrors();

        let isValid = true;
        if(!this.state.firstName){
            isValid = false;
            this.setState({firstNameError: "First name is required"});
        }
        if(!this.state.email){
            isValid = false;
            this.setState({emailError: "Email is required"});
        }
        if(!this.state.password){
            isValid = false;
            this.setState({passwordError: "A password is required"});
        }

        return isValid;
    }
    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleSubmit(event)
    {
        console.log("handleSubmit - create user");
        if( this.state.isLoading ) return;

        let isValid = this.isValidForm();
        if( this.state.password !== this.state.confirmPassword){
            isValid = false;
            this.setState({confirmPasswordError: "The passwords must match"});
        }else{
            //AppActions.navigateTo.next("://app-photos/index.html");
        }

        if( isValid ) {

            this.setState({isLoading: true});


            var _user = {};
            _user.username = this.state.firstName.toLowerCase();
            _user.password = this.state.password;
            _user.isFamilyAdmin = true;
            _user.userProps = {};
            _user.userProps.firstName = this.state.firstName;
            _user.userProps.lastName = this.state.lastName;
            _user.userProps.email = this.state.email;


            this.createUserSubscription = UserActions.createUser.sink.subscribe( (data_) => {
                //load all the users (with our new user)
                console.log("UserActions.createUser.sink: ");
                console.dir(data_);
                this.setState({isLoading: false});
                UserActions.getAllUsers.source.next(true);
            }, (error_) => {
                alert(error_);
            });


            UserActions.createUser.source.next(_user);
        }

    }


    render() {
        var classes = this.props.classes;

        return (
            <Paper style={{maxWidth:'800px'}}>
                <GridContainer gap="16px" rowTemplate="48px auto" columnTemplate="1fr 1fr" style={{'margin':'16px'}}>

                    <GridItem rows="1" columns="1 / 3" style={{'borderBottom':'1px solid #ccc'}}>
                        <h2><FormattedMessage id="SignupCard.label" defaultMessage="Create First User"/></h2>
                    </GridItem>

                    <GridItem rows="2" columns="1/2">
                        <TextField
                            label="First Name"
                            required={true}
                            className={classes.textField}
                            value={this.state.firstName}
                            onChange={(e)=>{this.setState({firstName:e.target.value});this.clearValidationErrors()}}
                            error={this.state.firstNameError.length>0} helperText={this.state.firstNameError}
                        />
                    </GridItem>
                    <GridItem rows="2" columns="2/3">
                        <TextField
                            label="Last Name"
                            className={classes.textField}
                            value={this.state.lastName}
                            onChange={(e)=>{this.setState({lastName:e.target.value});this.clearValidationErrors()}}
                            error={this.state.lastNameError.length>0} helperText={this.state.lastNameError}
                        />
                    </GridItem>

                    <GridItem rows="3" columns="1/3">
                        <TextField
                            label="Email"
                            required={true}
                            className={classes.textField}
                            value={this.state.email}
                            onChange={(e)=>{this.setState({email:e.target.value});this.clearValidationErrors()}}
                            error={this.state.emailError.length>0} helperText={this.state.emailError}
                        />
                    </GridItem>

                    <GridItem rows="4" columns="1/3">
                        <TextField
                            type="password"
                            label="Password"
                            required={true}
                            className={classes.textField}
                            value={this.state.password}
                            onChange={(e)=>{this.setState({password:e.target.value});this.clearValidationErrors()}}
                            error={this.state.passwordError.length>0} helperText={this.state.passwordError}
                        />
                    </GridItem>

                    <GridItem rows="5" columns="1/3">
                        <TextField
                            type="password"
                            required={true}
                            label="Confirm Password"
                            className={classes.textField}
                            value={this.state.confirmPassword}
                            onChange={(e)=>{this.setState({confirmPassword:e.target.value});this.clearValidationErrors()}}
                            error={this.state.confirmPasswordError.length>0} helperText={this.state.confirmPasswordError}
                        />
                    </GridItem>

                    <GridItem rows="6" columns="1/3">
                        The first thing we need to do is create an login for you that will be
                        registered as the "Administrator" of this system.
                    </GridItem>

                    <GridItem rows="7" columns="1/3">
                        After you login, you will be able to create accounts for each member of your family, in the User Manager.
                    </GridItem>

                    <GridItem rows="8" columns="1/3" style={{"textAlign":"right"}}>
                        <LoadingButton isLoading={this.state.isLoading}
                                       label={"Create User"}
                                       onClick={this.handleSubmit}/>
                    </GridItem>

                </GridContainer>

            </Paper>
        )
    }
}


export default injectIntl(withStyles(styleSheet)(SignupCard));