import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {withStyles} from '@material-ui/core/styles';

//views
import HomePage from './pages/home/HomePage';

import UserActions from './library/actions/UserActions';


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
            "isAuthenticated": false,
            "isLoading": false,
            "isMounted": true
        };

    }


    componentWillMount(){
        this.setState({"isMounted":true});

        UserActions.getUser.sink.takeWhile(() => this.state.isMounted).subscribe((user_)=>{
            // redirect to dashboard
            //console.dir(user_);
            //console.log("UserActions.getUser.sink");
            if( user_ )
            {
                this.setState({"user": user_});
            }else{
                window.location = "/index.html";
            }
        });

        UserActions.getUser.source.next(null)
    }


    componentWillUnmount(){
        this.setState({"isMounted":false});
    }


    render() {
        //const classes = this.props.classes;
        const locale = "en-EN";


        return (
            <IntlProvider locale={locale} key={locale} messages={this.props.i18nMessages[locale]}>
                <Router>
                    <Switch>
                        <Route path="/" component={() => <HomePage user={this.state.user}/>}/>
                    </Switch>
                </Router>
            </IntlProvider>
        );

    }

}

export default withStyles(styleSheet)(App);