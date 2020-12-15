(this.webpackJsonphome=this.webpackJsonphome||[]).push([[0],{194:function(e,t,n){},442:function(e){e.exports=JSON.parse("{}")},443:function(e,t,n){"use strict";n.r(t);var a=n(179),o=n(0),i=n.n(o),s=n(21),r=n.n(s),l=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function registerValidSW(e){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var p=n(177),c=n(486),u=n(174),d=n.n(u),h=n(175),g=n.n(h),m=n(176),f=n.n(m),b=(n(194),n(28)),v=n(38),y=n(62),C=n(61),k=n(138),w=n(24),A=n(488),S=n(14),x=n(485),O=n(169),E=n(149),M=n(173),j=n.n(M),T=n(445),N=n(56),L=n(178),U=n(477),R=n(489),W=n(478),H=n(449),P=n(479),B=n(168),I=n.n(B),G=n(153),D=n.n(G),z=n(46),V=n(167),J=n.n(V),F=function(){function LoginService(e,t){Object(b.a)(this,LoginService),this.sink=void 0,this.sink=t,e.subscribe(this.loadApps.bind(this))}return Object(v.a)(LoginService,[{key:"loadApps",value:function loadApps(e){var t=this;J.a.get("/api/v1/core/clientapps").withCredentials().set("Accept","application/json").end((function(e,n){if(e)if(401===e.status)K.navigateTo.next("/");else if(403===e.status){var a={code:e.status,message:"Invalid Login (todo: show toast)"};t.sink.error(a)}else{console.dir(e);var o={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(o)}else t.sink.next({primaryApps:n.body.apps.primary,secondaryApps:n.body.apps.secondary})}))}}]),LoginService}(),$=new function AppSettings(){Object(b.a)(this,AppSettings),this.baseHost=new z.BehaviorSubject("localhost:8080"),this.basicUser=new z.BehaviorSubject(window.localStorage.getItem("u")),this.basicPwd=new z.BehaviorSubject(window.localStorage.getItem("p"))},q=function(){function LogoutService(e,t){Object(b.a)(this,LogoutService),this.sink=void 0,this.sink=t,e.subscribe(this.getUser.bind(this))}return Object(v.a)(LogoutService,[{key:"getUser",value:function getUser(e){var t=this,n=$.baseHost.getValue();fetch(n+"/logout",{method:"GET"}).then((function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e})).catch((function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}}))}}]),LogoutService}(),K=new function AppActions(){Object(b.a)(this,AppActions),this.navigateTo=new z.Subject,this.logout={source:new z.Subject,sink:new z.Subject},this.loadClientApps={source:new z.Subject,sink:new z.Subject},this.loadClientAppsService=new F(this.loadClientApps.source,this.loadClientApps.sink),this.logoutService=new q(this.logout.source,this.logout.sink)},Q=function(e){Object(y.a)(Sidebar,e);var t=Object(C.a)(Sidebar);function Sidebar(e,n){var a;return Object(b.a)(this,Sidebar),(a=t.call(this,e)).handleNavClick=a.handleNavClick.bind(Object(N.a)(a)),a}return Object(v.a)(Sidebar,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.apps!==this.props.apps||e.secondaryApps!==this.props.secondaryApps}},{key:"handleNavClick",value:function handleNavClick(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),K.logout.source.next(!0),window.location="/"}},{key:"findApp",value:function findApp(e,t){if(t){var n,a=Object(L.a)(t);try{for(a.s();!(n=a.n()).done;){var o=n.value;if(o.slug===e)return o}}catch(i){a.e(i)}finally{a.f()}}return null}},{key:"render",value:function render(){var e=this,t=this.props.classes,n=this.findApp("usermanager",this.props.secondaryApps);return i.a.createElement(T.a,{className:this.props.open?t.sidebarOpen:t.sidebarClosed},i.a.createElement(T.a,{className:this.props.open?t.sidebarUserInfo:t.sidebarUserInfoClosed},i.a.createElement("div",{className:t.sidebarProfileIcon},i.a.createElement(D.a,{style:{width:60,height:60}})),i.a.createElement("div",{className:t.sidebarProfileName},i.a.createElement(E.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),i.a.createElement("div",{className:t.sidebarButtons},i.a.createElement(U.a,{onClick:this.handleLogout},"Logout"),n&&i.a.createElement(U.a,{onClick:function onClick(){return K.navigateTo.next(n.path)}},"Profile"))),i.a.createElement("div",{className:this.props.open?t.appListsOpen:t.appListsClosed},i.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},i.a.createElement(E.a,{type:"title",className:this.props.open?t.openLabel:t.closedLabel,style:{paddingLeft:"16px",paddingTop:"16px",gridColumn:"1",gridRow:"1"}},"Apps")),i.a.createElement(W.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map((function(n){return i.a.createElement(H.a,{button:!0,key:n.path,onClick:function onClick(){return e.handleNavClick(n.path)}},i.a.createElement(R.a,{style:{marginRight:"8px"}},i.a.createElement(I.a,null)),i.a.createElement(P.a,{primary:n.label,primaryTypographyProps:{type:"body2"},className:e.props.open?t.openLabel:t.closedLabel}))}))),i.a.createElement(W.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?t.closedLabel:t.openLabel},i.a.createElement(H.a,{button:!0,onClick:function onClick(){return e.handleNavClick("://app-usermanager/index.html")}},i.a.createElement(R.a,null,i.a.createElement(D.a,{style:{width:48,height:48}}))))))}}]),Sidebar}(o.Component),X=Object(O.b)(Object(S.a)((function styleSheet(e){return{sidebarOpen:{width:"240px",height:"100vh",background:"#fff"},sidebarClosed:{width:"72px",height:"100vh",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline"},closedLabel:{display:"none"}}}))(Q)),Y=n(480),Z=n(481),_=n(482),ee=n(484),te=n(487),ne=n(483),ae=n(172),oe=n.n(ae),ie=n(171),se=n.n(ie),re=function(e){Object(y.a)(AppHeader,e);var t=Object(C.a)(AppHeader);function AppHeader(e,n){var a;return Object(b.a)(this,AppHeader),(a=t.call(this,e)).state={openMoreMenu:!1},a.handleToggle=a.handleToggle.bind(Object(N.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(N.a)(a)),a.handleLogout=a.handleLogout.bind(Object(N.a)(a)),a}return Object(v.a)(AppHeader,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.onToggle!==this.props.onToggle||e.apps!==this.props.apps||t.openMoreMenu!==this.state.openMoreMenu}},{key:"handleOpenMoreMenu",value:function handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleToggle",value:function handleToggle(){this.props.onToggle&&this.props.onToggle()}},{key:"handleNavClick",value:function handleNavClick(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleMenuClose",value:function handleMenuClose(){this.setState({openMoreMenu:!1})}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),K.logout.source.next(!0),window.location="/"}},{key:"render",value:function render(){var e=this,t=this.props.classes;return i.a.createElement(Y.a,{className:t.root,position:"static"},i.a.createElement(Z.a,null,i.a.createElement(_.a,{onClick:this.handleToggle,className:t.menuButton,color:"contrast","aria-label":"Menu"},i.a.createElement(se.a,null)),i.a.createElement(E.a,{variant:"h5",color:"inherit",className:t.flex,onClick:function onClick(){return e.handleNavClick("://home/index.html")}},"Family ",i.a.createElement("i",null,"D.A.M")),i.a.createElement(_.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:t.moreButton},i.a.createElement(oe.a,null)),i.a.createElement(te.a,{id:"long-menu",keepMounted:!0,anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},i.a.createElement(ne.a,{onClick:function onClick(){e.handleLogout(),e.handleMenuClose()}},"Logout"),i.a.createElement(ee.a,null),this.props.apps&&this.props.apps.map((function(t){return i.a.createElement(ne.a,{key:t.path,color:"contrast",onClick:function onClick(){e.handleNavClick(t.path),e.handleMenuClose()}},t.label)})))))}}]),AppHeader}(o.Component),le=Object(O.b)(Object(S.a)((function styleSheet(e){return{root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20,color:"#ffffff"},moreButton:{color:"#ffffff"}}}))(re)),pe=function(e){Object(y.a)(AppShell,e);var t=Object(C.a)(AppShell);function AppShell(e,n){var a;Object(b.a)(this,AppShell),a=t.call(this,e);var o=window.localStorage.getItem("AppShell.isOpen");return o||(o=void 0===e.open||e.open),a.state={isMounted:!0,isOpen:Boolean(o)},a.handleOpenCloseToggle=a.handleOpenCloseToggle.bind(Object(N.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(N.a)(a)),a}return Object(v.a)(AppShell,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.children!==this.props.children||t.isOpen!==this.state.isOpen||t.primaryApps!==this.state.primaryApps||t.secondaryApps!==this.state.secondaryApps}},{key:"componentWillMount",value:function componentWillMount(){var e=this;this.setState({isMounted:!0}),K.navigateTo.takeWhile((function(){return e.state.isMounted})).subscribe(function(e){"://"!==e&&"://"===e.substring(0,3)?window.location.href=e.substring(2):this.props.history&&this.props.history.push(e)}.bind(this)),K.loadClientApps.sink.subscribe((function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})})),K.loadClientApps.source.next(!0)}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"handleOpenMoreMenu",value:function handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleOpenCloseToggle",value:function handleOpenCloseToggle(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),K.logout.source.next(!0),K.navigateTo.next("://")}},{key:"render",value:function render(){var e=this.props.classes;return this.props.user?i.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},i.a.createElement("header",{className:e.header},i.a.createElement(le,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:function onNavClick(e){return K.navigateTo.next(e)}})),i.a.createElement(X,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:function onNavClick(e){return K.navigateTo.next(e)}}),i.a.createElement("div",{className:e.main},this.props.children)):i.a.createElement("div",null)}}]),AppShell}(o.Component),ce=Object(O.b)(Object(w.f)(Object(S.a)((function styleSheet(e){return{dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{fontSize:".5rem",background:"#eee"}}}))(pe))),ue=function(e){Object(y.a)(DashboardPage,e);var t=Object(C.a)(DashboardPage);function DashboardPage(e,n){var a;return Object(b.a)(this,DashboardPage),(a=t.call(this,e)).state={isMounted:!0},a}return Object(v.a)(DashboardPage,[{key:"componentWillMount",value:function componentWillMount(){var e=this;this.setState({isMounted:!0}),K.loadClientApps.sink.takeWhile((function(){return e.state.isMounted})).subscribe((function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})}))}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function componentWillReceiveProps(e,t){}},{key:"render",value:function render(){var e=this.props.classes;return this.state.isLoading?i.a.createElement("div",null,i.a.createElement(x.a,{className:e.progress,size:50})):i.a.createElement(ce,{user:this.props.user,history:this.props.history},i.a.createElement("div",{className:e.contentContainer},i.a.createElement("div",{className:e.contentHeader},i.a.createElement(E.a,{style:{fontSize:"24px",lineHeight:"24px"}},"Where would you like to start?")),this.state.primaryApps&&this.state.primaryApps.filter((function(e){return"home"!==e.slug})).map((function(t,n){return i.a.createElement(T.a,{key:t.path,"data-indx":n,className:e["contentAppCard"+n],onClick:function onClick(){return K.navigateTo.next(t.path)}},i.a.createElement(j.a,{style:{width:"48px",height:"48px"}}),i.a.createElement(E.a,{style:{fontSize:"24px"}},t.label))}))))}}]),DashboardPage}(o.Component),de=Object(O.b)(Object(w.f)(Object(S.a)((function styleSheet(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},contentContainer:{height:"100%",margin:"auto",display:"grid",gridGap:"24px",gridTemplateRows:"auto 125px 150px 150px auto",gridTemplateColumns:"auto 300px 300px auto",gridAutoFlow:"column"},contentHeader:{gridColumn:"2/4",gridRow:2,marginTop:"auto"},contentHeaderLabel:{fontSize:"96px",color:e.accentColor,lineHeight:"104px",textTransform:"capitalize"},contentAppCard0:{gridColumn:"2/3",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard1:{gridColumn:"3/4",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard2:{gridColumn:"2/3",gridRow:4,textAlign:"center",padding:"32px"},contentAppCard3:{gridColumn:"3/4",gridRow:4,textAlign:"center",padding:"32px"}}}))(ue))),he=new(function(){function GetUsersService(){Object(b.a)(this,GetUsersService),this.isLoading=new z.BehaviorSubject(!1),this.source=new z.Subject,this.sink=new z.Subject,this.source.subscribe(this.getUser.bind(this))}return Object(v.a)(GetUsersService,[{key:"getUser",value:function getUser(e){var t=this,n=$.baseHost.getValue()+"/core/api/user/"+e,a=new Headers;a.append("pragma","no-cache"),a.append("cache-control","no-cache"),this.isLoading.next(!0),fetch(n,{method:"GET",cache:"no-cache",headers:a}).then((function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e})).then((function(e){return e.json()})).then((function(e){t.sink.next(e)})).catch((function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText||e.message};t.sink.error(n)}}))}}]),GetUsersService}()),ge=function(e){Object(y.a)(App,e);var t=Object(C.a)(App);function App(e,n){var a;return Object(b.a)(this,App),(a=t.call(this,e,n)).state={context:n,locale:"en-EN",isMounted:!0,isAuthenticated:!1},a}return Object(v.a)(App,[{key:"componentDidMount",value:function componentDidMount(){var e=this;this.setState({isMounted:!0}),he.sink.subscribe((function(t){console.dir(t),console.log("UserActions.getUser.sink"),t?e.setState({user:t}):window.location="/index.html"})),he.source.next("me")}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"render",value:function render(){var e=this,t=this.props.classes,n="en-EN";return this.state.user?i.a.createElement(A.a,{locale:n,key:n,messages:this.props.i18nMessages[n]},i.a.createElement(k.a,null,i.a.createElement(w.c,null,i.a.createElement(w.a,{path:"/",component:function component(){return i.a.createElement(de,{user:e.state.user})}})))):i.a.createElement("div",null,i.a.createElement(x.a,{className:t.progress,size:50}))}}]),App}(o.Component),me=Object(S.a)((function styleSheet(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}}))(ge),fe={"en-EN":n(442)},be=Object(p.a)({palette:{type:"light",primary:d.a,secondary:Object(a.a)({},g.a),error:f.a}});!function renderApp(){r.a.render(i.a.createElement(c.a,{theme:be},i.a.createElement(me,{i18nMessages:fe})),document.getElementById("root"))}(),function register(){if("serviceWorker"in navigator){if(new URL("/home",window.location).origin!==window.location.origin)return;window.addEventListener("load",(function(){var e="".concat("/home","/service-worker.js");l?function checkValidServiceWorker(e){fetch(e).then((function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):registerValidSW(e)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(e):registerValidSW(e)}))}}()}},[[443,1,2]]]);
//# sourceMappingURL=main.7ca3b08f.chunk.js.map