import React, {Component} from 'react';
//import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {withStyles} from '@material-ui/core/styles';

//views
import LoginPage from './pages/login/LoginPage';



const styleSheet = (theme) => ({
   //todo
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
        this.setState({"mounted":true});
    }

    componentWillUnmount(){
        this.setState({"mounted":false});
    }


    render() {
        //const classes = this.props.classes;
        const locale = "en-EN";

        return (
            <IntlProvider locale={locale} key={locale} messages={this.props.i18nMessages[locale]}>
                <LoginPage mode="login"/>
            </IntlProvider>
        );
    }

}

export default withStyles(styleSheet)(App);