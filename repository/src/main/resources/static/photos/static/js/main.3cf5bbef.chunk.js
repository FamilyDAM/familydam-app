(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{177:function(e,t){},191:function(e,t,n){e.exports=n(502)},203:function(e,t){},209:function(e,t){},213:function(e,t,n){},501:function(e){e.exports={}},502:function(e,t,n){"use strict";n.r(t);var a=n(187),o=n(0),s=n.n(o),i=n(18),r=n.n(i),l=n(50),c=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function u(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}var p=n(186),h=n(543),d=n(183),g=n.n(d),f=n(184),m=n.n(f),b=n(185),v=n.n(b),w=(n(213),n(16)),k=n(22),y=n(51),O=n(47),j=n(52),C=n(136),x=n(75),E=n(14),M=n(541),S=n(57),T=n(532),N=n(505),A=n(534),L=n(533),U=n(506),R=n(535),P=n(147),W=n(178),B=n.n(W),I=n(152),G=n.n(I),H=n(32),D=n(139),V=n.n(D),F=function(){function e(t,n){Object(w.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.loadApps.bind(this))}return Object(k.a)(e,[{key:"loadApps",value:function(e){var t=this;V.a.get("/api/v1/core/clientapps").withCredentials().set("Accept","application/json").end(function(e,n){if(e)if(401===e.status)_.navigateTo.next("/");else if(403===e.status){var a={code:e.status,message:"Invalid Login (todo: show toast)"};t.sink.error(a)}else{console.dir(e);var o={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(o)}else t.sink.next({primaryApps:n.body.apps.primary,secondaryApps:n.body.apps.secondary})})}}]),e}(),J=new function e(){Object(w.a)(this,e),this.baseHost=new H.BehaviorSubject("http://localhost:9000"),this.basicUser=new H.BehaviorSubject(window.localStorage.getItem("u")),this.basicPwd=new H.BehaviorSubject(window.localStorage.getItem("p"))},Y=function(){function e(t,n){Object(w.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUser.bind(this))}return Object(k.a)(e,[{key:"getUser",value:function(e){var t=this,n=J.baseHost.getValue();fetch(n+"/logout",{method:"GET"}).then(function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).catch(function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}})}}]),e}(),_=new function e(){Object(w.a)(this,e),this.navigateTo=new H.Subject,this.logout={source:new H.Subject,sink:new H.Subject},this.loadClientApps={source:new H.Subject,sink:new H.Subject},this.loadClientAppsService=new F(this.loadClientApps.source,this.loadClientApps.sink),this.logoutService=new Y(this.logout.source,this.logout.sink)},q=function(e){function t(e,n){var a;return Object(w.a)(this,t),(a=Object(y.a)(this,Object(O.a)(t).call(this,e))).handleNavClick=a.handleNavClick.bind(Object(S.a)(a)),a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),_.logout.source.next(!0),_.navigateTo.next("://")}},{key:"findApp",value:function(e,t){if(t){var n=!0,a=!1,o=void 0;try{for(var s,i=t[Symbol.iterator]();!(n=(s=i.next()).done);n=!0){var r=s.value;if(r.slug===e)return r}}catch(l){a=!0,o=l}finally{try{n||null==i.return||i.return()}finally{if(a)throw o}}}return null}},{key:"render",value:function(){var e=this,t=this.props.classes,n=this.findApp("usermanager",this.props.secondaryApps);return s.a.createElement(N.a,{className:this.props.open?t.sidebarOpen:t.sidebarClosed},s.a.createElement(N.a,{className:this.props.open?t.sidebarUserInfo:t.sidebarUserInfoClosed},s.a.createElement("div",{className:t.sidebarProfileIcon},s.a.createElement(G.a,{style:{width:60,height:60}})),s.a.createElement("div",{className:t.sidebarProfileName},s.a.createElement(P.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),s.a.createElement("div",{className:t.sidebarButtons},s.a.createElement(T.a,{onClick:this.handleLogout},"Logout"),n&&s.a.createElement(T.a,{onClick:function(){return _.navigateTo.next(n.path)}},"Profile"))),s.a.createElement("div",{className:this.props.open?t.appListsOpen:t.appListsClosed},s.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},s.a.createElement(P.a,{type:"title",className:this.props.open?t.openLabel:t.closedLabel,style:{paddingLeft:"16px",paddingTop:"16px",gridColumn:"1",gridRow:"1"}},"Apps")),s.a.createElement(L.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map(function(n){return s.a.createElement(U.a,{button:!0,key:n.path,onClick:function(){return e.handleNavClick(n.path)}},s.a.createElement(A.a,{style:{marginRight:"8px"}},s.a.createElement(B.a,null)),s.a.createElement(R.a,{primary:n.label,secondary:"",className:e.props.open?t.openLabel:t.closedLabel}))})),s.a.createElement(L.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?t.closedLabel:t.openLabel},s.a.createElement(U.a,{button:!0,onClick:function(){return e.handleNavClick("://app-usermanager/index.html")}},s.a.createElement(A.a,null,s.a.createElement(G.a,{style:{width:48,height:48}}))))))}}]),t}(o.Component),z=Object(l.c)(Object(E.a)(function(e){return{sidebarOpen:{width:"240px",height:"100vh",background:"#fff"},sidebarClosed:{width:"72px",height:"100vh",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline"},closedLabel:{display:"none"}}})(q)),$=n(536),K=n(537),Q=n(538),X=n(540),Z=n(542),ee=n(539),te=n(180),ne=n.n(te),ae=n(179),oe=n.n(ae),se=function(e){function t(e,n){var a;return Object(w.a)(this,t),(a=Object(y.a)(this,Object(O.a)(t).call(this,e))).state={openMoreMenu:!1},a.handleToggle=a.handleToggle.bind(Object(S.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(S.a)(a)),a.handleLogout=a.handleLogout.bind(Object(S.a)(a)),a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleToggle",value:function(){this.props.onToggle&&this.props.onToggle()}},{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleMenuClose",value:function(){this.setState({openMoreMenu:!1})}},{key:"handleLogout",value:function(){window.localStorage.clear(),_.logout.source.next(!0),window.location="/"}},{key:"render2",value:function(){return s.a.createElement("div",null,"header")}},{key:"render",value:function(){var e=this,t=this.props.classes;return s.a.createElement($.a,{className:t.root,position:"static"},s.a.createElement(K.a,null,s.a.createElement(Q.a,{onClick:this.handleToggle,className:t.menuButton,color:"contrast","aria-label":"Menu"},s.a.createElement(oe.a,null)),s.a.createElement(P.a,{variant:"h5",color:"inherit",className:t.flex,onClick:function(){return e.handleNavClick("://home/index.html")}},"Family ",s.a.createElement("i",null,"D.A.M")),s.a.createElement(Q.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:t.moreButton},s.a.createElement(ne.a,null)),s.a.createElement(Z.a,{id:"long-menu",keepMounted:!0,anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},s.a.createElement(ee.a,{onClick:function(){e.handleLogout(),e.handleMenuClose()}},"Logout"),s.a.createElement(X.a,null),this.props.apps&&this.props.apps.map(function(t){return s.a.createElement(ee.a,{key:t.path,color:"contrast",onClick:function(){e.handleNavClick(t.path),e.handleMenuClose()}},t.label)}))))}}]),t}(o.Component),ie=Object(l.c)(Object(E.a)(function(e){return{root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20,color:"#ffffff"},moreButton:{color:"#ffffff"}}})(se)),re=function(e){function t(e,n){var a;Object(w.a)(this,t),a=Object(y.a)(this,Object(O.a)(t).call(this,e));var o=window.localStorage.getItem("AppShell.isOpen");return a.state={isMounted:!0,isOpen:o||!0},a.handleOpenCloseToggle=a.handleOpenCloseToggle.bind(Object(S.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(S.a)(a)),a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),_.navigateTo.takeWhile(function(){return e.state.isMounted}).subscribe(function(e){"://"!==e&&"://"===e.substring(0,3)?window.location.href=e.substring(2):this.props.history&&this.props.history.push(e)}.bind(this)),_.loadClientApps.sink.subscribe(function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})}),_.loadClientApps.source.next(!0)}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleOpenCloseToggle",value:function(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),_.logout.source.next(!0),_.navigateTo.next("://")}},{key:"render",value:function(){var e=this.props.classes;return s.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},s.a.createElement("header",{className:e.header},s.a.createElement(ie,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:function(e){return _.navigateTo.next(e)}})),s.a.createElement(z,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:function(e){return _.navigateTo.next(e)}}),s.a.createElement("div",{className:e.main},this.props.children))}}]),t}(o.Component),le=Object(l.c)(Object(E.a)(function(e){return{dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{background:"#eee"}}})(re)),ce=function(){function e(t,n){Object(w.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.listPhotos.bind(this))}return Object(k.a)(e,[{key:"listPhotos",value:function(e){var t=this,n=e.path,a=e.groupBy||"date:day",o=J.baseHost.getValue()+"/search",s=new FormData;s.append("path",n),s.append("type","dam:image"),s.append("limit",100),s.append("offset",0),s.append("group",a),s.append("order.field","dam:date.created"),s.append("order.direction","desc"),fetch(o,{method:"post",body:s}).then(function(e){return console.log("Search Success handler"),console.dir(e),e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).then(function(e){return e.json()}).then(function(e){var n=!0,a=!1,o=void 0;try{for(var s,i=e[Symbol.iterator]();!(n=(s=i.next()).done);n=!0){var r=s.value;r.src=r._links.self,r.thumbnail=r._links.thumb,r.thumbnailWidth=r.width,r.thumbnailHeight=r.height}}catch(l){a=!0,o=l}finally{try{n||null==i.return||i.return()}finally{if(a)throw o}}t.sink.next(e)}).catch(function(e){if(console.warn(e),401===e.status)_.navigateTo.next("/");else if(409===e.status)_.alert.next("User already exists");else if(403===e.status)_.alert.next("You do not have permission to add a new user");else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}})}}]),e}(),ue=new function e(){Object(w.a)(this,e),this.listPhotos={source:new H.Subject,sink:new H.Subject},this.listPhotosService=new ce(this.listPhotos.source,this.listPhotos.sink)},pe=n(7),he=n.n(pe),de=n(181),ge=n.n(de),fe=function(e){function t(e,n){var a;return Object(w.a)(this,t),(a=Object(y.a)(this,Object(O.a)(t).call(this,e,n))).state={},a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"componentDidMount",value:function(){this.setState({isMounted:!0})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function(e){this.props=e}},{key:"render",value:function(){var e=this.props.classes;return s.a.createElement("div",{className:e.imgGroup},s.a.createElement(P.a,null,this.props.photos.label),s.a.createElement(ge.a,{images:this.props.photos.children}))}}]),t}(o.Component);FileList.propTypes={photos:he.a.object.isRequired};var me=Object(x.f)(Object(E.a)(function(e){return{imgGroup:{display:"block",minHeight:"1px",width:"100%",border:"1px solid rgb(221, 221, 221)",overflow:"auto",padding:"24px"}}})(fe)),be=function(e){function t(e,n){var a;return Object(w.a)(this,t),(a=Object(y.a)(this,Object(O.a)(t).call(this,e))).state={isMounted:!0,isLoading:!0,path:"/content/files",photos:[]},a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isLoading:!0,isMounted:!0}),ue.listPhotos.sink.subscribe(function(t){var n={},a=e.state.photos.concat(t),o=!0,s=!1,i=void 0;try{for(var r,l=a[Symbol.iterator]();!(o=(r=l.next()).done);o=!0){var c=r.value;if(c["dam:date.created"])try{var u=c["dam:date.created"];if(!n[u=(u=new Date(Date.parse(u))).getYear()+1900+"-"+u.getMonth()+"-"+u.getDate()]){var p={};p.label=u,p.children=[],n[u]=p}n[u].children.push(c)}catch(g){}}}catch(g){s=!0,i=g}finally{try{o||null==l.return||l.return()}finally{if(s)throw i}}var h=[];for(var d in n)h.push(n[d]);h.sort(function(e,t){return e.label-t.label}),e.setState({isLoading:!1,photos:h})}),ue.listPhotos.source.next({path:this.state.path})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"render",value:function(){var e=this.props.classes;return this.state.isLoading?s.a.createElement(le,{user:this.props.user||{}},s.a.createElement(M.a,{className:e.progress,size:50})):s.a.createElement(le,{user:this.props.user||{}},this.state.photos.map(function(e){return s.a.createElement(me,{key:e.value,photos:e})}))}}]),t}(o.Component),ve=Object(l.c)(Object(x.f)(Object(E.a)(function(e){return{progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})(be))),we=function(){function e(t,n){Object(w.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUser.bind(this))}return Object(k.a)(e,[{key:"getUser",value:function(e){var t=this,n=J.baseHost.getValue();fetch(n+"/api/v1/auth/user/me",{method:"GET"}).then(function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).then(function(e){return e.json()}).then(function(e){e.firstName||(e.firstName=e.username),t.sink.next(e)}).catch(function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText||e.message};t.sink.error(n)}})}}]),e}(),ke=function(){function e(t,n,a){Object(w.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUsers.bind(this))}return Object(k.a)(e,[{key:"getUsers",value:function(){var e=this,t=J.baseHost.getValue();V.a.get(t+"/api/v1/auth/users").withCredentials().set("Accept","application/json").end(function(t,n){if(t)if(401===t.status)_.navigateTo.next("/");else{var a={code:t.status,status:t.statusText,message:t.responseText};e.sink.error(a)}else{for(var o=[],s=0;s<n.body.length;s++){var i=n.body[s];void 0===i.firstName&&(i.firstName=i.username),o.push(i)}var r=o.sort(function(e,t){return e.username>t.username?1:e.username<t.username?-1:0});e.sink.next(r)}})}}]),e}(),ye=new function e(){Object(w.a)(this,e),this.getUser={source:new H.Subject,sink:new H.Subject},this.getAllUsers={source:new H.Subject,sink:new H.Subject},this.getUserService=new we(this.getUser.source,this.getUser.sink),this.getAllUsersService=new ke(this.getAllUsers.source,this.getAllUsers.sink)},Oe=function(e){function t(e,n){var a;return Object(w.a)(this,t),(a=Object(y.a)(this,Object(O.a)(t).call(this,e,n))).state={context:n,locale:"en-EN",isAuthenticated:!1,isLoading:!1,isMounted:!0},a}return Object(j.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),ye.getUser.sink.takeWhile(function(){return e.state.isMounted}).subscribe(function(t){t&&e.setState({isAuthenticated:!0,user:t})})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"render",value:function(){var e=this;return s.a.createElement(l.a,{locale:"en-EN",key:"en-EN",messages:this.props.i18nMessages["en-EN"]},s.a.createElement(C.a,null,s.a.createElement(x.c,null,s.a.createElement(x.a,{path:"/",component:function(){return s.a.createElement(ve,{user:e.state.user})}}))))}}]),t}(o.Component),je=Object(E.a)(function(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})(Oe);Object(l.b)(n(500));var Ce={"en-EN":n(501)},xe=Object(p.a)({palette:{type:"light",primary:g.a,secondary:Object(a.a)({},m.a),error:v.a}});r.a.render(s.a.createElement(h.a,{theme:xe},s.a.createElement(je,{i18nMessages:Ce})),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/photos",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/photos","/service-worker.js");c?function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):u(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e):u(e)})}}()}},[[191,1,2]]]);
//# sourceMappingURL=main.3cf5bbef.chunk.js.map