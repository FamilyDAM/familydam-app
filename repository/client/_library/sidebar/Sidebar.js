import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import {Button, Menu} from 'antd';
import { HomeOutlined, FileImageOutlined, FolderOutlined } from '@ant-design/icons';

//import Button from '@material-ui/core/Button';
//import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import AccountCircle from '@material-ui/icons/AccountCircle';
//import PhotoIcon from '@material-ui/icons/Photo';

import AppActions from '../actions/AppActions';


const styleSheet = (theme) => ({

    sidebarOpen:{
        width: '240px',
        minHeight: '100vh',
        height: '100%',
        background:'#fff'
    },

    sidebarClosed:{
        width: '72px',
        minHeight: '100vh',
        height: '100%',
        background:'#fff'
    },

    sidebarUserInfo:{
        width:'100%',
        padding:'8px',
        display:'grid',
        gridGap: '8px',
        gridTemplateRows: "auto",
        gridTemplateColumns: "60px auto"
    },

    sidebarUserInfoClosed:{
        display:'none'
    },

    sidebarProfileIcon:{
        gridColumn: "1",
        gridRow: "1",
    },

    sidebarProfileName:{
        gridColumn: "2",
        gridRow: "1",
        alignSelf:'center'
    },

    sidebarButtons:{
        gridColumn: "1/3",
        gridRow: "2",
        justifySelf:'center'
    },

    appListsOpen:{
        display:'grid',
        gridGap: '0px',
        gridTemplateRows: "24px auto",
        gridTemplateColumns: "auto",
        marginTop:'16px'
    },

    appListsClosed:{
        height:'90%',
        display:'grid',
        gridGap: '0px',
        gridTemplateRows: "0px auto 72px",
        gridTemplateColumns: "auto"
    },

    openLabel:{
        display:'inline'
    },

    closedLabel:{
        display:'none'
    },



});

class Sidebar extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.open !== this.props.open
            || nextProps.user !== this.props.user
            || nextProps.apps !== this.props.apps
            || nextProps.secondaryApps !== this.props.secondaryApps);
    }


    handleLogout(){
        window.localStorage.clear();
        //UserActions.getUser.sink.next(next);
        AppActions.logout.source.next(true);
        window.location = "/index.html";
    }


    findApp(slug, apps){
        if( apps ) {
            for (let app of apps) {
                if (app.slug === slug) {
                    return app;
                }
            }
        }
        return null;
    }



    render() {
        var classes = this.props.classes;
        //find specific app in the installed list of apps, if it's not installed don't show link
        var profileApp = this.findApp('usermanager', this.props.secondaryApps);

        return (
            <Paper className={this.props.open?classes.sidebarOpen:classes.sidebarClosed} >

                <Paper className={this.props.open?classes.sidebarUserInfo:classes.sidebarUserInfoClosed}>
                    <div className={classes.sidebarProfileIcon}>
                        <AccountCircle
                            style={{'width': 60, 'height': 60}}
                        />
                    </div>
                    <div className={classes.sidebarProfileName}>
                        <Typography component="div" type={"title"}>{this.props.user.firstName} {this.props.user.lastName}</Typography>
                    </div>
                    <div className={classes.sidebarButtons}>

                        <Button type="link" onClick={this.handleLogout}>Logout</Button>

                        {profileApp &&
                        <Button type="link" onClick={()=>window.location.href=profileApp.path +"#/u/" +this.props.user.name +"/account"}>Profile</Button>
                        }
                    </div>
                </Paper>


                <div className={this.props.open?classes.appListsOpen:classes.appListsClosed}>

                    <div style={{gridColumn: "1",gridRow: "1"}}>
                        <Typography type="title"
                                    className={this.props.open?classes.openLabel:classes.closedLabel}
                                    style={{'fontSize':'16px','paddingLeft':'16px', paddingTop:'16px', gridColumn: "1", gridRow: "1"}}>Apps</Typography>
                    </div>

                    <Menu style={{gridColumn: "1",gridRow: "2"}}>
                        {this.props.apps && this.props.apps.map((item)=>{
                            return (
                                <Menu.Item key={item.path} style={{height:'34px'}} onClick={()=>window.location.href = item.path}>
                                    {item.slug==='home'&& <HomeOutlined/>}
                                    {item.slug==='files'&& <FolderOutlined/>}
                                    {item.slug==='photos'&& <FileImageOutlined/>}
                                    {item.label}
                                </Menu.Item>
                            )
                        })}
                    </Menu>





                    <List style={{gridColumn: "1",gridRow: "3"}} className={!this.props.open?classes.openLabel:classes.closedLabel}>
                        <ListItem button onClick={()=>window.location.href = '://app-usermanager/index.html'}>
                            <Avatar>
                                <AccountCircle
                                    style={{'width': 48, 'height': 48}}
                                />
                            </Avatar>
                        </ListItem>
                    </List>
                </div>
            </Paper>
        );
    }
}

/**
 * <List style={{gridColumn: "1",gridRow: "2"}}>
 {this.props.apps && this.props.apps.map((item)=>{
                            return (
                                <ListItem button key={item.path} onClick={()=>window.location.href = item.path}>
                                    <Avatar style={{marginRight:'8px'}}>
                                        <FolderIcon />
                                    </Avatar>
                                    <ListItemText primary={item.label} primaryTypographyProps={{type:"body2"}}
                                                  className={this.props.open?classes.openLabel:classes.closedLabel}/>
                                </ListItem>

                            )
                        })}
 </List>
 */

export default injectIntl(withStyles(styleSheet)(Sidebar));