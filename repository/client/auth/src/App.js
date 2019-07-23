import React, {Component} from 'react';
//import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

//views
import LoginPage from './pages/login/LoginPage';

import AppActions from './library/actions/AppActions';
import UserActions from './library/actions/UserActions';


const styleSheet = (theme) => ({
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


class App extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            "context": context,
            "locale": "en-EN",
            "isLoading": false,
            "isMounted": true,
        };


        // set it running locally with npm start, so you can still call running server
        /*
        if( window.location.href.indexOf(":3000") > -1){
            AppSettings.baseHost.next("http://localhost:9000");
            AppSettings.basicUser.next("Mike");
            AppSettings.basicPwd.next("admin");
            UserActions.getUser.sink.next( {"user":{"firstName":"","lastName":""}} );
        }*/
    }


    componentDidMount(){
        this.setState({"isMounted":true});
    }


    componentWillUnmount(){
        this.setState({"isMounted":false});
    }


    render() {
        const classes = this.props.classes;
        const locale = "en-EN";


        return (
            <IntlProvider locale={locale} key={locale} messages={this.props.i18nMessages[locale]}>
                <LoginPage mode="login"/>
            </IntlProvider>
        );

    }

}

export default withStyles(styleSheet)(App);