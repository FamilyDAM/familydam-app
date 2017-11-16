import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {withStyles} from "material-ui/styles";


import Sidebar from '../sidebar/Sidebar';
import AppHeader from '../appheader/AppHeader';
import AppActions from '../../actions/AppActions';


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
        background:'#eee'
    },

});

class AppShell extends Component {


    constructor(props, context) {
        super(props);

        var isOpenCachedValue = window.localStorage.getItem("AppShell.isOpen");

        this.state = {
            isOpen:isOpenCachedValue ?isOpenCachedValue:true
        };

        this.handleOpenCloseToggle = this.handleOpenCloseToggle.bind(this);
        this.handleOpenMoreMenu = this.handleOpenMoreMenu.bind(this);
    }


    componentWillMount(){

        AppActions.loadClientApps.sink.subscribe( (data)=> {
            if( data ) {
                this.setState({
                    "primaryApps": data.primaryApps,
                    "secondaryApps": data.secondaryApps
                });
            }
        });
        AppActions.loadClientApps.source.next(true);
    }

    handleOpenMoreMenu(event){
        this.setState({ openMoreMenu: true, openMoreMenuAnchorEl: event.currentTarget });
    }

    handleOpenCloseToggle(){
        var val = !this.state.isOpen;
        this.setState({'isOpen':val});
        window.localStorage.setItem("AppShell.isOpen", val);
    }


    render() {
        var classes = this.props.classes;

        return (
            <div className={this.state.isOpen?classes.dashboardShellContainerOpen:classes.dashboardShellContainerClosed}>
                <header className={classes.header}>
                    <AppHeader
                        apps={this.state.secondaryApps}
                        onToggle={this.handleOpenCloseToggle}
                        onNavClick={(path)=>AppActions.navigateTo.next(path)}/>
                </header>


                <Sidebar
                    apps={this.state.primaryApps}
                    secondaryApps={this.state.secondaryApps}
                    open={this.state.isOpen}
                    onNavClick={(path)=>AppActions.navigateTo.next(path)}/>


                <div className={classes.main}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}

export default injectIntl(withStyles(styleSheet)(AppShell));