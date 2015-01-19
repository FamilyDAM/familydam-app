/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var LoginCard = require('./LoginCard');
var Clock = require('./../../components/clock/Clock');

var LoginView = React.createClass({

    getDefaultProps: function(){
        return{ users : [
                {id:01, firstName:"Mike", username:"mnimer"},
                {id:02, firstName:"Angela", username:"angie"},
                {id:03, firstName:"Kayden", username:"k5n5"},
                {id:04, firstName:"Hailey", username:"hailey0124"}
            ]};
    },


    getInitialState: function(){
        return { activeUser: undefined };
    },

    handleCardSelection: function(user){
        console.log("handleCardSelection");
        console.dir(user);
        //console.dir(event.target);

        this.setState({activeUser:user});

    },
    handleCancelCardSelection: function(event){
        this.setState({activeUser:undefined});
    },

    render: function() {

        var _this = this;
        var childNodes;
        if (this.state.activeUser === undefined ) {
            childNodes = this.props.users.map(function(user, index) {
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
            <div className="loginView container-fluid">
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
