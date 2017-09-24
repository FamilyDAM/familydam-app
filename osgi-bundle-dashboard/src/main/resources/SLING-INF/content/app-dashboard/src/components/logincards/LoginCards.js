/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "material-ui/styles";

import LoginCard from './LoginCard';

const styleSheet = (theme) => ({
    outerContainer:{
        display: 'grid',
        gridGap: '24px',
        gridTemplateRows: '1fr auto 1fr',
        gridTemplateColumns: '1fr auto 1fr'
    },
    loginGrids:{
        display: 'grid',
        gridGap: '32px',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(2, 1fr)'
    },
    loginCardItem:{
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class LoginCards extends Component {

     constructor(props, context) {
        super(props);

        this.state = {
            selectedUser:null
        };

        this.handleLogin = this.handleLogin.bind(this);
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


    handleLogin(username_, password_){
        if (this.props.onLogin) {
            this.props.onLogin(username_, password_);
        }
    }

    /**
     * Select an inactive user
     * @param event
     */
    handleSelect(event){
        //event.target = this.getDOMNode();
        this.props.onSelect(this.props.user);
    }



    render(){
        var classes = this.props.classes;

        let _users = [];
        if( this.props.users ){
            _users = this.props.users;
            if( this.state.selectedUser !== null ) {
                _users = _users.filter( (u)=>u.username === this.state.selectedUser.username );
            }
        }

        return(
            <div className={classes.outerContainer}>
                <div style={{'gridColumn': '2/3', 'gridRow':'2/3'}}>
                    <div className={classes.loginGrids}>

                        {_users.map((user)=> {
                            return (
                                <div key={user.username}  className={classes.loginCardItem}>
                                    <LoginCard
                                        user={user}
                                        onLogin={this.handleLogin}
                                        onCancel={(u)=>this.setState({"selectedUser":null})}
                                        onSelect={(u)=>this.setState({"selectedUser":u})}/>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        )

    }



}



export default withStyles(styleSheet)(LoginCards);