
import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider, FormattedMessage} from 'react-intl';

import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Select from 'material-ui/Select';
import {FormControl} from 'material-ui/Form';
import {InputLabel} from 'material-ui/Input';
import {MenuItem} from 'material-ui/Menu';

//views
import StorageLocationPage from './pages/StorageLocationPage';


const styleSheet = (theme) => ({
    appGrid:{
        height:'100%',
        display: "grid",
        gridGap: "16px",
        gridTemplateRows: "64px 1fr 48px",
        gridTemplateColumns: "minmax(150px, 200px) 1fr",
    },
    header:{
        gridColumn: "1/3",
        gridRow: "1"
    },
    menuColumn:{
        gridColumn: "1/2",
        gridRow: "2",
        padding: "8px",
        marginTop: theme.spacing.unit * 2,
    },
    mainColumn:{
        gridColumn: "2/3",
        gridRow: "2",
        paddingLeft: "16px",
        paddingRight: "16px",
        marginTop: theme.spacing.unit * 3
    },
    footer:{
        gridColumn: "2/3",
        gridRow: "3",
        textAlign:'right',
        paddingRight:'16px'
    },
    formControl:{
        textAlign:'right',
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class App extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            "context": context,
            "locale": "en-EN",
            "isValid": false,
            "isMounted": true
        };

        this.handleStorageChange = this.handleStorageChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.validateConfig = this.validateConfig.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }


    componentWillMount(){
        this.setState({"isMounted":true});

        /**
        UserActions.getUser.sink.takeWhile(() => this.state.isMounted).subscribe((user_)=>{
            // redirect to dashboard
            if( user_ ) {
                this.setState({"isAuthenticated":true, "user": user_});
            }
        });
         **/
    }


    componentWillUnmount(){
        this.setState({"isMounted":false});
    }

    handleStorageChange(path_){
        console.log("handleStorageChange=" +path_);
        this.storagePath = path_;
    }

    handleLanguageChange(e){
        this.setState({locale: e.target.value});
    }

    handleSave(){
        var isValid = this.validateConfig();

        if( !isValid ) {
            alert("We still need a storage path");
        }else{
            var settings = {};
            settings.version = "0.2.0";
            settings.jreVersion = "jre1.8.0_144.jre";
            settings.license = "";
            settings.state = "READY";
            settings.host = "localhost";
            settings.port = "9000";
            settings.defaultLocale = this.state.locale;
            settings.storageLocation = this.storagePath;

            var _json = JSON.stringify(settings);
            var result = window.require("electron").ipcRenderer.sendSync('saveConfig', _json );
            console.log("{Save} RESULT=" +result);
        }
    }



    validateConfig(){
        if(this.storagePath && this.storagePath !== "" ){
            //console.log("isValid");
            return true;
        }else{
            //console.log("is NOT Valid");
           return false;
        }
    }



    render() {
        const classes = this.props.classes;
        const locale = this.state.locale;

        return (
            <IntlProvider locale={locale} key={locale} messages={this.props.i18nMessages[locale]}>
                <div style={{width:'100%', height:'100%'}}>
                    <div className={classes.appGrid}>
                        <div className={classes.header}>
                            <AppBar position="static" color="default">
                                <Toolbar>
                                    <Typography type="title" style={{'flex':'1'}}>
                                        <FormattedMessage
                                            id="app.title"
                                            defaultMessage="Configuration Wizard"
                                        />
                                    </Typography>

                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="lang-select"><FormattedMessage
                                                id="app.label.language"
                                                defaultMessage="Language"
                                            /></InputLabel>
                                        <Select
                                            id={"lang-select"} name={"lang-select"}
                                            value={this.state.locale}
                                            onChange={this.handleLanguageChange}>
                                            <MenuItem value={"zh-CN"}><FormattedMessage
                                                id="app.language.chinese"
                                                defaultMessage="Chinese"
                                            /></MenuItem>
                                            <MenuItem value={"en-EN"}><FormattedMessage
                                                id="app.language.english"
                                                defaultMessage="English"
                                            /></MenuItem>
                                            <MenuItem value={"de-DE"}><FormattedMessage
                                                id="app.language.german"
                                                defaultMessage="German"
                                            /></MenuItem>
                                        </Select>
                                    </FormControl>
                                </Toolbar>
                            </AppBar>
                        </div>
                        <div className={classes.menuColumn}>
                            <ul style={{listStyle:'none'}}>
                                <li>
                                    <FormattedMessage
                                        id="app.menu.storage"
                                        defaultMessage="Storage"
                                    />
                                </li>
                            </ul>

                        </div>
                        <div className={classes.mainColumn}>
                            <Router>
                                <Switch>
                                    <Route path="/" component={() =>
                                        <StorageLocationPage
                                            onLocationChange={this.handleStorageChange}/>}/>
                                </Switch>
                            </Router>
                        </div>

                        <div className={classes.footer}>

                            <Button raised color="primary" onClick={this.handleSave} >
                                <FormattedMessage
                                    id="saveBtn"
                                    defaultMessage="Save"
                                    onClick={this.handleSave}
                                /></Button>

                        </div>
                    </div>
                </div>
            </IntlProvider>
        );

    }

}

export default withStyles(styleSheet)(App);