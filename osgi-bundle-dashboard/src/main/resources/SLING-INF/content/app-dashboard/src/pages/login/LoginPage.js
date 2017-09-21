/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import Clock from '../../components/clock/Clock';

import LoginCard from '../../components/logincard/LoginCard';
import SignupCard from '../../components/signupcard/SignupCard';


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
    }
});

class Login extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
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
    }


    componentDidMount() {
        /**
        var _this = this;

        AuthActions.logout.onNext(true);
        UserActions.getUsers.source.onNext(true);

        this.usersSubscription = UserStore.users.subscribe(function (results) {
            _this.state.users = results;
            if (_this.isMounted())  _this.forceUpdate();
        });
         **/
    }

    componentWillUnmount() {
        if (this.usersSubscription !== undefined){
            //this.usersSubscription.dispose();
        }
    }


    handleCardSelection(user) {
        this.setState({activeUser: user});
    }


    handleCancelCardSelection(event) {
        this.setState({activeUser: undefined});
    }


    render() {
        var classes = this.props.classes;
        var randomBackground = this.state.backgrounds[0];

        return (
            <div className={classes.loginView} style={{background: "url('" + randomBackground + "') no-repeat"}}>

                {(!this.state.users || this.state.users.length===0)? <SignupCard/> : <LoginCard/> }

                <div className={classes.timeClock}>
                    <Clock/>
                </div>
            </div>
        );
    }
}


export default injectIntl(withStyles(styleSheet)(Login));