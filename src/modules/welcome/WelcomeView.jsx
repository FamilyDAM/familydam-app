/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
import {LinkContainer} from 'react-router-bootstrap';

import {FormattedMessage, FormattedPlural,FormattedDate} from 'react-intl';

var ConfigActions = require('./../../actions/ConfigActions');
var SettingsStore = require('./../../stores/SettingsStore');

module.exports = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        //console.log("WelcomeView");
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
                        <FormattedMessage
                            id="welcome.intro"
                            defaultMessage="Before we can start the application we need to know a few things. The first, is your preferred language. The second, is a place to store all of the files we are going to manage."
                            description='Introduction for welcome screen'
                        />
                    </span>

                    <br/><br/>

                    <div>
                        <label>
                            <FormattedMessage
                                id="welcome.selectDefaultLanguage"
                                defaultMessage="tbd"
                                description='Default language selection'
                            />:</label><br/>
                        <select defaultValue={this.state.locale} onChange={this.changeLocale}>
                                <FormattedMessage
                                    id="language.english"
                                    defaultMessage="Englist"
                                    description='English Selection'>
                                    {(message)=> <option value="en_us">{message}</option>}
                                </FormattedMessage>
                        </select>
                        <br/>
                        <FormattedMessage
                            id="welcome.moreComingSoon"
                            defaultMessage="tbd"
                            description='More are coming soon'
                        />
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left">
                        </div>
                        <div className="right">
                            <LinkContainer to={{'pathname':'storage'}}>
                            <FormattedMessage
                                id="next"
                                defaultMessage="tbd"
                                description='Next Button Label'>
                            </FormattedMessage></LinkContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
//<ButtonLink to="storage">next{message}</ButtonLink>
