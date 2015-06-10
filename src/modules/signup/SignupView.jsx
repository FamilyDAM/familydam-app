/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');

var SignupView = React.createClass({
    propTypes: {
        state: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            state: 'signup'
        };
    },

    statics: {

        // example, does nothing.
        willTransitionTo: function (transition, params) {
            if (false)
            {//!auth.isLoggedIn()) {
                //transition.abort();
                transition.redirect("login", params);
                //auth.logIn({transition: transition});
                // in auth module call `transition.retry()` after being logged in
            }
        }
    },

    render: function() {

        return (

            <div className="signupView center row">
                <div className="row">
                    <div className="large-6 columns auth-plain">
                        <div className="signup-panel left-solid">
                            <p className="welcome">New User</p>
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
                                <div className="row collapse">
                                    <div className="small-2 columns ">
                                        <span className="prefix"><i className="fi-lock"></i></span>
                                    </div>
                                    <div className="small-10 columns ">
                                        <input type="text" placeholder="confirm password"/>
                                    </div>
                                </div>
                            </form>
                            <a href="#" className="button ">Sign Up</a>
                        </div>
                    </div>
                    <div className="large-6 columns auth-plain">
                        <div className="signup-panel newusers">
                            <p className="welcome">New User</p>
                            <p>Welcome to this new site, full of wonderful and amazing things.</p><br>
                        </br>
                        </div>
                    </div>
                </div>
            </div>

        );

    }
});


module.exports = SignupView;
