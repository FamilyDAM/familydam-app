/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import Clock from '../../components/clock/Clock';
import CircularProgress from '@material-ui/core/CircularProgress';

import LoginCards from '../../components/logincards/LoginCards';
import SignupCard from '../../components/signupcard/SignupCard';

import UserActions from '../../actions/UserActions';
import {AppActions} from '@FamilyDAM/lib-client';


const styleSheet = (theme) => ({
    loginView: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,

        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundSize: 'cover !important',
        backgroundRepeat: 'no-repeat !important',

    },
    timeClock: {
        position: 'absolute',
        bottom:   '20px',
        left:     '40px',
        width:    '100%'
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
});

class Login extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            users: undefined,
            activeUser: undefined,
            backgrounds: [
                "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933080/graphicstock/AS6_9771-180__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933187/graphicstock/lake-marina_GkuzZvKu__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933186/graphicstock/DSC_5803-777__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933181/graphicstock/pebble-stack_XJX4rE__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933172/graphicstock/fire-texture-15_GyOwSEFd__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933171/graphicstock/lake_GyXLZDKu__.jpg"
            ]
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleCancelCardSelection = this.handleCancelCardSelection.bind(this);
        this.handleCardSelection = this.handleCardSelection.bind(this);
    }

    componentWillMount(){
        this.setState({"isMounted":true, "isLoading": true});
        UserActions.getAllUsers.sink.takeWhile(() => this.state.isMounted).subscribe(users_ => {
            if (users_) {
                this.setState({"isLoading": false, "users": users_});
            }
        });

        AppActions.logout.source.next(true);
        UserActions.getAllUsers.source.next(true);
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }


    handleCardSelection(user) {
        this.setState({activeUser: user});
    }


    handleCancelCardSelection(event) {
        this.setState({activeUser: undefined});
    }


    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleLogin(username_, password_)
    {
        UserActions.login.source.next({'username':username_, 'password':password_});

        UserActions.login.sink.subscribe((data)=>{
            console.log("UserActions.login.sink: SUCCESS");
            console.dir(data);
        }, (err)=>{
            console.log("UserActions.login.sink: ERROR");
            console.dir(err);
            window.alert(err.message);
        });
    }


    render() {
        var classes = this.props.classes;
        var randomBackground = this.state.backgrounds[0];

        if( this.state.isLoading ){
            return (
                <div>
                    <CircularProgress className={classes.progress} size={50}/>
                </div>
            );
        }else {
            return (
                <div className={classes.loginView} style={{background: "url('" + randomBackground + "') no-repeat"}}>

                    {(!this.state.users || this.state.users.length === 0) ?
                        <SignupCard/>
                        :
                        <LoginCards
                            users={this.state.users}
                            onLogin={this.handleLogin}/>
                    }

                    <div className={classes.timeClock}>
                        <Clock/>
                    </div>
                </div>
            );
        }
    }
}


export default injectIntl(withStyles(styleSheet)(Login));