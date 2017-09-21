import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {withStyles} from 'material-ui/styles';
import {CircularProgress} from 'material-ui/Progress';

//views
import LoginPage from './pages/login/LoginPage';

import AppActions from './actions/AppActions';


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
            "isAuthenticated": false,
            "isLoading": false
        };

        AppActions.navigateTo.subscribe((path) => {
            if (path.substring(0, 3) === "://") {
                window.location.href = path.substring(2);
            }else{
                window.location.href = path;
            }
        });
    }


    render() {
        const classes = this.props.classes;
        const locale = "en-EN";


        if (this.state.isLoading) {
            return (
                <div>
                    <CircularProgress className={classes.progress} size={50}/>
                </div>
            );
        }


        return (
            <IntlProvider locale={locale} key={locale} messages={this.props.i18nMessages[locale]}>
                <Router>
                    <Switch>
                        <Route path="/login" component={() => <LoginPage mode="login"/>}/>
                        <Route path="/signup" component={() => <LoginPage mode="signup"/>}/>
                        <Route path="/" component={() => this.state.isAuthenticated ? <LoginPage user={this.state.user}/> : <LoginPage mode="login"/>}/>
                    </Switch>
                </Router>
            </IntlProvider>
        );

    }

}

export default withStyles(styleSheet)(App);