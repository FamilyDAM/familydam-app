/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var IntlMixin = require('react-intl');
var ButtonLink = require('react-router-bootstrap').ButtonLink;

var ConfigActions = require('./../../actions/ConfigActions');
var SettingsStore = require('./../../stores/SettingsStore');

module.exports = React.createClass({

    mixins: [IntlMixin],

    getInitialState: function () {
        return {'locale': "en_us"};
    },

    componentDidMount: function () {
        //console.log("WelcomeView");

        SettingsStore.locale.subscribe(function(data_){
            this.state.locale = data_;
            if( this.isMounted()) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function () {
        //if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },

    changeLocale: function (event) {
        var _locale = event.target.value;
        ConfigActions.changeLocale.onNext(_locale);
    },

    render: function () {

        return (
            <div>
                <div className="main-section">

                    <span className="intro">
                        {this.getIntlMessage('welcome.intro')}
                    </span>

                    <br/><br/>

                    <div>
                        <label>{this.getIntlMessage('welcome.selectDefaultLanguage')}:</label><br/>
                        <select defaultValue={this.state.locale} onChange={this.changeLocale}>
                            <option value="en_us">{this.getIntlMessage('language.english')}</option>
                        </select>
                        <br/>
                        {this.getIntlMessage('welcome.moreComingSoon')}
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left">
                        </div>
                        <div className="right">
                            <ButtonLink to="storage">{this.getIntlMessage('next')}</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
