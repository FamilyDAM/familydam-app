import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";

import AppBar from 'material-ui/AppBar';
//import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';

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
    },
    moreButton:{
        color: '#fff'
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
        AppActions.navigateTo.next("://");
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

                    <Typography type="title" color="inherit" className={classes.flex} onClick={()=>this.handleNavClick('://dashboard/index.html')}>
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
                        anchorEl={this.state.openMoreMenuAnchorEl}
                        open={this.state.openMoreMenu}>
                        <MenuItem color="contrast" onClick={()=>{this.handleLogout();this.handleMenuClose()}}>Logout</MenuItem>
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