import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';

import AppSettings from '../../library/actions/AppSettings';


const styleSheet = (theme) => ({
    card:{

    },
    actions:{

    },
    media:{
        width:"150px",
        height:"150px"
    },
    mediaContainer:{
        textAlign: "center"
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    }

});


class Photo extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            expanded: false
        }

        this.handleExpandClick = this.handleExpandClick.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
    }

    handleExpandClick(evnt){
        this.setState({"expanded":!this.state.expanded})
    }

    render() {
        const classes = this.props.classes;
        const photo = this.props.photo;

        return(
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    subheader={photo.name}
                />
                <div className={classes.mediaContainer}>
                    <img
                        className={classes.media}
                        src={AppSettings.baseHost.getValue() +photo.path}
                        title={photo.name}
                    />
                </div>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                </CardActions>
            </Card>

        )
    }

}



FileList.propTypes = {
    photo: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(Photo));
