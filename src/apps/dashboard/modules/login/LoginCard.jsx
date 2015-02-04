/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Navigation = require('react-router').Navigation;

var UserStore = require('./../../stores/UserStore');

var LoginCard = React.createClass({

    mixins : [Navigation],

    propTypes: {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        user: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            user: {
                "firstName":"",
                "lastName":"",
                "email":""
            },
            mode: "inactive"
        };
    },



    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleSubmit: function(event)
    {
        var _this = this;
        //todo: remove hard coded login and use form values
        var stream = UserStore.login("admin", "admin").subscribe(function(authenticatedUser_){
            // cache the user in a global store
            UserStore.setUser(authenticatedUser_);

            // redirect to dashboard
            _this.transitionTo("dashboard");
        });
    },

    /**
     * Select an inactive user
     * @param event
     */
    handleSelect: function(event){
        //event.target = this.getDOMNode();
        this.props.onSelect(this.props.user);
    },

    /**
     * cancel active user
     * @param event
     */
    handleCancel: function(event){
        this.props.onCancel(this.props.user);
    },



    render: function() {

        var overrideStyle = {};

        var activeView;
        if (this.props.mode !== "active") {
            activeView = <div
                            className="loginCard panel"
                            onClick={this.handleSelect}>
                            <div className="box">&nbsp;</div>
                            <h2>{this.props.user.firstName}</h2>
                        </div>;
        } else {
            overrideStyle = {width:"100%"};

            activeView= <div className="loginCardForm container-fluid">
                            <div className="row">
                                <div className="loginCard  col-sm-4">
                                    <div className="box">&nbsp;</div>
                                    <h2>{this.props.user.firstName}</h2>
                                </div>
                                <div className="loginForm col-sm-8" >
                                    <h3>{this.props.user.username}</h3>
                                    <div>
                                        <input type="password" label="Password"/>
                                    </div>
                                    <div>
                                        <button className="btn btn-default btn-link" onClick={this.handleCancel}>cancel</button>
                                        <button className="btn btn-primary" onClick={this.handleSubmit}>Login</button>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </div>;
        }

        return (
            <div style={overrideStyle}>{activeView}</div>
        )
    }

});



module.exports = LoginCard;
