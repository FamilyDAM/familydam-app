(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{210:function(e,t){},228:function(e,t,n){e.exports=n(558)},240:function(e,t){},246:function(e,t){},250:function(e,t,n){},557:function(e){e.exports={}},558:function(e,t,n){"use strict";n.r(t);var a=n(209),o=n(0),i=n.n(o),s=n(19),r=n.n(s),l=n(55),c=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function u(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}var p=n(221),d=n(591),h=n(220),m=n.n(h),f=n(179),g=n.n(f),b=n(180),v=n.n(b),y=(n(250),n(15)),k=n(18),w=n(39),O=n(38),x=n(40),j=n(100),C=n(81),E=n(14),S=n(121),T=n.n(S),M=n(154),N=n(32),I=n(590),R=n(28),A=n(155),L=n.n(A),P=function(){function e(t,n){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.loadApps.bind(this))}return Object(k.a)(e,[{key:"loadApps",value:function(e){var t=this;L.a.get("/api/v1/core/clientapps").withCredentials().set("Accept","application/json").end(function(e,n){if(e)if(401===e.status)B.navigateTo.next("/");else if(403===e.status){var a={code:e.status,message:"Invalid Login (todo: show toast)"};t.sink.error(a)}else{console.dir(e);var o={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(o)}else t.sink.next({primaryApps:n.body.apps.primary,secondaryApps:n.body.apps.secondary})})}}]),e}(),U=new function e(){Object(y.a)(this,e),this.baseHost=new R.BehaviorSubject("http://localhost:9000"),this.basicUser=new R.BehaviorSubject(window.localStorage.getItem("u")),this.basicPwd=new R.BehaviorSubject(window.localStorage.getItem("p"))},W=function(){function e(t,n){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUser.bind(this))}return Object(k.a)(e,[{key:"getUser",value:function(e){var t=this,n=U.baseHost.getValue();fetch(n+"/logout",{method:"GET"}).then(function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).catch(function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}})}}]),e}(),B=new function e(){Object(y.a)(this,e),this.navigateTo=new R.Subject,this.logout={source:new R.Subject,sink:new R.Subject},this.loadClientApps={source:new R.Subject,sink:new R.Subject},this.loadClientAppsService=new P(this.loadClientApps.source,this.loadClientApps.sink),this.logoutService=new W(this.logout.source,this.logout.sink)},D=n(581),G=n(174),F=n(583),H=n(582),V=n(561),$=n(584),z=n(167),Y=n(118),q=n.n(Y),J=n(183),_=n.n(J),K=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e))).handleNavClick=a.handleNavClick.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),B.logout.source.next(!0),B.navigateTo.next("://")}},{key:"findApp",value:function(e,t){if(t){var n=!0,a=!1,o=void 0;try{for(var i,s=t[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var r=i.value;if(r.slug===e)return r}}catch(l){a=!0,o=l}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}}return null}},{key:"render",value:function(){var e=this,t=this.props.classes,n=this.findApp("usermanager",this.props.secondaryApps);return i.a.createElement(G.a,{className:this.props.open?t.sidebarOpen:t.sidebarClosed},i.a.createElement(G.a,{className:this.props.open?t.sidebarUserInfo:t.sidebarUserInfoClosed},i.a.createElement("div",{className:t.sidebarProfileIcon},i.a.createElement(_.a,{style:{width:60,height:60}})),i.a.createElement("div",{className:t.sidebarProfileName},i.a.createElement(z.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),i.a.createElement("div",{className:t.sidebarButtons},i.a.createElement(D.a,{onClick:this.handleLogout},"Logout"),n&&i.a.createElement(D.a,{onClick:function(){return B.navigateTo.next(n.path)}},"Profile"))),i.a.createElement("div",{className:this.props.open?t.appListsOpen:t.appListsClosed},i.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},i.a.createElement(z.a,{type:"title",className:this.props.open?t.openLabel:t.closedLabel,style:{paddingLeft:"16px",paddingTop:"16px",gridColumn:"1",gridRow:"1"}},"Apps")),i.a.createElement(H.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map(function(n){return i.a.createElement(V.a,{button:!0,key:n.path,onClick:function(){return e.handleNavClick(n.path)}},i.a.createElement(F.a,{style:{marginRight:"8px"}},i.a.createElement(q.a,null)),i.a.createElement($.a,{primary:n.label,secondary:"",className:e.props.open?t.openLabel:t.closedLabel}))})),i.a.createElement(H.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?t.closedLabel:t.openLabel},i.a.createElement(V.a,{button:!0,onClick:function(){return e.handleNavClick("://app-usermanager/index.html")}},i.a.createElement(F.a,null,i.a.createElement(_.a,{style:{width:48,height:48}}))))))}}]),t}(o.Component),Q=Object(l.c)(Object(E.a)(function(e){return{sidebarOpen:{width:"240px",height:"100vh",background:"#fff"},sidebarClosed:{width:"72px",height:"100vh",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline"},closedLabel:{display:"none"}}})(K)),X=n(585),Z=n(586),ee=n(587),te=n(589),ne=n(592),ae=n(588),oe=n(212),ie=n.n(oe),se=n(211),re=n.n(se),le=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e))).state={openMoreMenu:!1},a.handleToggle=a.handleToggle.bind(Object(N.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(N.a)(a)),a.handleLogout=a.handleLogout.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleToggle",value:function(){this.props.onToggle&&this.props.onToggle()}},{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleMenuClose",value:function(){this.setState({openMoreMenu:!1})}},{key:"handleLogout",value:function(){window.localStorage.clear(),B.logout.source.next(!0),window.location="/"}},{key:"render2",value:function(){return i.a.createElement("div",null,"header")}},{key:"render",value:function(){var e=this,t=this.props.classes;return i.a.createElement(X.a,{className:t.root,position:"static"},i.a.createElement(Z.a,null,i.a.createElement(ee.a,{onClick:this.handleToggle,className:t.menuButton,color:"contrast","aria-label":"Menu"},i.a.createElement(re.a,null)),i.a.createElement(z.a,{variant:"h5",color:"inherit",className:t.flex,onClick:function(){return e.handleNavClick("://home/index.html")}},"Family ",i.a.createElement("i",null,"D.A.M")),i.a.createElement(ee.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:t.moreButton},i.a.createElement(ie.a,null)),i.a.createElement(ne.a,{id:"long-menu",keepMounted:!0,anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},i.a.createElement(ae.a,{onClick:function(){e.handleLogout(),e.handleMenuClose()}},"Logout"),i.a.createElement(te.a,null),this.props.apps&&this.props.apps.map(function(t){return i.a.createElement(ae.a,{key:t.path,color:"contrast",onClick:function(){e.handleNavClick(t.path),e.handleMenuClose()}},t.label)}))))}}]),t}(o.Component),ce=Object(l.c)(Object(E.a)(function(e){return{root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20,color:"#ffffff"},moreButton:{color:"#ffffff"}}})(le)),ue=function(e){function t(e,n){var a;Object(y.a)(this,t),a=Object(w.a)(this,Object(O.a)(t).call(this,e));var o=window.localStorage.getItem("AppShell.isOpen");return o||(o=void 0===e.open||e.open),a.state={isMounted:!0,isOpen:Boolean(o)},a.handleOpenCloseToggle=a.handleOpenCloseToggle.bind(Object(N.a)(a)),a.handleOpenMoreMenu=a.handleOpenMoreMenu.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),B.navigateTo.takeWhile(function(){return e.state.isMounted}).subscribe(function(e){"://"!==e&&"://"===e.substring(0,3)?window.location.href=e.substring(2):this.props.history&&this.props.history.push(e)}.bind(this)),B.loadClientApps.sink.subscribe(function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})}),B.loadClientApps.source.next(!0)}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleOpenCloseToggle",value:function(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),B.logout.source.next(!0),B.navigateTo.next("://")}},{key:"render",value:function(){var e=this.props.classes;return this.props.user?i.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},i.a.createElement("header",{className:e.header},i.a.createElement(ce,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:function(e){return B.navigateTo.next(e)}})),i.a.createElement(Q,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:function(e){return B.navigateTo.next(e)}}),i.a.createElement("div",{className:e.main},this.props.children)):i.a.createElement("div",null)}}]),t}(o.Component),pe=Object(l.c)(Object(C.f)(Object(E.a)(function(e){return{dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{background:"#eee"}}})(ue))),de=function(){function e(t,n){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.listPhotos.bind(this))}return Object(k.a)(e,[{key:"listPhotos",value:function(e){var t=this,n=e.path,a=e.groupBy||"date:day",o=U.baseHost.getValue()+"/search",i=new FormData;i.append("path",n),i.append("type","dam:image"),i.append("limit",100),i.append("offset",0),i.append("group",a),i.append("order.field","dam:date.created"),i.append("order.direction","desc"),fetch(o,{method:"post",body:i}).then(function(e){return console.log("Image Search Success handler"),console.dir(e),e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).then(function(e){return e.json()}).then(function(e){var n=!0,a=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var r=i.value;r.src=r._links.self,r.isSelected=!1,r.thumbnail=r._links.thumb,r.thumbnailWidth=r.width,r.thumbnailHeight=r.height}}catch(l){a=!0,o=l}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}t.sink.next(e)}).catch(function(e){if(console.warn(e),401===e.status)B.navigateTo.next("/");else if(409===e.status)B.alert.next("User already exists");else if(403===e.status)B.alert.next("You do not have permission to add a new user");else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}})}}]),e}(),he=function(){function e(t,n){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.listResults.bind(this))}return Object(k.a)(e,[{key:"listResults",value:function(e){var t=this,n=e.path,a=e.groupBy||"path",o=U.baseHost.getValue()+"/search",i=new FormData;i.append("path",n),i.append("type","nt:folder"),i.append("limit",100),i.append("offset",0),i.append("group",a),i.append("order.field","name"),i.append("order.direction","asc"),fetch(o,{method:"post",body:i}).then(function(e){return console.log("Folder Search Success handler"),console.dir(e),e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).then(function(e){return e.json()}).then(function(e){var a={};a[n]={},a[n].children=[],a[n].name="Family",a[n].path=n;var o=!0,i=!1,s=void 0;try{for(var r,l=e[Symbol.iterator]();!(o=(r=l.next()).done);o=!0){var c=r.value,u=c.path.substr(0,c.path.lastIndexOf("/"));a[c.path]=c,a[c.path].parent=u,a[u]&&(a[u].children||(a[u].children=[]),a[u].children.push(a[c.path]))}}catch(p){i=!0,s=p}finally{try{o||null==l.return||l.return()}finally{if(i)throw s}}a[n].children=a[n].children.sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0}),t.sink.next([a[n]])}).catch(function(e){if(console.warn(e),401===e.status)B.navigateTo.next("/");else if(409===e.status)B.alert.next("User already exists");else if(403===e.status)B.alert.next("You do not have permission to add a new user");else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}})}}]),e}(),me=new function e(){Object(y.a)(this,e),this.listFolders={source:new R.Subject,sink:new R.Subject},this.listPhotos={source:new R.Subject,sink:new R.Subject},this.listFoldersService=new he(this.listFolders.source,this.listFolders.sink),this.listPhotosService=new de(this.listPhotos.source,this.listPhotos.sink)},fe=n(7),ge=n.n(fe),be=n(214),ve=n.n(be),ye=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e,n))).state={images:a.props.photos.children},a.onSelectImage=a.onSelectImage.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentDidMount",value:function(){this.setState({isMounted:!0})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function(e){this.props=e}},{key:"onSelectImage",value:function(e,t){var n=this.state.images.slice(),a=n[e];a.hasOwnProperty("isSelected")&&(a.isSelected=!a.isSelected),this.setState({images:n}),this.props.onImageSelect(a)}},{key:"render",value:function(){var e=this.props.classes,t=this.state.images.map(function(e){return e.thumbnailCaption=i.a.createElement("button",{key:"editImage",onClick:function(e){e.preventDefault(),console.log("todo:edit")}},"edit"),e});return i.a.createElement("div",{className:e.imgGroup},i.a.createElement(z.a,null,this.props.photos.label),i.a.createElement(ve.a,{onSelectImage:this.onSelectImage,images:t,showLightboxThumbnails:!0,customControls:[i.a.createElement("button",{key:"editImage",onClick:function(){return console.log("todo:edit")}},"edit"),i.a.createElement("button",{key:"deleteImage",onClick:function(){return console.log("todo:delete")}},"delete")]}))}}]),t}(o.Component);FileList.propTypes={photos:ge.a.object.isRequired};var ke=Object(C.f)(Object(E.a)(function(e){return{imgGroup:{display:"block",minHeight:"1px",width:"100%",border:"1px solid rgb(221, 221, 221)",overflow:"auto",padding:"24px"},captionStyle:{backgroundColor:"rgba(0, 0, 0, 0.8)",maxHeight:"240px",overflow:"hidden",position:"absolute",bottom:"0",width:"100%",color:"white",padding:"2px",fontSize:"90%"}}})(ye)),we=n(222),Oe=n(215),xe=n(593),je=n(594),Ce=n(216),Ee=n.n(Ce),Se=n(217),Te=n.n(Se),Me=n(218),Ne=n.n(Me),Ie=function e(t){var n=Object(Oe.useAsyncCallback)(t.onClick);return i.a.createElement(Re,{onClick:function(){return n.execute(t.node)},nodeId:t.node.path,labelText:t.node.name,labelIcon:t.level<2?Ee.a:q.a,classes:t.classes},t.node.children&&t.node.children.map(function(a){return i.a.createElement(e,{onClick:n.execute,level:t.level+1,node:a,classes:t.classes})}))};function Re(e){var t=e.classes,n=e.labelText,a=e.labelIcon,o=e.labelInfo,s=e.color,r=e.bgColor,l=Object(we.a)(e,["labelText","labelIcon","labelInfo","color","bgColor"]);return i.a.createElement(je.a,Object.assign({label:i.a.createElement("div",{className:t.labelRoot},i.a.createElement(a,{color:"inherit",className:t.labelIcon}),i.a.createElement(z.a,{variant:"body2",className:t.labelText},n),i.a.createElement(z.a,{variant:"caption",color:"inherit"},o)),style:{"--tree-view-color":s,"--tree-view-bg-color":r},classes:{root:t.root,content:t.content,expanded:t.expanded,group:t.group,label:t.label}},l))}var Ae=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e,n))).state={},a.handleTreeItemClick=a.handleTreeItemClick.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentDidMount",value:function(){this.setState({isMounted:!0})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function(e){this.props=e}},{key:"handleTreeItemClick",value:function(e){console.log(e),this.props.onTreeClick(e)}},{key:"render",value:function(){var e=this,t=this.props.classes;return i.a.createElement("div",null,i.a.createElement(xe.a,{className:t.root,defaultExpanded:[this.props.root],defaultCollapseIcon:i.a.createElement(Te.a,null),defaultExpandIcon:i.a.createElement(Ne.a,null),defaultEndIcon:i.a.createElement("div",{style:{width:24}})},this.props.folders.map(function(n){return i.a.createElement(Ie,{onClick:function(){var t=Object(M.a)(T.a.mark(function t(n){return T.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.handleTreeItemClick(n);case 2:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),level:0,node:n,classes:t})})))}}]),t}(o.Component);FileList.propTypes={photos:ge.a.object.isRequired};var Le=Object(C.f)(Object(E.a)(function(e){return{root:{height:"auto",maxHeight:"300px",flexGrow:1,maxWidth:400,width:"100%"},stylizedRoot:{color:e.palette.text.secondary,"&:focus > $content":{backgroundColor:"var(--tree-view-bg-color, ".concat(e.palette.grey[400],")"),color:"var(--tree-view-color)"}},content:{width:"auto",color:e.palette.text.secondary,borderTopRightRadius:e.spacing(2),borderBottomRightRadius:e.spacing(2),paddingRight:e.spacing(1),fontWeight:e.typography.fontWeightMedium,"$expanded > &":{fontWeight:e.typography.fontWeightRegular}},group:{marginLeft:"8px","& $content":{paddingLeft:e.spacing(2)}},expanded:{},label:{fontWeight:"inherit",color:"inherit"},labelRoot:{display:"flex",alignItems:"center",padding:e.spacing(.5,0)},labelIcon:{marginRight:e.spacing(1)},labelText:{fontWeight:"inherit",flexGrow:1}}})(Ae)),Pe=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e))).state={paths:[]},a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentDidMount",value:function(){this.parsePath(this.props.path)}},{key:"componentWillUnmount",value:function(){this.currentPathSubscription&&this.currentPathSubscription.dispose()}},{key:"componentWillReceiveProps",value:function(e){e.path&&this.parsePath(e.path)}},{key:"parsePath",value:function(e){for(var t=e.split("/"),n="",a=[],o=[],i=0;i<t.length;i++){var s=t[i];s.trim().length>0&&(n=n+"/"+s,o[i]=s,a.push({label:s,level:i,path:n,style:{color:i>2?"blue":"black",cursor:i>2?"pointer":"default"}}))}this.setState({paths:a})}},{key:"render",value:function(){var e=this.props.classes;return i.a.createElement("div",null,i.a.createElement("ol",{className:e.breadcrumb},this.state.paths.map(function(t){return t.path?i.a.createElement("li",{className:e.li,key:t.path,style:t.style,onClick:function(){return B.navigateTo.next(t.path)}},t.label):i.a.createElement("li",{className:e.li,key:t.label},t.label)})))}}]),t}(o.Component),Ue=Object(E.a)(function(e){return{breadcrumb:{backgroundColor:"transparent",listStyle:"none",padding:"0px"},li:{float:"left",margin:"0 0 10px 5px",color:"blue",cursor:"pointer","&:before":{content:'"/ "',color:"black"},"&:after":{content:'" "',color:"black"}}}})(Pe),We=n(219),Be=n.n(We),De=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e))).state={isMounted:!0,isLoading:!0,root:"/content/files",path:"/content/files",photos:[],folders:[],selectedImages:[]},a.handleTreeClick=a.handleTreeClick.bind(Object(N.a)(a)),a.handleSelectedImages=a.handleSelectedImages.bind(Object(N.a)(a)),a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isLoading:!0,isMounted:!0}),me.listFolders.sink.subscribe(function(t){e.setState({folders:t})}),me.listPhotos.sink.subscribe(function(t){var n={},a=e.state.photos.concat(t),o=!0,i=!1,s=void 0;try{for(var r,l=a[Symbol.iterator]();!(o=(r=l.next()).done);o=!0){var c=r.value;if(c["dam:date.created"])try{var u=c["dam:date.created"];if(!n[u=(u=new Date(Date.parse(u))).getYear()+1900+"-"+u.getMonth()+"-"+u.getDate()]){var p={};p.label=u,p.children=[],n[u]=p}n[u].children.push(c)}catch(m){}}}catch(m){i=!0,s=m}finally{try{o||null==l.return||l.return()}finally{if(i)throw s}}var d=[];for(var h in n)d.push(n[h]);d.sort(function(e,t){return e.label-t.label}),e.setState({isLoading:!1,photos:d})}),me.listFolders.source.next({path:this.state.root}),this.validatePath()}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function(e){this.props=e,this.validatePath()}},{key:"validatePath",value:function(){var e=this.state.path;this.props.location.pathname&&this.props.location.pathname.startsWith(this.state.root)&&(e=this.props.location.pathname),this.setState({path:e}),me.listPhotos.source.next({path:e})}},{key:"handleTreeClick",value:function(e){this.setState({path:e.path}),B.navigateTo.next(e.path)}},{key:"handleSelectedImages",value:function(e){if(e.isSelected){(t=this.state.selectedImages).push(e),this.setState({selectedImage:t})}else{var t=[],n=!0,a=!1,o=void 0;try{for(var i,s=this.state.selectedImages[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var r=i.value;r!==e&&t.push(r)}}catch(l){a=!0,o=l}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}this.setState({selectedImages:t})}}},{key:"render",value:function(){var e=this,t=this.props.classes;return this.state.isLoading?i.a.createElement(pe,{user:this.props.user||{},open:!1},i.a.createElement(I.a,{className:t.progress,size:50})):i.a.createElement(pe,{user:this.props.user||{},open:!1},i.a.createElement(Be.a,{color:"default",position:"static",elevation:0,className:t.fileGridAppBar,style:{colorDefault:"#eeeeee"}},i.a.createElement(Z.a,{className:t.toolbarContainer},i.a.createElement(ee.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"menu"},i.a.createElement(q.a,null)),i.a.createElement(z.a,{variant:"h6",className:t.title},i.a.createElement(Ue,{root:this.state.root,path:this.state.path})),i.a.createElement(D.a,{color:"inherit"},"Download"))),i.a.createElement("div",{className:t.photoGrid},i.a.createElement("div",{className:t.photoSideBar},i.a.createElement(Le,{root:this.state.root,folders:this.state.folders,onTreeClick:function(){var t=Object(M.a)(T.a.mark(function t(n){return T.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.handleTreeClick(n);case 2:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()})),i.a.createElement("div",{className:t.photoGroups},this.state.photos.map(function(t){return i.a.createElement(ke,{onImageSelect:e.handleSelectedImages,key:t.value,photos:t})}))))}}]),t}(o.Component),Ge=Object(l.c)(Object(C.f)(Object(E.a)(function(e){return{progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},photoGrid:{display:"grid",gridTemplateColumns:"minmax(200px, 1fr) 4fr",gridTemplateRows:"auto"},photoSideBar:{backgroundColor:"#ffffff",gridColumn:"1/2",gridRows:"1/2",borderLeft:"1px solid #CCCCCC",margin:"16px"},photoGroups:{gridColumn:"2/3",gridRows:"1/2"},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}}})(De))),Fe=function(){function e(t,n){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUser.bind(this))}return Object(k.a)(e,[{key:"getUser",value:function(e){var t=this,n=U.baseHost.getValue();fetch(n+"/api/v1/auth/user/me",{method:"GET"}).then(function(e){return e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e}).then(function(e){return e.json()}).then(function(e){e.firstName||(e.firstName=e.username),t.sink.next(e)}).catch(function(e){if(401===e.status||403===e.status)window.location="/";else{var n={code:e.status,status:e.statusText,message:e.responseText||e.message};t.sink.error(n)}})}}]),e}(),He=function(){function e(t,n,a){Object(y.a)(this,e),this.sink=void 0,this.sink=n,t.subscribe(this.getUsers.bind(this))}return Object(k.a)(e,[{key:"getUsers",value:function(){var e=this,t=U.baseHost.getValue();L.a.get(t+"/api/v1/auth/users").withCredentials().set("Accept","application/json").end(function(t,n){if(t)if(401===t.status)B.navigateTo.next("/");else{var a={code:t.status,status:t.statusText,message:t.responseText};e.sink.error(a)}else if(n.body){for(var o=[],i=0;i<n.body.length;i++){var s=n.body[i];void 0===s.firstName&&(s.firstName=s.username),o.push(s)}var r=o.sort(function(e,t){return e.username>t.username?1:e.username<t.username?-1:0});e.sink.next(r)}})}}]),e}(),Ve=new function e(){Object(y.a)(this,e),this.getUser={source:new R.Subject,sink:new R.Subject},this.getAllUsers={source:new R.Subject,sink:new R.Subject},this.getUserService=new Fe(this.getUser.source,this.getUser.sink),this.getAllUsersService=new He(this.getAllUsers.source,this.getAllUsers.sink)},$e=function(e){function t(e,n){var a;return Object(y.a)(this,t),(a=Object(w.a)(this,Object(O.a)(t).call(this,e,n))).state={context:n,locale:"en-EN",isAuthenticated:!1,isLoading:!1,isMounted:!0},a}return Object(x.a)(t,e),Object(k.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),Ve.getUser.sink.takeWhile(function(){return e.state.isMounted}).subscribe(function(t){t?e.setState({user:t}):window.location="/index.html"}),Ve.getUser.source.next(null)}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"render",value:function(){var e=this;return i.a.createElement(l.a,{locale:"en-EN",key:"en-EN",messages:this.props.i18nMessages["en-EN"]},i.a.createElement(j.a,null,i.a.createElement(C.c,null,i.a.createElement(C.a,{path:"/",component:function(){return i.a.createElement(Ge,{user:e.state.user})}}))))}}]),t}(o.Component),ze=Object(E.a)(function(e){return{progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})($e);function Ye(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}Object(l.b)(n(556));var qe={"en-EN":n(557)},Je=Object(p.a)({palette:{type:"light",primary:m.a,secondary:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Ye(n,!0).forEach(function(t){Object(a.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ye(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},g.a),error:v.a}});r.a.render(i.a.createElement(d.a,{theme:Je},i.a.createElement(ze,{i18nMessages:qe})),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/photos",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/photos","/service-worker.js");c?function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):u(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e):u(e)})}}()}},[[228,1,2]]]);
//# sourceMappingURL=main.9774c00e.chunk.js.map