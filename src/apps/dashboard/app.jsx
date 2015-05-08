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



var AuthActions = require('./actions/AuthActions');
var NodeActions = require('./actions/NodeActions');
var UserActions = require('./actions/UserActions');
var FileActions = require('./actions/FileActions');

var DirectoryActions = require('./actions/DirectoryActions');
var NavigationActions = require('./actions/NavigationActions');
var UploadActions = require('./actions/UploadActions');

var GetUsersService = require('./services/users/GetUsersService').subscribe(UserActions.getUsers);
var LoginService = require('./services/users/LoginService').subscribe(AuthActions.login);
var NodeCrudService = require('./services/content/NodeCrudService').subscribe(NodeActions.getNode, NodeActions.createNode, NodeActions.updateNode, NodeActions.deleteNode);
var GetFilesService = require('./services/files/GetFilesService').subscribe(FileActions.getFiles);

var ContentStore = require('./stores/ContentStore').init();
var PreferenceStore = require('./stores/PreferenceStore').init();
var DirectoryStore = require('./stores/DirectoryStore').init();
var FileStore = require('./stores/FileStore').init();
var SearchStore = require('./stores/SearchStore').init();
var UploadStore = require('./stores/UploadStore').init();
var UserStore = require('./stores/UserStore').init();


//load compiled jsx
var Home = require('./modules/home/Home');
var LoginView = require('./modules/login/LoginView');
var SignupView = require('./modules/signup/SignupView');
var DashboardView = require('./modules/dashboard/DashboardView');
var FilesView = require('./modules/files/FilesView');
var PhotosView = require('./modules/photos/PhotosView');
var PhotosThumbnail = require('./modules/photos/PhotoThumbnail');
var PhotoDetailView = require('./modules/photoDetails/PhotoDetailsView');
var PhotoEditView = require('./modules/photoEdit/PhotoEditView');
var UploadsView = require('./modules/uploads/UploadsView');



//@Deprecated
var App = React.createClass({
    render: function () {
        return (
            <div className="container-fluid">
                <RouteHandler {...this.props}/>
            </div>
        );
    }
});


var routes = [
    <Route handler={LoginView} path="/">
        <Route name="login" handler={LoginView}/>
        <Route name="signup" handler={LoginView}/>
    </Route>,
    <Route name="dashboard" handler={DashboardView}>
        <DefaultRoute handler={Home}/>
        <Route name="home" handler={Home}/>
        <Route name="files" handler={FilesView}/>
        <Route name="upload" handler={UploadsView}/>
        <Route name="photos" path="photos" handler={PhotosView}/>
        <Route name="photoDetails" path="photos/:id" handler={PhotoDetailView}/>
        <Route name="photoEdit"  path="photos/:id/edit" handler={PhotoEditView}/>
    </Route>
];

//React.renderComponent(routes, document.body);
//Router.run(routes, Router.HistoryLocation, function (Handler, state) {
Router.run(routes, function (Handler, state) {
    var params = state.params;
    React.render(<Handler params={state.params} query={state.query}/>, document.body);
});

