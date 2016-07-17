/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
import React, {PropTypes} from 'react';
import {FormattedMessage, FormattedPlural,FormattedDate} from 'react-intl';
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;


module.exports = React.createClass({

    componentWillMount: function () {
        var _this = this;
    },

    componentDidMount: function () {
        //console.log("Main View");
        // initialize the material view code
        $.material.init();
    },



    render: function() {
        return (
            <div className="container-fluid">
                <div className="row header">
                    <div className="col-xs-12">
                        <h3>FamilyD.A.M.
                            <FormattedMessage
                                id="title"
                                defaultMessage="Setup Wizard"
                                description='Setup wizard title'
                            /></h3>
                    </div>
                </div>

                <div className="row main">
                    <aside >
                        <ul>
                            <li><Link to="welcome">
                                <FormattedMessage
                                    id="nav.welcome"
                                    defaultMessage="Welcome"
                                    description='Welcome menu item'
                                /></Link></li>
                            <li><Link to="storage">
                                <FormattedMessage
                                    id="nav.storage"
                                    defaultMessage="Storage"
                                    description='Storage menu item'
                                /></Link></li>

                        </ul>
                    </aside>

                    <div className="main-body">
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
});

