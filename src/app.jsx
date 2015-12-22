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
var Navigation = Router.Navigation;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
window.Route = Route;
window.Navigation = Navigation;


// register the different Actions
var actions = require('./actions/_actions').subscribe();

// Initialize the stores
var stores = require('./stores/_stores').subscribe();

// register the different services
var services = require('./services/_services').subscribe();



//load compiled jsx views
var Home = require('./modules/home/Home');
var LoginView = require('./modules/login/LoginView');
var SignupView = require('./modules/signup/SignupView');
var DashboardView = require('./modules/dashboard/DashboardView');
var FilesView = require('./modules/files/FilesView');
var PhotosView = require('./modules/photos/PhotosView');
var PhotosThumbnail = require('./modules/photos/PhotoThumbnail');
var PhotoDetailView = require('./modules/photoDetails/PhotoDetailsView');
var UploadsView = require('./modules/uploads/UploadsView');
var UserManagerView = require('./modules/userManager/UserManagerView');
var UserManagerHomeView = require('./modules/userManager/UserManagerHome');
var UserManagerDetailsView = require('./modules/userManager/UserManagerDetails');
var intlData = require("./locales/en-us");

var routes = [
    <Route handler={LoginView} path="/">
        <Route name="login" handler={LoginView}/>
    </Route>,
    <Route name="dashboard" handler={DashboardView}>
        <DefaultRoute handler={Home}/>
        <Route name="home" handler={Home}/>
        <Route name="files" handler={FilesView}/>
        <Route name="upload" handler={UploadsView}/>
        <Route name="photos" path="photos" handler={PhotosView}/>
        <Route name="photoDetails" path="photos/:id" handler={PhotoDetailView}/>
        <Route name="userManagerShell" handler={UserManagerView}>
            <Route name="userManager"  handler={UserManagerHomeView}/>
            <Route name="userManagerDetails" path="userManager/:id"  handler={UserManagerDetailsView}/>
        </Route>
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

