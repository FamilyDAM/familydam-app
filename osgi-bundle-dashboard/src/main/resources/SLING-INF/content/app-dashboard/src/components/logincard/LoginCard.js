/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


const styleSheet = (theme) => ({
    foo:{}
});

class LoginCard extends Component {

     constructor(props, context) {
        super(props);

        this.state = {
            user: {
                "firstName":"",
                "lastName":"",
                "email":""
            },
            mode: "inactive"
        };
    }


    componentDidMount() {
        if(this.refs.pwdField) this.refs.pwdField.focus();

        /**
        $(".loginCard").bind('keypress',function(e){
            if(e.keyCode === 13)
            {
                this.handleLogin(e);
            }
        }.bind(this));
         **/
    }


    componentWillUnmount(){
        if( this.currentUserStoreSubscription ){
            //this.currentUserStoreSubscription.dispose();
        }
    }



    /**
     * Submit form, on success redirect to the dashboard.
     * @param event
     */
    handleLogin(event)
    {
        /**
        var _this = this;
        var _username = this.props.user.username;
        var _password = this.state.password;

        AuthActions.login.source.onNext({'username':_username, 'password':_password});

        this.currentUserStoreSubscription = UserStore.currentUser.subscribe(function(data_){
            // redirect to dashboard
            if( data_ )
            {
                //_this.transitionTo("dashboard");
                //this.context.router.push({pathname: '/dashboard'});
            }
        }.bind(this));
         **/

    }


    /**
     * Select an inactive user
     * @param event
     */
    handleSelect(event){
        //event.target = this.getDOMNode();
        this.props.onSelect(this.props.user);
    }

    /**
     * cancel active user
     * @param event
     */
    handleCancel(event){
        this.props.onCancel(this.props.user);
    }



    render() {

        var overrideStyle = {};

        var activeView;
        if (this.props.mode !== "active") {
            activeView = <div
                            className="personCard panel center-block"
                            style={{'padding':'5px'}}
                            onTouchEnd={this.handleSelect}
                            onClick={this.handleSelect}>
                            <div className="box">&nbsp;</div>
                            <h2 style={{'fontFamily':'Roboto', 'fontWeight':'400'}}>{this.props.user.firstName}</h2>
                        </div>;
        } else {
            overrideStyle = {width:"100%"};

            activeView= <div className="loginCard container" style={{'backgroundColor':'#fff', 'width':'500px', 'height':'250px'}}>
                            <div className="row">
                                <div className="col-xs-12 col-sm-4" style={{'padding':'5px'}}>
                                    <div className="box">&nbsp;</div>
                                    <h2 style={{'fontFamily':'Roboto', 'fontWeight':'400'}}>{this.props.user.firstName}</h2>
                                </div>
                                <div className="col-xs-12 col-sm-8" style={{'textAlign':'center'}}>
                                    <br/>
                                    <div>
                                        <TextField
                                            ref="pwdField"
                                            type="password"
                                            floatingLabelText={this.getIntlMessage('password')}
                                            onChange={(e) => {this.setState({'password': e.target.value})}}
                                        />

                                    </div>
                                    <div>
                                        <Button onClick={this.handleCancel} label={this.getIntlMessage('cancel')} />
                                        <Button onClick={this.handleLogin}  label={this.getIntlMessage('login')} />
                                    </div>
                                </div>
                            </div>
                        </div>;
        }

        return (
            <div style={overrideStyle}>{activeView}</div>
        )
    }

}



export default withStyles(styleSheet)(LoginCard);