/** @jsx React.DOM */
var React = require('react');
var Reflux = require('reflux');

var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
window.Reflux = Reflux;

//load simple js files
require('../src/stores/actions');
require('../src/stores/store');
//load compiled jsx
var LoginView = require('./modules/login/LoginView');
var SignupView = require('./modules/signup/SignupView');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <div>
                    <ul>
                        <li><Link to="login">Login</Link></li>
                        <li><Link to="signup">Signup</Link></li>
                    </ul>
                    User Login Test!
                </div>

                <RouteHandler {...this.props}/>
            </div>
        );
    }
});
//<RouteHandler {...this.props}/>

var routes = (
    <Route handler={App} path="/FamilyWish/react-client/index.html">
        <Route name="login" handler={LoginView}/>
        <Route name="signup" handler={SignupView} />
    </Route>
);

//React.renderComponent(routes, document.body);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
    var params = state.params;
    React.render(<Handler params={params}/>, document.body);
});

