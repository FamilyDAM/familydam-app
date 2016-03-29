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
var ReactDOM = require('react-dom');
var RouterContext = React.RouteContext;
var Route = Router.Route;
var Router = Router.Router;


// register the different Actions
var actions = require('./actions/_actions').subscribe();

// Initialize the stores
var stores = require('./stores/_stores').subscribe();

// register the different services
var services = require('./services/_services').subscribe();


//load compiled jsx views
var LoginView = require('./modules/login/LoginView.jsx');
var DashboardView = require('./modules/dashboard/DashboardView.jsx');
var Home = require('./modules/home/Home.jsx');
var FilesView = require('./modules/files/FilesView.jsx');
var UploadsView = require('./modules/uploads/UploadsView.jsx');
var PhotosView = require('./modules/photos/PhotosView.jsx');
var PhotoDetailView = require('./modules/photoDetails/PhotoDetailsView.jsx');
var PhotoEditView = require('./modules/photoEdit/PhotoEditView.jsx');
//var PhotosThumbnail = require('./modules/photos/PhotoThumbnail');
var UserManagerView = require('./modules/userManager/UserManagerView.jsx');
var UserManagerHomeView = require('./modules/userManager/UserManagerHome.jsx');
var UserManagerDetailsView = require('./modules/userManager/UserManagerDetails.jsx');
//var SignupView = require('./modules/signup/SignupView');

/**
var routes = [
    <Route path="/" component={LoginView} >
        <Route path="/login" component={LoginView}/>
    </Route>,
    <Route path="/dashboard" component={DashboardView}>
        <Route path="*" component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/files" component={FilesView}/>
        <Route path="/upload" component={UploadsView}/>
        <Route path="/photos" component={PhotosView}/>
        <Route path="/photos/:id" component={PhotoDetailView}/>
        <Route path="/userManager" component={UserManagerView}>
            <Route path="/"  component={UserManagerHomeView}/>
            <Route path="/:id"  component={UserManagerDetailsView}/>
        </Route>
    </Route>
];

 Router.run(routes, function (Handler, state) {

    var params = state.params;
    React.render(
        <Handler params={state.params} query={state.query} {...intlData} />
    , document.body);
});
 **/
ReactDOM.render(


    <Router history={Router.History}>
        <Route path="/" component={LoginView} />
        <Route path="login" component={LoginView} />
        <Route path="logout" component={LoginView} />
        <Route component={DashboardView}>
            <Route path="dashboard" component={Home}/>
            <Route path="files" component={FilesView}/>


            <Route path="music" component={FilesView}/>
            <Route path="movies" component={FilesView}/>
            <Route path="web" component={FilesView}/>
            <Route path="email" component={FilesView}/>
            <Route path="upload" component={UploadsView}/>


            <Route path="photos" component={PhotosView}/>
            <Route path="photos/details" component={PhotoDetailView}/>
            <Route path="photos/edit" component={PhotoEditView}/>


            <Route component={UserManagerView}>
                <Route path="users" component={UserManagerHomeView}/>
                <Route path="users/:id" component={UserManagerDetailsView}/>
            </Route>
        </Route>
    </Router>
    , document.getElementById("appBody")
);