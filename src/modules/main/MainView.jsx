/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var IntlMixin = require('react-intl');
var Link = Router.Link;

module.exports = React.createClass({

    mixins: [IntlMixin],


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
                        <h3>FamilyD.A.M.  {this.getIntlMessage('title')}</h3>
                    </div>
                </div>

                <div className="row main">
                    <aside >
                        <ul>
                            <li><Link to="welcome">{this.getIntlMessage('nav.welcome')}</Link></li>
                            <li><Link to="storage">{this.getIntlMessage('nav.storage')}</Link></li>
                        </ul>
                    </aside>

                    <div className="main-body">
                        <RouteHandler {...this.props}/>
                    </div>
                </div>
            </div>

        );

    }
});

