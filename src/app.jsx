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



var jQuery = require('jquery');
var React = require('react');
var Intl  = require('react-intl');
var ReactDOM = require('react-dom');


// React-Router
import { Router,Route,Link,IndexRoute,useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'

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
var UserManagerView = require('./modules/userManager/UserManagerView.jsx');
var UserManagerHomeView = require('./modules/userManager/UserManagerHome.jsx');
var UserManagerDetailsView = require('./modules/userManager/UserManagerDetails.jsx');

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });


ReactDOM.render(
        <Router history={appHistory}>
            <Route path="/"  component={LoginView}/>
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


                <Route path="/users" component={UserManagerView}>
                    <IndexRoute component={UserManagerHomeView}/>
                    <Route path="users/:id" component={UserManagerDetailsView}/>
                </Route>
            </Route>
        </Router>
    , document.getElementById("appBody")
);

//var SignupView = require('./modules/signup/SignupView');

