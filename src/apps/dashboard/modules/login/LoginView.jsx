/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var ReactIntl  = require('react-intl');
var IntlMixin  = ReactIntl.IntlMixin;

var LoginCard = require('./LoginCard');
var Clock = require('./../../components/clock/Clock');

var AuthActions = require('./../../actions/AuthActions');
var UserActions = require('./../../actions/UserActions');
var UserStore = require('./../../stores/UserStore');

var LoginView = React.createClass({


    getInitialState: function(){
        return { users : [], activeUser: undefined };
    },


    componentDidMount: function(){
        var _this = this;

        AuthActions.logout.onNext(true);
        UserActions.getUsers.source.onNext(true);

        this.usersSubscription = UserStore.users.subscribe(function (results) {
            _this.state.users = results;
            if (_this.isMounted())  _this.forceUpdate();
        });
    },

    componentWillUnmount: function(){
        if( this.usersSubscription != undefined ){
            this.usersSubscription.dispose();
        }
    },


    handleCardSelection: function(user){
        this.setState({activeUser:user});
    },


    handleCancelCardSelection: function(event){
        this.setState({activeUser:undefined});
    },



    render: function() {

        var _this = this;
        var childNodes;
        if (this.state.activeUser === undefined ) {
            childNodes = this.state.users.map(function(user, index) {
                return <div key={index}>
                        <LoginCard  user={user}
                            mode="inactive"
                            onSelect={_this.handleCardSelection}
                            {..._this.props}/>
                        </div>
            });
        }else{
            var overrideStyle = {width:"100%"};
            childNodes =  <div key="0" style={overrideStyle}>
                                <LoginCard  user={this.state.activeUser}
                                    mode="active"
                                    onSelect={_this.handleCardSelection}
                                    onCancel={_this.handleCancelCardSelection}
                                    {..._this.props} />
                            </div>

        }

        return (
            <div className="loginView container-fluid" style={{'backgroundColor':'#000'}}>
                <div className="row logins">
                    <div className="col-sm-8 col-sm-offset-2 login-grid">
                    {childNodes}
                    </div>
                </div>

                <div className="row timeClock">
                    <div className="col-sm-12">
                        <Clock/>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = LoginView;
