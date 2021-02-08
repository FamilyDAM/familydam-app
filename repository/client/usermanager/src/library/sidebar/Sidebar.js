import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import {Button, Menu} from 'antd';
import {FileImageOutlined, FolderOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
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
        display:'inline',
        marginLeft: '10px',
        fontSize: '16px'
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
                    <div style={{gridColumn: "1",gridRow: "1"}}><br/></div>

                    <Menu style={{gridColumn: "1",gridRow: "2"}}>
                        {this.props.apps && this.props.apps.map((item)=>{
                            return (
                                <Menu.Item key={item.path}  onClick={()=>window.location.href = item.path}>
                                    {item.slug==='home'&& <Button size="large" shape="circle" icon={<HomeOutlined style={{'marginRight': '0px'}}/>}/>}
                                    {item.slug==='files'&& <Button size="large" shape="circle" icon={<FolderOutlined style={{'marginRight': '0px'}}/>}/>}
                                    {item.slug==='photos'&& <Button size="large" shape="circle" icon={<FileImageOutlined style={{'marginRight': '0px'}}/>}/>}
                                    <span className={this.props.open?classes.openLabel:classes.closedLabel}>{item.label}</span>
                                </Menu.Item>
                            )
                        })}
                    </Menu>




                    <Menu style={{gridColumn: "1", gridRow: "3"}} className={!this.props.open?classes.openLabel:classes.closedLabel}>
                    `    <Button size="large"
                            shape="circle"
                            icon={<UserOutlined style={{'marginLeft': '0px','marginRight': '0px'}}/>}
                            onClick={()=>window.location.href = '/usermanager/index.html'}/>`
                    </Menu>
                </div>
            </Paper>
        );
    }
}


export default injectIntl(withStyles(styleSheet)(Sidebar));