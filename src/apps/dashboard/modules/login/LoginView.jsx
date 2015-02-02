/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var LoginCard = require('./LoginCard');
var Clock = require('./../../components/clock/Clock');

var AuthServices = require('./../../services/AuthServices');

var LoginView = React.createClass({



    getInitialState: function(){
        return { users : [], activeUser: undefined };
    },



    componentWillMount: function(){

        var _this = this;
        var stream = AuthServices.listUsers().subscribe(function(results){
            _this.setState({'users': results});
        });
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
                return <li key={index}>
                        <LoginCard user={user}
                            mode="inactive"
                            onSelect={_this.handleCardSelection} />
                        </li>
            });
        }else{
            var overrideStyle = {width:"100%"};
            childNodes =  <li key="0" style={overrideStyle}>
                                <LoginCard user={this.state.activeUser}
                                    mode="active"
                                    onSelect={_this.handleCardSelection}
                                    onCancel={_this.handleCancelCardSelection}/>
                            </li>

        }

        return (
            <div className="loginView container-fluid" style={{'background-color':'#000'}}>
                <div className="row logins">
                    <ul className="col-sm-8 col-sm-offset-2 login-grid">
                    {childNodes}
                    </ul>
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
