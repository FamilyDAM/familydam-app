/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {HashRouter, Route, Switch, withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';

import {Button, Menu} from 'antd';
import {UserAddOutlined, UserOutlined} from '@ant-design/icons';
import {withStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';


import AppShell from '../../library/appShell/AppShell';
import AppActions from "../../library/actions/AppActions";
import GetAllUsersService from "../../library/services/GetAllUsersService";
import NewUserForm from "../../components/newuserform/NewUserForm.js";
import UserAccountForm from "../../components/useraccountform/UserAccountForm.js";
import CreateUserService from "../../services/CreateUserService";
import UpdateUserService from "../../services/UpdateUserService";

const { SubMenu } = Menu;


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing(2)}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },


    container:{
        margin: '48px',
        display:'grid',
        gridTemplateColumns: '250px 3fr',
        gridAutoRows: '1fr 64px',
        gridGap: '16px'
    },

    userlist: {
        backgroundColor: '#ffffff',
        minHeight: '300px',
        gridColumn: 1
    },

    userforms: {
        gridColumn: 2
    },

    userlistpart: {
        textAlign: 'center'
    },

    userlistlink: {
        textAlign: 'center'
    }
});


class UserList extends Component {


    constructor(props, context) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.state = {
            isMounted:true,
            isLoading:false,
            anchorEl:null,
            users:[],
            selectedUser:{name:''}
        };

        GetAllUsersService.sink.takeWhile(() => this.state.isMounted).subscribe({
            next: users_ => {
                if (users_) {
                    this.setState({"isLoading": false, "users": users_, "selectedUser": users_[0]});
                }
            },
            error: err => {
                console.error(err);
            }
        });

        CreateUserService.sink.takeWhile(() => this.state.isMounted).subscribe({
            next: user => {
                GetAllUsersService.source.next(true);
                this.props.history.push("/u/" +user.name +"/account");
            },
            error: err => {
                console.error(err);
            }
        })

    }

    componentDidMount(){
        this.setState({"isMounted":true, "isLoading": true});

        GetAllUsersService.source.next(true);
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }


    handleCreateNewUser(userProps){
        CreateUserService.source.next(userProps);
    }

    handleSaveNewUser(userProps){
        UpdateUserService.source.next(userProps);
    }


    handleClick(event) {
        this.setState({anchorEl:event.currentTarget});
    }

    handleClose() {
        this.setState({anchorEl:null});
    }

    handleEdit(user_) {
        this.setState({anchorEl:null});
        AppActions.navigateTo.next("/u/" +user_.id)
    }

    handleSubMenuSelect(e){
        this.props.history.push(e.key);
    }

    handleMenuOpen(e){
        this.props.history.push(e[1] +"/account");
    }


    render() {
        var classes = this.props.classes;

        //for some reason props.match.params are empty, so we'll parse the path
        const path = this.props.location.pathname.trim().split("/");
        const selectedUser = path[2];
        const selectedMenu = '/u/' +selectedUser;
        let selectedSubMenu = selectedMenu +"/account";
        if( path.length == 4){
            selectedSubMenu = '/u/' +path[2] +'/' +path[3];
        }

        if( this.state.isLoading ){
            return (
                <AppShell user={this.props.user}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }else {

            /** todo, add menu items
             <Menu.Item key={'/u/' +u.name +'/permissions'}>Permissions</Menu.Item>
             <Menu.Item key={'/u/' +u.name +'/web'}>Web/Social Sites</Menu.Item>
             <Menu.Item key={'/u/' +u.name +'/friends'}>Friends</Menu.Item>
             */
            return (
                <AppShell user={this.props.user}>
                    <div className={classes.container}>

                        <div className={classes.userlist}>
                            <div className={classes.userlistpart} style={{minHeight: '50%'}}>
                                <Menu mode="inline"
                                      openKeys={[selectedMenu]}
                                      defaultSelectedKeys={[selectedSubMenu]}
                                      onOpenChange={this.handleMenuOpen.bind(this)}
                                      onSelect={this.handleSubMenuSelect.bind(this)}
                                      style={{ width: '100%' }}>
                                    {this.state.users.map( u=> {
                                        return ( <SubMenu key={'/u/' +u.name} icon={<UserOutlined/>} title={u.firstName} >
                                                    <Menu.Item key={'/u/' +u.name +'/account'}>Account</Menu.Item>
                                                </SubMenu> )
                                    })}
                                </Menu>

                            </div>
                            <div className={classes.userlistlink}>
                                <Button type="link" size="large" icon={<UserAddOutlined />} onClick={()=>this.props.history.push('/new')}>
                                    Add Family Member
                                </Button>
                            </div>
                        </div>

                        <div className={classes.userforms}>
                            <HashRouter>
                            <Switch>
                                <Route exact path="/u/:user/account" component={(path_) => <UserAccountForm
                                    user={this.state.users.filter(u=>u.name===selectedUser).pop()}
                                    onSave={this.handleSaveNewUser}/>} />
                                <Route exact path="/u/:user/permissions" component={(path_) => <div>Permissions</div>} />
                                <Route exact path="/u/:user/web" component={(path_) => <div>Web</div>} />
                                <Route exact path="/u/:user/friends" component={(path_) => <div>Friends</div>} />
                                <Route exact path="/u/:user" component={(path_) => <UserAccountForm/>} />
                                <Route path="/new" exact={true} component={(path_) => <NewUserForm onSave={this.handleCreateNewUser}/>} />
                            </Switch>
                            </HashRouter>
                        </div>

                    </div>
                </AppShell>
            );
        }
    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(UserList)));