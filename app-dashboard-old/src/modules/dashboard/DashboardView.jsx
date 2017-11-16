/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
import {Router, Link} from 'react-router';

var LinkContainer = require('react-router-bootstrap').LinkContainer;

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {AppBar, IconMenu, IconButton, MenuItem, Divider, Drawer, Paper, Snackbar, Toolbar, ToolbarGroup} from 'material-ui';

var AppSidebar = require('../../components/appSidebar/AppSidebar.jsx');


var Breadcrumb = require('../../components/breadcrumb/Breadcrumb.jsx');
var SectionHeader = require('../../components/breadcrumb/SectionHeader.jsx');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');

var AuthActions = require('../../actions/AuthActions');
var UserActions = require('../../actions/UserActions');
var NavigationActions = require('../../actions/NavigationActions');

var UserStore = require('./../../stores/UserStore');

const muiThemeLight = getMuiTheme(lightBaseTheme);

const muiThemeCustom = getMuiTheme({
    palette: {
        "primary1Color":"#3f51b5",
        "primary2Color":"#4fc3f7",
        "primary3Color":"#bdbdbd",
        "accent1Color":"#ff6e40",
        "accent2Color":"#f5f5f5",
        "accent3Color":"#9e9e9e"
    },
    appBar: {
        height: 65,
    },
});

//const muiThemeDark = getMuiTheme(darkBaseTheme);
/*****************DashboardView.jsx
 import {
cyan500, cyan700,
grey100, grey300, grey400, grey500,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/lib/styles/colors';
 import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

 const lightBaseTheme = {
  spacing: {
    iconSize: 24,
    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopLeftNavMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56,
  },
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: ColorManipulator.fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: ColorManipulator.fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};
**************************/



module.exports = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            user: {},
            openAppSidebar:false,
            snackBarOpen:false,
            snackBarMessage:""
        };
    },


    componentWillMount: function () {

        this.checkAuthHandler();
        this.authCheckTimer = window.setInterval(this.checkAuthHandler, 120000);

        AuthActions.loginRedirect.subscribe(function () {
            //add a delay so any UserAction Alerts can show up
            window.setTimeout( () => {this.context.router.push('/login')}, 1000);
        }.bind(this));


        this.openAppSidebarSubscription = NavigationActions.openAppSidebar.subscribe(function(data_){
            this.setState({'openAppSidebar':data_})
        }.bind(this));


        this.currentUserStoreSubscription = UserStore.currentUser.subscribe(function (data_) {
            if (data_ !== null && data_ !== undefined)
            {
                this.setState({'user': data_});
            }
        }.bind(this));


        this.userAlertSubscription = UserActions.alert.subscribe( function(data_){

            this.setState({
                snackBarOpen:true,
                snackBarMessage:data_
            });

            setTimeout(function () {
                this.setState({
                    snackBarOpen:false,
                    snackBarMessage:"NO REASON"
                });
            }.bind(this), 3500);
        }.bind(this))
    },


    componentWillUnmount: function () {
        if( this.currentUserStoreSubscription )  {
            this.currentUserStoreSubscription.dispose();
        }
        if( this.openAppSidebarSubscription ){
            this.openAppSidebarSubscription.dispose();
        }
        if( this.userAlertSubscription ){
            this.userAlertSubscription.dispose();
        }
        if( this.authCheckTimer ){
            //window.clearInterval(this.authCheckTimer);
        }
    },


    handleHamburgerClick: function (e) {
        NavigationActions.openAppSidebar.onNext(!this.state.openAppSidebar);
    },


    checkAuthHandler:function(){
        AuthActions.checkAuth.source.onNext(true);
    },



    render: function () {

        var bodyWidth = "100%";
        try
        {
            return (
                <MuiThemeProvider muiTheme={muiThemeCustom}>
                    <div className="dashboardView" style={{'display':'flex', 'flexDirection':'column'}}>

                        <header>
                            <AppBar
                                title={<span>Family|<i>D.A.M</i></span>}
                                onLeftIconButtonTouchTap={this.handleHamburgerClick}
                                iconElementRight={
                                    <IconMenu
                                        iconButtonElement={ <IconButton><MoreVertIcon/></IconButton>}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    >
                                        <LinkContainer to="users"><MenuItem primaryText="User Manager" /></LinkContainer>
                                        <LinkContainer to="login"><MenuItem primaryText="Logout" /></LinkContainer>
                                        <Divider />
                                        <MenuItem primaryText="System Console" />
                                    </IconMenu>
                                }
                            />
                        </header>




                        <div
                            style={{'display':'flex', 'flexDirection':'row', 'alignItems':'stretch', 'width':'100%', 'minHeight':'calc(100vh - 65px)'}}>



                            {(() => {
                                var _appWidth = "75px";
                                if( this.state.openAppSidebar)
                                {
                                    _appWidth = "240px";
                                }
                                return (
                                    <Paper className="" style={{'display':'flex', 'flexGrow':0, 'width':_appWidth}} transitionEnabled={false} zDepth={1}>
                                        <AppSidebar open={this.state.openAppSidebar}/>
                                    </Paper>
                                );
                            })()}



                            <Paper zDepth={1}
                                   className="container-fluid"
                                   style={{'width':'100%','backgroundColor':'rgb(245, 245, 245)', 'paddingLeft':'0px', 'paddingRight':'0px'}}>

                                <div className="row">
                                    <div className="col-xs-12">
                                        {this.props.children}
                                    </div>
                                </div>
                                <div className="device-xs visible-xs"></div>
                                <div className="device-sm visible-sm"></div>
                                <div className="device-md visible-md"></div>
                                <div className="device-lg visible-lg"></div>
                            </Paper>
                        </div>


                        <footer>
                            <Snackbar
                                open={this.state.snackBarOpen}
                                message={this.state.snackBarMessage}
                                autoHideDuration={3000}
                            />
                        </footer>
                    </div>
                </MuiThemeProvider>
            );
        } catch (err)
        {
            console.log(err);
        }
    }

});


