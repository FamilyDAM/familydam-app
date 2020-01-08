import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import AppBar from '@material-ui/core/AppBar';
//import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';

import AppActions from '../actions/AppActions';


const styleSheet = (theme) => ({

    root: {
        width: '100%',
        height: '64px'
    },
    headerContainer: {
        display: "grid",
        gridTemplateRows: "auto",
        gridTemplateColumns: "48px auto 48px"
    },
    hamburgerMenu: {
        display: 'block',
        gridRow: "1",
        gridColumn: "1",
    },
    mainSection: {
        gridRow: "1",
        gridColumn: "2"
    },
    rightSection: {
        gridRow: "2",
        gridColumn: "3",
        textAlign: "right"
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: '#ffffff'
    },
    moreButton:{
        color: '#ffffff'
    }
});

class AppHeader extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            openMoreMenu:false
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleOpenMoreMenu = this.handleOpenMoreMenu.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.onToggle !== this.props.onToggle
                || nextProps.apps !== this.props.apps);
    }

    handleOpenMoreMenu(event){
        this.setState({ openMoreMenu: true, openMoreMenuAnchorEl: event.currentTarget });
    }

    handleToggle(){
        if( this.props.onToggle){
            this.props.onToggle();
        }
    }

    handleNavClick(path){

        if( this.props.onNavClick){
            this.props.onNavClick(path);
        }
    }

    handleMenuClose(){
        this.setState({"openMoreMenu": false});
    }

    handleLogout(){
        window.localStorage.clear();
        //UserActions.getUser.sink.next(next);
        AppActions.logout.source.next(true);
        window.location = "/";
    }


    render2() {
        return(<div>header</div>)
    }


    render() {
        var classes = this.props.classes;

        return (
            <AppBar className={classes.root} position="static">
                <Toolbar>
                    <IconButton
                        onClick={this.handleToggle}
                        className={classes.menuButton}
                        color="contrast" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h5" color="inherit" className={classes.flex} onClick={()=>this.handleNavClick('://home/index.html')}>
                        Family <i>D.A.M</i>
                    </Typography>

                    <IconButton
                        aria-label="More"
                        aria-owns={this.state.open ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleOpenMoreMenu}
                        className={classes.moreButton}
                    >
                        <MoreVertIcon/>
                    </IconButton>

                    <Menu
                        id="long-menu"
                        keepMounted
                        anchorEl={this.state.openMoreMenuAnchorEl}
                        open={this.state.openMoreMenu}>
                        <MenuItem onClick={()=>{this.handleLogout();this.handleMenuClose()}}>Logout</MenuItem>
                        <Divider/>
                        {this.props.apps && this.props.apps.map((item)=>{
                            return (
                                <MenuItem key={item.path}
                                          color="contrast"
                                          onClick={()=>{this.handleNavClick(item.path);this.handleMenuClose()}}>{item.label}</MenuItem>
                            )
                        })}

                    </Menu>
                </Toolbar>

            </AppBar>
        );


    }
}

export default injectIntl(withStyles(styleSheet)(AppHeader));