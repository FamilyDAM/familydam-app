import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

//views
import DashboardPage from './pages/dashboard/DashboardPage';
import GetUserService from "./library/services/GetUserService";


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing(2)}px`,
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
            "isMounted": true,
            "isAuthenticated": false
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

        GetUserService.sink.takeWhile(() => this.state.isMounted).subscribe((user_)=>{
            // redirect to dashboard
            //console.dir(user_);
            if( user_ )
            {
                this.setState({"user": user_});
            }else{
                window.location = "/index.html";
            }
        });

        GetUserService.source.next(null)
    }


    componentWillUnmount(){
        this.setState({"isMounted":false});
    }


    render() {
        const classes = this.props.classes;
        const locale = "en-EN";


        if (!this.state.user) {
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
                        <Route path="/*" component={() => <DashboardPage user={this.state.user}/>}/>
                    </Switch>
                </Router>
            </IntlProvider>
        );

    }

}

export default withStyles(styleSheet)(App);