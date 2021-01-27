/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography/Typography";

import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';

import AppActions from '../../library/actions/AppActions';


const styleSheet = (theme) => ({
    card: {
        maxWidth: '100%',
        maxHeight: '200px',
        height: '100%'
    },
    content:{
        textAlign:'center'
    },
    fab: {
        margin: theme.spacing(1),
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class UserListCard extends Component {

    constructor(props, context) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }


    componentWillMount() {

    }

    componentWillUnmount() {

    }

    handleClick(e){
        AppActions.navigateTo.next("/new");
    }


    render(){
        var classes = this.props.classes;

        return(
            <Card className={classes.card}>
                <CardHeader/>
                <CardContent className={classes.content}>
                    <Fab color="secondary" aria-label="add" className={classes.fab} onClick={this.handleClick}>
                        <AddIcon />
                    </Fab>
                    <Typography align="center" onClick={this.handleClick} style={{'marginTop':'16px'}}>
                        Add Family Member
                    </Typography>
                </CardContent>
                <CardActions/>
            </Card>
        )
    }

}


//export default withStyles(styleSheet)(UserListCard);