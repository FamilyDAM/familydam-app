import React, {Component} from 'react';
import {injectIntl} from 'react-intl';

import {UserOutlined} from '@ant-design/icons';

import {withStyles} from "@material-ui/core/styles";

import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
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
                || nextProps.apps !== this.props.apps
                || nextState.openMoreMenu !== this.state.openMoreMenu);
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

    handleButtonClick = (e) => {}
    handleMenuClick = (e) => {}


    render() {
        var classes = this.props.classes;

        return (
            <AppBar className={classes.root} position="static">
                <Toolbar>
                    <IconButton
                        onClick={this.handleToggle}
                        className={classes.menuButton}
                        color="secondary" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" color="inherit" className={classes.flex} style={{'fontWeight':'300'}} onClick={()=>window.location='/home/index.html'}>
                        Family Data Manager
                    </Typography>

                    <IconButton
                        aria-label="More"
                        aria-owns={this.state.open ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleOpenMoreMenu}
                        className={classes.moreButton}>
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
                                          color="secondary"
                                          onClick={()=>{window.location=item.path;this.handleMenuClose()}}>{item.label}</MenuItem>
                            )
                        })}

                    </Menu>

                </Toolbar>

            </AppBar>
        );


    }
}

export default injectIntl(withStyles(styleSheet)(AppHeader));