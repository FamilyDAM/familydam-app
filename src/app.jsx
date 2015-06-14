/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

var React = require('react');
var ReactIntl  = require('react-intl');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var intlEnUs = require("./locales/en-us");
var MainView = require("./modules/main/MainView");
var WelcomeView = require("./modules/welcome/WelcomeView");
var StorageView = require("./modules/storage/StorageView");
var AccountsView = require("./modules/accounts/AccountsView");
var RegisterView = require("./modules/register/RegisterView");

var routes = [
    <Route name="main" handler={MainView} path="/">
        <DefaultRoute handler={WelcomeView}/>
        <Route name="welcome" handler={WelcomeView}/>
        <Route name="register" handler={RegisterView}/>
        <Route name="storage" handler={StorageView}/>
        <Route name="accounts" handler={AccountsView}/>
    </Route>
];


//React.renderComponent(routes, document.body);
//Router.run(routes, Router.HistoryLocation, function (Handler, state) {
Router.run(routes, function (Handler, state) {
    console.log("run");
    var params = state.params;
    React.render(
        <Handler params={state.params} query={state.query} {...intlEnUs} />
    , document.body);
});
