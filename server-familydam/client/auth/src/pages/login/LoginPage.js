/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";
import { takeWhile } from 'rxjs/operators';

import Clock from '../../components/clock/Clock';
import CircularProgress from '@material-ui/core/CircularProgress';

import LoginCards from '../../components/logincards/LoginCards';
import SignupCard from '../../components/signupcard/SignupCard';

import AppActions from '../../library/actions/AppActions';
import LoginService from "../../services/LoginService";
import GetAllUsersService from "../../library/actions/processors/GetAllUsersService.js";


const styleSheet = (theme) => ({
    wrapper:{

    },

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
        right:    '40px',
        width:    '280px'
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%'
    }
});

class Login extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isLoading:true,
            users: undefined,
            activeUser: undefined,
            offlineImage: "/images/hex-grid-blue_tran.jpg",
            backgrounds: [
                "/images/AS6_9771-180__.jpg"
                , "/images/lake-marina_GkuzZvKu__.jpg"
                , "/images/DSC_5803-777__.jpg"
                , "/images/pebble-stack_XJX4rE__.jpg"
                , "/images/fire-texture-15_GyOwSEFd__.jpg"
                , "/images/lake_GyXLZDKu__.jpg"
            ]
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleCancelCardSelection = this.handleCancelCardSelection.bind(this);
        this.handleCardSelection = this.handleCardSelection.bind(this);
    }


    componentWillMount(){
        this.setState({"mounted":true});

        //takeWhile(() => this.state.mounted).
        GetAllUsersService.isLoading.subscribe(data => {
            this.setState({"isLoading": data});
        });

        //
        GetAllUsersService.sink.takeWhile(() => this.state.mounted).subscribe(users_ => {
            this.setState({"users": users_});
        });

        //force a logout on page load
        AppActions.logout.source.next(true);
        //load all users
        GetAllUsersService.source.next(true);
    }

    componentWillUnmount() {
        this.setState({"mounted":false});
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
        LoginService.source.next({'username':username_, 'password':password_});

        LoginService.sink.subscribe((data)=>{
            console.log("LoginService.sink: SUCCESS");
            console.dir(data);
        }, (err)=>{
            console.log("LoginService.sink: ERROR");
            console.dir(err);
            window.alert(err.message);
        });
    }

    randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    render() {
        const classes = this.props.classes;
        const randomBackground =  this.state.backgrounds[this.randomIntFromInterval(0,this.state.backgrounds.length)];

        if( this.state.isLoading ){
            return (
                <div className={classes.loginView}>
                    <CircularProgress className={classes.progress} size={50}/>
                </div>
            );
        }else {
            return (
                <div className={classes.loginView} style={{background: "url('" + this.state.offlineImage + "') no-repeat"}}>
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
                </div>
            );
        }
    }
}


export default injectIntl(withStyles(styleSheet)(Login));