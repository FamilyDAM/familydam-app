/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';


import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {cyan500} from 'material-ui/styles/colors';
import {lightBaseTheme} from 'material-ui/styles/baseThemes/lightBaseTheme';



var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;

var LoginCard = require('./LoginCard.jsx');
var SignupCard = require('./SignupCard.jsx');
var Clock = require('./../../components/clock/Clock.jsx');

var AuthActions = require('./../../actions/AuthActions');
var UserActions = require('./../../actions/UserActions');
var UserStore = require('./../../stores/UserStore');

var intlData = require("./../../locales/en-us");


const muiThemeLight = getMuiTheme(lightBaseTheme);
module.exports = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },


    getInitialState: function () {
        return {
            users: undefined
            , activeUser: undefined
            , backgrounds: [
                "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933080/graphicstock/AS6_9771-180__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933187/graphicstock/lake-marina_GkuzZvKu__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933186/graphicstock/DSC_5803-777__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933181/graphicstock/pebble-stack_XJX4rE__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933172/graphicstock/fire-texture-15_GyOwSEFd__.jpg"
                //, "http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933171/graphicstock/lake_GyXLZDKu__.jpg"
            ]
        };
    },


    componentDidMount: function () {
        var _this = this;

        AuthActions.logout.onNext(true);
        UserActions.getUsers.source.onNext(true);

        this.usersSubscription = UserStore.users.subscribe(function (results) {
            _this.state.users = results;
            if (_this.isMounted())  _this.forceUpdate();
        });
    },

    componentWillUnmount: function () {
        if (this.usersSubscription != undefined)
        {
            this.usersSubscription.dispose();
        }
    },


    handleCardSelection: function (user) {
        this.setState({activeUser: user});
    },


    handleCancelCardSelection: function (event) {
        this.setState({activeUser: undefined});
    },


    render: function () {

        var _this = this;
        var childNodes;

        var randomBackground = this.state.backgrounds[0];


        if (this.state.users !== undefined)
        {
            if (this.state.users !== undefined && this.state.users.length == 0)
            {
                childNodes = <div>
                                <SignupCard/>
                            </div>;
            }
            else if (this.state.activeUser === undefined)
            {
                childNodes = this.state.users.map(function (user, index) {
                    return <div key={index} className="personCard" style={{'backgroundColor':'#ffffff', 'margin':'20px'}}>
                                <LoginCard
                                    user={user}
                                    mode="inactive"
                                    onSelect={_this.handleCardSelection}
                                    {..._this.props}/>
                            </div>
                });
            } else
            {
                var overrideStyle = {width: "100%"};
                childNodes = <div key="0" style={overrideStyle}>
                                <LoginCard
                                    user={this.state.activeUser}
                                    mode="active"
                                    onSelect={_this.handleCardSelection}
                                    onCancel={_this.handleCancelCardSelection}
                                    {..._this.props} />
                            </div>

            }
        }

        return (
            <MuiThemeProvider muiTheme={muiThemeLight}>
                <div className="loginView "
                     style={{'display':'flex', 'flexGrow':1, 'flexWrap':'wrap', 'alignItems':'center','justifyContent':'center', 'height':'100vh', "background": "url('" + randomBackground + "') no-repeat"}}>

                    {childNodes}

                    <div className="timeClock">
                        <Clock/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

});

