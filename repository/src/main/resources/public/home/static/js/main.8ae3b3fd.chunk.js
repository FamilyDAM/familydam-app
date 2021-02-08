(this.webpackJsonphome=this.webpackJsonphome||[]).push([[0],{258:function(e,t,n){},520:function(e){e.exports=JSON.parse("{}")},521:function(e,t,n){"use strict";n.r(t);var a=n(241),o=n(0),r=n.n(o),i=n(16),s=n.n(i),l=(n(257),n(238)),p=n(562),c=n(235),u=n.n(c),d=n(236),h=n.n(d),m=n(237),g=n.n(m),f=(n(258),n(42)),b=n(57),y=n(89),v=n(88),C=n(176),w=n(33),x=n(566),k=n(24),O=n(561),A=n(229),S=n(556),E=n(234),M=n.n(E),j=n(524),T=n(100),N=n(211),L=n(239),R=n(567),U=n(565),H=n(569),D=n(570),z=n(571),B=n(572),P=n(221),G=n.n(P),I=n(60),W=new function AppActions(){Object(f.a)(this,AppActions),this.navigateTo=new I.Subject,this.logout={source:new I.Subject,sink:new I.Subject}},_=function(e){Object(y.a)(Sidebar,e);var t=Object(v.a)(Sidebar);function Sidebar(){return Object(f.a)(this,Sidebar),t.apply(this,arguments)}return Object(b.a)(Sidebar,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.apps!==this.props.apps||e.secondaryApps!==this.props.secondaryApps}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),W.logout.source.next(!0),window.location="/index.html"}},{key:"findApp",value:function findApp(e,t){if(t){var n,a=Object(L.a)(t);try{for(a.s();!(n=a.n()).done;){var o=n.value;if(o.slug===e)return o}}catch(r){a.e(r)}finally{a.f()}}return null}},{key:"render",value:function render(){var e=this,t=this.props.classes,n=this.findApp("usermanager",this.props.secondaryApps);return r.a.createElement(j.a,{className:this.props.open?t.sidebarOpen:t.sidebarClosed},r.a.createElement(j.a,{className:this.props.open?t.sidebarUserInfo:t.sidebarUserInfoClosed},r.a.createElement("div",{className:t.sidebarProfileIcon},r.a.createElement(G.a,{style:{width:60,height:60}})),r.a.createElement("div",{className:t.sidebarProfileName},r.a.createElement(S.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),r.a.createElement("div",{className:t.sidebarButtons},r.a.createElement(R.a,{type:"link",onClick:this.handleLogout},"Logout"),n&&r.a.createElement(R.a,{type:"link",onClick:function onClick(){return window.location.href=n.path+"#/u/"+e.props.user.name+"/account"}},"Profile"))),r.a.createElement("div",{className:this.props.open?t.appListsOpen:t.appListsClosed},r.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},r.a.createElement("br",null)),r.a.createElement(U.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map((function(n){return r.a.createElement(U.a.Item,{key:n.path,onClick:function onClick(){return window.location.href=n.path}},"home"===n.slug&&r.a.createElement(R.a,{size:"large",shape:"circle",icon:r.a.createElement(H.a,{style:{marginRight:"0px"}})}),"files"===n.slug&&r.a.createElement(R.a,{size:"large",shape:"circle",icon:r.a.createElement(D.a,{style:{marginRight:"0px"}})}),"photos"===n.slug&&r.a.createElement(R.a,{size:"large",shape:"circle",icon:r.a.createElement(z.a,{style:{marginRight:"0px"}})}),r.a.createElement("span",{className:e.props.open?t.openLabel:t.closedLabel},n.label))}))),r.a.createElement(U.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?t.closedLabel:t.openLabel},"`    ",r.a.createElement(R.a,{size:"large",shape:"circle",icon:r.a.createElement(B.a,{style:{marginLeft:"0px",marginRight:"0px"}}),onClick:function onClick(){return window.location.href="/usermanager/index.html"}}),"`")))}}]),Sidebar}(o.Component),J=Object(A.b)(Object(k.a)((function styleSheet(e){return{sidebarOpen:{width:"240px",minHeight:"100vh",height:"100%",background:"#fff"},sidebarClosed:{width:"72px",minHeight:"100vh",height:"100%",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline",marginLeft:"10px",fontSize:"16px"},closedLabel:{display:"none"}}}))(_)),F=n(557),V=n(563),$=n(568),q=n(558),K=n(559),Q=n(560),X=n(232),Y=n.n(X),Z=n(231),ee=n.n(Z),te=function(e){Object(y.a)(AppHeader,e);var t=Object(v.a)(AppHeader);function AppHeader(e,n){var a;return Object(f.a)(this,AppHeader),(a=t.call(this,e)).handleButtonClick=function(e){},a.handleMenuClick=function(e){},a.state={openMoreMenu:!1},a.handleToggle=a.handleToggle.bind(Object(T.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(T.a)(a)),a.handleLogout=a.handleLogout.bind(Object(T.a)(a)),a}return Object(b.a)(AppHeader,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.onToggle!==this.props.onToggle||e.apps!==this.props.apps||t.openMoreMenu!==this.state.openMoreMenu}},{key:"handleOpenMoreMenu",value:function handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleToggle",value:function handleToggle(){this.props.onToggle&&this.props.onToggle()}},{key:"handleNavClick",value:function handleNavClick(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleMenuClose",value:function handleMenuClose(){this.setState({openMoreMenu:!1})}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),W.logout.source.next(!0),window.location="/"}},{key:"render",value:function render(){var e=this,t=this.props.classes;return r.a.createElement(F.a,{className:t.root,position:"static"},r.a.createElement(q.a,null,r.a.createElement(K.a,{onClick:this.handleToggle,className:t.menuButton,color:"secondary","aria-label":"Menu"},r.a.createElement(ee.a,null)),r.a.createElement(S.a,{variant:"h6",color:"inherit",className:t.flex,style:{fontWeight:"300"},onClick:function onClick(){return window.location="/home/index.html"}},"Family Data Manager"),r.a.createElement(K.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:t.moreButton},r.a.createElement(Y.a,null)),r.a.createElement(V.a,{id:"long-menu",keepMounted:!0,anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},r.a.createElement($.a,{onClick:function onClick(){e.handleLogout(),e.handleMenuClose()}},"Logout"),r.a.createElement(Q.a,null),this.props.apps&&this.props.apps.map((function(t){return r.a.createElement($.a,{key:t.path,color:"secondary",onClick:function onClick(){window.location=t.path,e.handleMenuClose()}},t.label)})))))}}]),AppHeader}(o.Component),ne=Object(A.b)(Object(k.a)((function styleSheet(e){return{root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20,color:"#ffffff"},moreButton:{color:"#ffffff"}}}))(te)),ae=n(202),oe=n.n(ae),re=n(233),ie=new function AppSettings(){Object(f.a)(this,AppSettings),this.baseHost=new I.BehaviorSubject(null)},se=new(function(){function LoadClientAppsService(){Object(f.a)(this,LoadClientAppsService),this.isLoading=new I.BehaviorSubject(!1),this.source=new I.Subject,this.sink=new I.Subject,this.source.subscribe(this.loadApps.bind(this))}return Object(b.a)(LoadClientAppsService,[{key:"loadApps",value:function(){var e=Object(re.a)(oe.a.mark((function _callee(e){var t,n,a,o,r,i,s,l,p;return oe.a.wrap((function _callee$(e){for(;;)switch(e.prev=e.next){case 0:return t=ie.baseHost.getValue()||"",n=t+"/api/v1/apps/",(a=new Headers).append("Accept","application/hal+json"),this.isLoading.next(!0),e.next=7,fetch(n,{method:"GET",cache:"no-cache",headers:a,credentials:"include"});case 7:return o=e.sent,e.next=10,o.json();case 10:r=e.sent,200==o.status&&r._embedded&&r._embedded.apps&&(i=[],s=[],r._embedded.apps.forEach((function(e){e.primary?i.push(e):s.push(e)})),l=i.sort((function(e,t){return e.order-t.order})),p=s.sort((function(e,t){return e.order-t.order})),this.sink.next({primaryApps:l,secondaryApps:p}));case 12:case"end":return e.stop()}}),_callee,this)})));return function loadApps(t){return e.apply(this,arguments)}}()}]),LoadClientAppsService}()),le=function(e){Object(y.a)(AppShell,e);var t=Object(v.a)(AppShell);function AppShell(e,n){var a;Object(f.a)(this,AppShell),a=t.call(this,e);var o=window.localStorage.getItem("AppShell.isOpen");return o||(o=void 0===e.open||e.open),a.state={isMounted:!0,isOpen:Boolean(o)},a.handleOpenCloseToggle=a.handleOpenCloseToggle.bind(Object(T.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(T.a)(a)),a}return Object(b.a)(AppShell,[{key:"shouldComponentUpdate",value:function shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.children!==this.props.children||t.isOpen!==this.state.isOpen||t.primaryApps!==this.state.primaryApps||t.secondaryApps!==this.state.secondaryApps}},{key:"componentDidMount",value:function componentDidMount(){var e=this;this.setState({isMounted:!0}),W.navigateTo.pipe(Object(N.a)((function(){return e.state.isMounted}))).subscribe(function(e){"://"!==e&&"://"===e.substring(0,3)?window.location.href=e.substring(2):this.props.history&&this.props.history.push(e)}.bind(this)),se.sink.pipe(Object(N.a)((function(){return e.state.isMounted}))).subscribe((function(t){t&&e.setState({primaryApps:t.primaryApps||[],secondaryApps:t.secondaryApps||[]})})),se.source.next(!0)}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"handleOpenMoreMenu",value:function handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleOpenCloseToggle",value:function handleOpenCloseToggle(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}},{key:"handleLogout",value:function handleLogout(){window.localStorage.clear(),W.logout.source.next(!0),W.navigateTo.next("://")}},{key:"render",value:function render(){var e=this.props.classes;return this.props.user?r.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},r.a.createElement("header",{className:e.header},r.a.createElement(ne,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:function onNavClick(e){return window.location=e}})),r.a.createElement(J,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:function onNavClick(e){return window.location=e}}),r.a.createElement("div",{className:e.main},this.props.children)):r.a.createElement("div",null)}}]),AppShell}(o.Component),pe=Object(A.b)(Object(w.f)(Object(k.a)((function styleSheet(e){return{dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{fontSize:".5rem",background:"#eee"}}}))(le))),ce=function(e){Object(y.a)(DashboardPage,e);var t=Object(v.a)(DashboardPage);function DashboardPage(e,n){var a;return Object(f.a)(this,DashboardPage),(a=t.call(this,e)).state={isMounted:!0},a}return Object(b.a)(DashboardPage,[{key:"componentDidMount",value:function componentDidMount(){var e=this;this.setState({isMounted:!0}),se.sink.takeWhile((function(){return e.state.isMounted})).subscribe((function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})}))}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"render",value:function render(){var e=this.props.classes;return this.state.isLoading?r.a.createElement("div",null,r.a.createElement(O.a,{className:e.progress,size:50})):r.a.createElement(pe,{user:this.props.user,history:this.props.history},r.a.createElement("div",{className:e.contentContainer},r.a.createElement("div",{className:e.contentHeader},r.a.createElement(S.a,{style:{fontSize:"24px",lineHeight:"24px"}},"Where would you like to start?")),this.state.primaryApps&&this.state.primaryApps.filter((function(e){return"home"!==e.slug})).map((function(t,n){return r.a.createElement(j.a,{key:t.path,"data-indx":n,className:e["contentAppCard"+n],onClick:function onClick(){return window.location.href=t.path}},r.a.createElement(M.a,{style:{width:"48px",height:"48px"}}),r.a.createElement(S.a,{style:{fontSize:"24px"}},t.label))}))))}}]),DashboardPage}(o.Component),ue=Object(A.b)(Object(w.f)(Object(k.a)((function styleSheet(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},contentContainer:{height:"100%",margin:"auto",display:"grid",gridGap:"24px",gridTemplateRows:"auto 125px 150px 150px auto",gridTemplateColumns:"auto 300px 300px auto",gridAutoFlow:"column"},contentHeader:{gridColumn:"2/4",gridRow:2,marginTop:"auto"},contentHeaderLabel:{fontSize:"96px",color:e.accentColor,lineHeight:"104px",textTransform:"capitalize"},contentAppCard0:{gridColumn:"2/3",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard1:{gridColumn:"3/4",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard2:{gridColumn:"2/3",gridRow:4,textAlign:"center",padding:"32px"},contentAppCard3:{gridColumn:"3/4",gridRow:4,textAlign:"center",padding:"32px"}}}))(ce))),de=new(function(){function GetUsersService(){Object(f.a)(this,GetUsersService),this.isLoading=new I.BehaviorSubject(!1),this.source=new I.Subject,this.sink=new I.Subject,this.source.subscribe(this.getUser.bind(this))}return Object(b.a)(GetUsersService,[{key:"getUser",value:function getUser(e){var t=this,n=(ie.baseHost.getValue()||"")+"/api/v1/auth/user/me",a=new Headers;a.append("pragma","no-cache"),a.append("cache-control","no-cache"),a.append("accept","application/json"),this.isLoading.next(!0),fetch(n,{method:"GET",mode:"cors",headers:a,credentials:"include"}).then((function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e})).then((function(e){return e.json()})).then((function(e){t.sink.next(e)})).catch((function(e){if(401===e.status||403===e.status)window.location="/";else{console.error(e.statusText);var n={code:e.status,status:e.statusText,message:e.responseText||e.message};t.sink.error(n)}}))}}]),GetUsersService}()),he=function(e){Object(y.a)(App,e);var t=Object(v.a)(App);function App(e,n){var a;return Object(f.a)(this,App),(a=t.call(this,e,n)).state={context:n,locale:"en-EN",isMounted:!0,isAuthenticated:!1},a}return Object(b.a)(App,[{key:"componentDidMount",value:function componentDidMount(){var e=this;this.setState({isMounted:!0}),de.sink.takeWhile((function(){return e.state.isMounted})).subscribe((function(t){t?e.setState({user:t}):window.location="/index.html"})),de.source.next(null)}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.setState({isMounted:!1})}},{key:"render",value:function render(){var e=this,t=this.props.classes,n="en-EN";return this.state.user?r.a.createElement(x.a,{locale:n,key:n,messages:this.props.i18nMessages[n]},r.a.createElement(C.a,null,r.a.createElement(w.c,null,r.a.createElement(w.a,{path:"/*",component:function component(){return r.a.createElement(ue,{user:e.state.user})}})))):r.a.createElement("div",null,r.a.createElement(O.a,{className:t.progress,size:50}))}}]),App}(o.Component),me=Object(k.a)((function styleSheet(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}}))(he),ge={"en-EN":n(520)},fe=Object(l.a)({palette:{type:"light",primary:u.a,secondary:Object(a.a)({},h.a),error:g.a}});!function renderApp(){s.a.render(r.a.createElement(p.a,{theme:fe},r.a.createElement(me,{i18nMessages:ge})),document.getElementById("root"))}()}},[[521,1,2]]]);
//# sourceMappingURL=main.8ae3b3fd.chunk.js.map