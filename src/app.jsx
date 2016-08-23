/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

// Material-ui
import injectTapEventPlugin from 'react-tap-event-plugin';
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// React
import React from 'react';
var ReactDOM = require('react-dom');
window.React = React;
import {IntlProvider, addLocaleData, injectIntl} from 'react-intl';

// React-Router
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

//app actions
var ConfigActions = require('./actions/ConfigActions');

//app views
var MainView = require("./modules/main/MainView");
var WelcomeView = require("./modules/welcome/WelcomeView");
var StorageView = require("./modules/storage/StorageView");
//var RegisterView = require("./modules/register/RegisterView");

//app stores
var SettingsStore = require('./stores/SettingsStore');
SettingsStore.subscribe();


ReactDOM.render(<div>loading...</div>, document.getElementById("appBody"));


SettingsStore.locale.subscribe(function (locale_) {
    var i18n;
    if (locale_ === "es-ES")
    {
        i18n = require("./locales/es-ES");
    } else if (locale_ === "zh-CN")
    {
        i18n = require("./locales/zh-CN");
    } else
    {
        i18n = require("./locales/en-us");
    }

    ReactDOM.render(
        <IntlProvider locale={i18n.locales[0]} messages={i18n.messages}>
            <Router history={appHistory}>
                <Route path="/"  component={MainView}>
                    <IndexRoute component={WelcomeView}/>
                    <Route path="welcome" component={WelcomeView}/>
                    <Route path="storage" component={StorageView}/>
                </Route>
            </Router>
        </IntlProvider>
        , document.getElementById("appBody"));


});
        //<Handler params={state.params} query={state.query} {...i18n} />
    //this.localSubscription.dispose();

