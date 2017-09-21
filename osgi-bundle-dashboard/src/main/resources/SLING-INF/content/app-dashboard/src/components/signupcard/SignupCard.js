/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import {withStyles} from "material-ui/styles";

import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';

import AppActions from '../../actions/AppActions';

const styleSheet = (theme) => ({
    loginCardForm:{
        padding: '20px',
        width: '100%',
        backgroundColor: '#ffffff'
    },
    textField:{
        'width':'100%'
    }
});



class SignupCard extends Component {

    constructor(props, context){
        super(props);

        this.state = {
            isLoading: false,
            user: {
                "firstName":"",
                "lastName":"",
                "email":"",
                "password":"",
                "confirmPassword":""
            }
        };
    }


    componentWillUnMount(){
        if( this.createUserSubscription !== undefined ){
            //this.createUserSubscription.dispose();
        }
    }


    componentDidMount(){
        /**
        $(".loginCardForm").bind('keypress',(e)=>{
            if(e.keyCode === 13) {
                this.handleSubmit(e);
                //put button.click() here
            }
        });
         **/
    }

    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleSubmit(event)
    {
        AppActions.navigateTo.next('://app-photos/index.html');
        /**
         this.setState({isLoading:true});


        var _user = {};
        _user.username = this.refs.firstName.input.value.toLowerCase();
        _user.password = this.refs.password.input.value;
        _user.isFamilyAdmin = true;
        _user.userProps = {};
        _user.userProps.firstName = this.refs.firstName.input.value;
        _user.userProps.lastName = this.refs.lastName.input.value;
        _user.userProps.email = this.refs.email.input.value;


        UserActions.createUser.source.onNext(_user);

        this.createUserSubscription = UserActions.createUser.sink.subscribe(function(data_){
            //load all the users (with our new user)
            this.setState({isLoading:false});
            UserActions.getUsers.source.onNext(true);
        }.bind(this), function(error_){
            alert( error_ );
        }.bind(this));
         **/
    }


    render() {
        var classes = this.props.classes;
        var overrideStyle = {'maxWidth':'600px'};


        return (
            <div className={classes.loginCardForm} style={overrideStyle}>
                <div className="loginCardForm center-block container-fluid" >
                    <div className="row">
                        <div className="col-xs-12 col-md-7">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h2><FormattedMessage id="SignupCard.label" defaultMessage="Create First User"/></h2><hr/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <TextField
                                            id="firstName"
                                            label="First Name"
                                            className={classes.textField}
                                        />
                                    </div>
                                    <div className="col-xs-6">
                                        <TextField
                                            id="lastName"
                                            label="Last Name"
                                            className={classes.textField}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField
                                            id="email"
                                            label="Email"
                                            className={classes.textField}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField
                                            id="password"
                                            type="password"
                                            label="Password"
                                            className={classes.textField}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField
                                            id="confirmPassword"
                                            type="password"
                                            label="Confirm Password"
                                            className={classes.textField}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-5">
                            <p className="center-block" style={{'padding':'20px 0px 20px 0px'}}>
                               The first thing we need to do is create an login for you that will be
                                registered as the 'Administrator' of this system.
                            </p>
                            <p className="center-block" >
                                After you login, you will be able to create accounts for each member of your family, in the User Manager.
                            </p>
                        </div>
                    </div>



                    <div className="row">
                        <div className="col-sm-12" style={{'textAlign':'right'}}>
                            <Button
                                raised
                                color="accent"
                                onClick={this.handleSubmit}>
                                <CircularProgress className={classes.progress} color="#fff" size={25} />
                                <Typography style={{'paddingLeft':'8px', color:'#fff'}}>Create User</Typography>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


export default injectIntl(withStyles(styleSheet)(SignupCard));