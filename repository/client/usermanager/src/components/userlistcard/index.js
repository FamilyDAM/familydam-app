/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import Avatar from '@material-ui/core/Avatar';
import Typography from "@material-ui/core/Typography/Typography";

import Card from "@material-ui/core/Card";
//import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { red } from '@material-ui/core/colors';




const styleSheet = (theme) => ({
    card: {
        maxWidth: '100%',
        maxHeight: '200px',
        height: '100%'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class UserListCard extends Component {

    constructor(props, context) {
        super(props);
    }


    componentWillMount() {

    }

    componentWillUnmount() {

    }


    render(){
        var classes = this.props.classes;

        return(
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {this.props.user.firstName.substring(0,1)}
                        </Avatar>
                    }
                    title={
                        <Typography>
                            {this.props.user.firstName}
                        </Typography>
                    }
                    subheader={
                        <Typography color="textSecondary">
                            {this.props.user.email}
                        </Typography>
                    }
                />
                <CardContent>

                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="share">
                        <EditIcon onClick={()=>this.props.onEdit(this.props.user)}/>
                    </IconButton>
                </CardActions>
            </Card>
        )
    }

}


//export default withStyles(styleSheet)(UserListCard);