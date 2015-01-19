/** @jsx React.DOM */
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();
var React = require('react');
var Reflux = require('reflux');

var Router = require('react-router');
var Route = Router.Route;
var Navigation = Router.Navigation;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
window.Reflux = Reflux;
window.Route = Route;
window.Navigation = Navigation;

//load simple js files
require('./stores/actions');
require('./stores/store');
//load compiled jsx
var LoginView = require('./modules/login/LoginView');
var SignupView = require('./modules/signup/SignupView');
var DashboardView = require('./modules/dashboard/DashboardView');
var FilesView = require('./modules/files/FilesView');
var PhotosView = require('./modules/photos/PhotosView');
var PhotoDetailView = require('./modules/photoDetails/PhotoDetailsView');
var PhotoEditView = require('./modules/photoEdit/PhotoEditView');
var UploadsView = require('./modules/uploads/UploadsView');

var App = React.createClass({
    render: function () {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2">FamilyD.A.M.</div>
                    <ul className="col-sm-10">
                        <li><Link to="login">Login</Link></li>
                        <li><Link to="dashboard">Signup</Link></li>
                    </ul>
                </div>

                <RouteHandler {...this.props}/>
            </div>
        );
    }
});
//<RouteHandler {...this.props}/>

var routes = [
    <Route handler={LoginView} path="/">
        <Route name="login" handler={LoginView}/>
        <Route name="signup" handler={LoginView}/>
    </Route>,
    <Route name="dashboard" handler={DashboardView}>
        <Route name="files" handler={FilesView}/>
        <Route name="upload" handler={UploadsView}/>
        <Route name="photos" path="photos" handler={PhotosView}/>
        <Route name="photoDetails" path="photos/:photoId" handler={PhotoDetailView}/>
        <Route name="photoEdit"  path="photos/:photoId/edit" handler={PhotoEditView}/>
    </Route>
];

//React.renderComponent(routes, document.body);
//Router.run(routes, Router.HistoryLocation, function (Handler, state) {
Router.run(routes, function (Handler, state) {
    var params = state.params;
    React.render(<Handler params={params}/>, document.body);
});

