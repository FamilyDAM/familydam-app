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

// register the different Actions
var ConfigActions = require('./actions/ConfigActions');

//load compiled jsx views
var Config = require('./modules/config/Config');
var intlData = require("./locales/en-us");

var routes = [
    <Route handler={ConfigView} path="/">
        <Route name="config" handler={ConfigView}/>
    </Route>
];

//React.renderComponent(routes, document.body);
//Router.run(routes, Router.HistoryLocation, function (Handler, state) {
Router.run(routes, function (Handler, state) {
    var params = state.params;
    React.render(
        <Handler params={state.params} query={state.query} {...intlData} />
    , document.body);
});

