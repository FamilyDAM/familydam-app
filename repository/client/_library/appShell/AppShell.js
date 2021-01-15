import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import {takeWhile} from 'rxjs/operators';

import Sidebar from '../sidebar/Sidebar';
import AppHeader from '../appheader/AppHeader';
import AppActions from '../actions/AppActions';
import LoadClientAppsService from "../services/LoadClientAppsService";


const styleSheet = (theme) => ({

    dashboardShellContainerOpen:{
        display: "grid",
        gridTemplateRows: "64px auto",
        gridTemplateColumns: "240px auto"

    },
    dashboardShellContainerClosed:{
        display: "grid",
        gridTemplateRows: "64px auto",
        gridTemplateColumns: "72px auto"
    },
    header: {
        gridColumn: "1/3",
        gridRow: "1",
        position: "inherit",
        height: '64px'
    },

    main:{
        fontSize: '.5rem',
        background:'#eee'
    },

});

class AppShell extends Component {


    constructor(props, context) {
        super(props);

        var isOpenCachedValue = window.localStorage.getItem("AppShell.isOpen");

        if( !isOpenCachedValue ){
            if( props.open !== undefined ) {
                isOpenCachedValue = props.open;
            }else{
                isOpenCachedValue = true;
            }
        }

        this.state = {
            isMounted:true,
            isOpen:Boolean(isOpenCachedValue)
        };

        this.handleOpenCloseToggle = this.handleOpenCloseToggle.bind(this);
        this.handleOpenMoreMenu = this.handleOpenMoreMenu.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.open !== this.props.open
            || nextProps.user !== this.props.user
            || nextProps.children !== this.props.children
            || nextState.isOpen !== this.state.isOpen
            || nextState.primaryApps !== this.state.primaryApps
            || nextState.secondaryApps !== this.state.secondaryApps );
    }


    componentDidMount(){
        this.setState({"isMounted":true});

        AppActions.navigateTo.pipe(takeWhile(() => this.state.isMounted)).subscribe(function(path){
            //debugger;
            if ( path !== "://" && path.substring(0, 3) === "://") {
                window.location.href = path.substring(2);
            }else if(this.props.history){
                this.props.history.push(path);
            }
        }.bind(this));

        LoadClientAppsService.sink.pipe(takeWhile(() => this.state.isMounted)).subscribe( (data)=> {
            if( data ) {
                this.setState({
                    "primaryApps": data.primaryApps || [],
                    "secondaryApps": data.secondaryApps || []
                });
            }
        });
        LoadClientAppsService.source.next(true);
    }

    componentWillUnmount() {
        this.setState({"isMounted":false});
    }

    handleOpenMoreMenu(event){
        this.setState({ openMoreMenu: true, openMoreMenuAnchorEl: event.currentTarget });
    }

    handleOpenCloseToggle(){
        var val = !this.state.isOpen;
        this.setState({'isOpen':val});
        window.localStorage.setItem("AppShell.isOpen", val);
    }

    handleLogout(){
        window.localStorage.clear();
        //UserActions.getUser.sink.next(next);
        AppActions.logout.source.next(true);
        AppActions.navigateTo.next("://");
    }


    render() {
        var classes = this.props.classes;

        if( !this.props.user ){
            return (<div></div>);
        }

        return (
            <div className={this.state.isOpen?classes.dashboardShellContainerOpen:classes.dashboardShellContainerClosed}>
                <header className={classes.header}>
                    <AppHeader
                        apps={this.state.secondaryApps}
                        onToggle={this.handleOpenCloseToggle}
                        onNavClick={(path)=>window.location=path}/>
                </header>


                <Sidebar
                    user={this.props.user}
                    apps={this.state.primaryApps}
                    secondaryApps={this.state.secondaryApps}
                    open={this.state.isOpen}
                    onNavClick={(path)=>window.location=path}/>


                <div className={classes.main}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}

export default injectIntl(withRouter(withStyles(styleSheet)(AppShell)));