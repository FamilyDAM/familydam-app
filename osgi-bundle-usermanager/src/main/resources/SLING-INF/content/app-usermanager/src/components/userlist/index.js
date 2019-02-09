/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Typography from "material-ui/Typography/Typography";
import Button from "material-ui/Button/Button";

import UserActions from "../../library/actions/UserActions";

const styleSheet = (theme) => ({
    outerContainer:{
        padding:'16px 0px 16px'
    },
    default:{

    },
    active:{
        backgroundColor:"#ffffff"
    },
    title:{
        padding:'16px 16px 0px 16px;'
    },
    buttonbar:{
        padding:'16px',
        textAlign:'right'
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class UserList extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            selectedUser:2
        };
    }


    componentWillMount() {
        debugger;
        this.setState({isMounted: true});

        UserActions.getAllUsers.sink.takeWhile(() => this.state.isMounted).subscribe((users) => {
            debugger;
            this.setState({"users": users});
        });

        UserActions.getAllUsers.source.next(true);
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }


    render(){
        var classes = this.props.classes;

        return(
            <div className={classes.outerContainer}>
                <Typography type="h3" className={classes.title}>Family Members:</Typography>
                <List>
                    {this.state.users.map(user => {
                        return (
                            <ListItem button key={1} className={this.state.selectedUser===1?classes.active:classes.default}>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                                <ListItemText primary="{user.firstname} {user.lastname}"/>
                            </ListItem>
                        );
                    }, this)}

                </List>

                <div className={classes.buttonbar}>
                    <Button
                        color="primary"
                        onClick={this.handleAddUserClick}>
                        <Typography>+ Add User</Typography>
                    </Button>
                </div>
            </div>
        )
    }

}


export default withStyles(styleSheet)(UserList);