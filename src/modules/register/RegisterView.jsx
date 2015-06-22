
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var IntlMixin = require('react-intl');
var ButtonLink = require('react-router-bootstrap').ButtonLink;

var ConfigActions = require("./../../actions/ConfigActions");
var SettingsStore = require("./../../stores/SettingsStore");

module.exports = React.createClass({

    mixins: [IntlMixin],

    getInitialState: function(){
        return {'email':'', 'familyName':''}
    },

    componentDidMount: function(){
        //console.log("RegisterView");

        this.emailSubscription = SettingsStore.email.subscribe(function(data_){
            this.state.email = data_;
            if( this.isMounted() ) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function(){
        if( this.emailSubscription !== undefined ) this.emailSubscription.dispose();
    },

    handleEmailChange: function(event_){
        var _email = event_.target.value;
        ConfigActions.emailChange.onNext(_email);
    },

    handleNameChange: function(event_){
        var _email = event_.target.value;
        ConfigActions.familyNameChange.source.onNext(_email);
    },


    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        {this.getIntlMessage('register.intro1')}
                    </div>
                    <br/>
                    <div>
                        <label>{this.getIntlMessage('register.label.email')}:</label><br/>
                        <input type="email"
                               ref="emailReg"
                               required="true"
                               value={this.state.email}
                               onChange={this.handleEmailChange}
                               style={{'width':'250px'}}/>
                    </div>
                    <br/>
                    <div className="intro" style={{'display':'none'}}>
                        {this.getIntlMessage('register.intro2')}
                    </div>
                    <div  style={{'display':'none'}}>
                        <label>{this.getIntlMessage('register.label.pickName')}:</label><br/>
                        <input type="text"
                               ref="familyName"
                               value={this.state.familyName}
                               onChange={this.handleNameChange}
                               style={{'width':'250px'}}/><label>.familydam.com</label>
                        <button className="btn btn-default">{this.getIntlMessage('register.label.checkAvailability')}:</button>
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left" >
                            <ButtonLink to="welcome">{this.getIntlMessage('back')}</ButtonLink>
                        </div>
                        <div className="right" >
                            <ButtonLink to="storage">{this.getIntlMessage('next')}</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
