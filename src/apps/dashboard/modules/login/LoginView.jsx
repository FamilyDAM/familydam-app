/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var LoginView = React.createClass({

    render: function() {

        return (

            <div className="loginView center row">
                <div className="row">
                    <div className="large-6 columns auth-plain">
                        <div className="signup-panel left-solid">
                            <p className="welcome">Registered Users</p>
                            <form>
                                <div className="row collapse">
                                    <div className="small-2  columns">
                                        <span className="prefix"><i className="fi-torso-female"></i></span>
                                    </div>
                                    <div className="small-10 columns">
                                        <input type="text" placeholder="email"/>
                                    </div>
                                </div>
                                <div className="row collapse">
                                    <div className="small-2 columns ">
                                        <span className="prefix"><i className="fi-lock"></i></span>
                                    </div>
                                    <div className="small-10 columns ">
                                        <input type="text" placeholder="password"/>
                                    </div>
                                </div>
                            </form>
                            <a href="#" className="button">Log In</a>
                        </div>
                    </div>

                    <div className="large-6 columns auth-plain">
                        <div className="signup-panel newusers">
                            <p className="welcome">New User</p>
                            <p>By creating an account with us, you will be able to move through the checkout process faster, view and track your orders, and more.</p><br>
                            <Link to="signup" className="button">Sign Up</Link>
                            </br>
                        </div>
                    </div>
                </div>
            </div>

        );

    }
});

module.exports = LoginView;
