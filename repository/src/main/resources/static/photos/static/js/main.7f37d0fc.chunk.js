(this["webpackJsonpapp-photos"]=this["webpackJsonpapp-photos"]||[]).push([[0],{225:function(e,t){},252:function(e,t,a){e.exports=a(595)},266:function(e,t){},272:function(e,t){},276:function(e,t,a){},594:function(e){e.exports=JSON.parse("{}")},595:function(e,t,a){"use strict";a.r(t);var s=a(242),o=a(3),n=a.n(o),i=a(224),r=a.n(i),l=a(52);const c=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function registerValidSW(e){navigator.serviceWorker.register(e).then(e=>{e.onupdatefound=()=>{const t=e.installing;t.onstatechange=()=>{"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(e=>{console.error("Error during service worker registration:",e)})}var p=a(241),h=a(635),d=a(240),u=a.n(d),m=a(190),g=a.n(m),b=a(191),f=a.n(b),v=(a(276),a(105)),w=a(85),x=a(13),C=a(59),S=a.n(C),E=a(95),k=a(77),y=a(634),T=a(28),M=a(226),I=a.n(M);var A=class LoadClientAppsService_LoginService{constructor(e,t){this.sink=void 0,this.sink=t,e.subscribe(this.loadApps.bind(this))}loadApps(e){I.a.get("/api/v1/core/clientapps").withCredentials().set("Accept","application/json").end((e,t)=>{if(e)if(401===e.status)j.navigateTo.next("/");else if(403===e.status){var a={code:e.status,message:"Invalid Login (todo: show toast)"};this.sink.error(a)}else{console.dir(e);var s={code:e.status,status:e.statusText,message:e.responseText};this.sink.error(s)}else this.sink.next({primaryApps:t.body.apps.primary,secondaryApps:t.body.apps.secondary})})}};var N=new class AppSettings_AppSettings{constructor(){this.baseHost=new T.BehaviorSubject("http://locaalhost:9000"),this.basicUser=new T.BehaviorSubject(window.localStorage.getItem("u")),this.basicPwd=new T.BehaviorSubject(window.localStorage.getItem("p"))}};var O=class LogoutService_LogoutService{constructor(e,t){this.sink=void 0,this.sink=t,e.subscribe(this.getUser.bind(this))}getUser(e){const t=N.baseHost.getValue();fetch(t+"/logout",{method:"GET"}).then(e=>(e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e)).catch(e=>{if(401===e.status||403===e.status)window.location="/";else{var t={code:e.status,status:e.statusText,message:e.responseText};this.sink.error(t)}})}};var j=new class AppActions_AppActions{constructor(){this.navigateTo=new T.Subject,this.logout={source:new T.Subject,sink:new T.Subject},this.loadClientApps={source:new T.Subject,sink:new T.Subject},this.loadClientAppsService=new A(this.loadClientApps.source,this.loadClientApps.sink),this.logoutService=new O(this.logout.source,this.logout.sink)}},L=a(624),P=a(188),R=a(640),U=a(625),_=a(600),W=a(626),D=a(136),B=a(125),G=a.n(B),F=a(192),H=a.n(F);class Sidebar_Sidebar extends o.Component{constructor(e,t){super(e),this.handleNavClick=this.handleNavClick.bind(this)}shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.apps!==this.props.apps||e.secondaryApps!==this.props.secondaryApps}handleNavClick(e){this.props.onNavClick&&this.props.onNavClick(e)}handleLogout(){window.localStorage.clear(),j.logout.source.next(!0),j.navigateTo.next("://")}findApp(e,t){if(t){var a,s=Object(k.a)(t);try{for(s.s();!(a=s.n()).done;){let t=a.value;if(t.slug===e)return t}}catch(o){s.e(o)}finally{s.f()}}return null}render(){var e=this.props.classes,t=this.findApp("usermanager",this.props.secondaryApps);return n.a.createElement(P.a,{className:this.props.open?e.sidebarOpen:e.sidebarClosed},n.a.createElement(P.a,{className:this.props.open?e.sidebarUserInfo:e.sidebarUserInfoClosed},n.a.createElement("div",{className:e.sidebarProfileIcon},n.a.createElement(H.a,{style:{width:60,height:60}})),n.a.createElement("div",{className:e.sidebarProfileName},n.a.createElement(D.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),n.a.createElement("div",{className:e.sidebarButtons},n.a.createElement(L.a,{onClick:this.handleLogout},"Logout"),t&&n.a.createElement(L.a,{onClick:()=>j.navigateTo.next(t.path)},"Profile"))),n.a.createElement("div",{className:this.props.open?e.appListsOpen:e.appListsClosed},n.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},n.a.createElement(D.a,{type:"title",className:this.props.open?e.openLabel:e.closedLabel,style:{paddingLeft:"16px",paddingTop:"16px",gridColumn:"1",gridRow:"1"}},"Apps")),n.a.createElement(U.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map(t=>n.a.createElement(_.a,{button:!0,key:t.path,onClick:()=>this.handleNavClick(t.path)},n.a.createElement(R.a,{style:{marginRight:"8px"}},n.a.createElement(G.a,null)),n.a.createElement(W.a,{primary:t.label,primaryTypographyProps:{type:"body2"},className:this.props.open?e.openLabel:e.closedLabel})))),n.a.createElement(U.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?e.closedLabel:e.openLabel},n.a.createElement(_.a,{button:!0,onClick:()=>this.handleNavClick("://app-usermanager/index.html")},n.a.createElement(R.a,null,n.a.createElement(H.a,{style:{width:48,height:48}}))))))}}var V=Object(l.c)(Object(x.a)(e=>({sidebarOpen:{width:"240px",height:"100vh",background:"#fff"},sidebarClosed:{width:"72px",height:"100vh",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline"},closedLabel:{display:"none"}}))(Sidebar_Sidebar)),z=a(627),$=a(628),J=a(629),Y=a(631),q=a(637),K=a(630),Q=a(228),X=a.n(Q),Z=a(227),ee=a.n(Z);class AppHeader_AppHeader extends o.Component{constructor(e,t){super(e),this.state={openMoreMenu:!1},this.handleToggle=this.handleToggle.bind(this),this.handleOpenMoreMenu=this.handleOpenMoreMenu.bind(this),this.handleLogout=this.handleLogout.bind(this)}shouldComponentUpdate(e,t){return e.onToggle!==this.props.onToggle||e.apps!==this.props.apps||t.openMoreMenu!==this.state.openMoreMenu}handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}handleToggle(){this.props.onToggle&&this.props.onToggle()}handleNavClick(e){this.props.onNavClick&&this.props.onNavClick(e)}handleMenuClose(){this.setState({openMoreMenu:!1})}handleLogout(){window.localStorage.clear(),j.logout.source.next(!0),window.location="/"}render(){var e=this.props.classes;return n.a.createElement(z.a,{className:e.root,position:"static"},n.a.createElement($.a,null,n.a.createElement(J.a,{onClick:this.handleToggle,className:e.menuButton,color:"contrast","aria-label":"Menu"},n.a.createElement(ee.a,null)),n.a.createElement(D.a,{variant:"h5",color:"inherit",className:e.flex,onClick:()=>this.handleNavClick("://home/index.html")},"Family ",n.a.createElement("i",null,"D.A.M")),n.a.createElement(J.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:e.moreButton},n.a.createElement(X.a,null)),n.a.createElement(q.a,{id:"long-menu",keepMounted:!0,anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},n.a.createElement(K.a,{onClick:()=>{this.handleLogout(),this.handleMenuClose()}},"Logout"),n.a.createElement(Y.a,null),this.props.apps&&this.props.apps.map(e=>n.a.createElement(K.a,{key:e.path,color:"contrast",onClick:()=>{this.handleNavClick(e.path),this.handleMenuClose()}},e.label)))))}}var te=Object(l.c)(Object(x.a)(e=>({root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20,color:"#ffffff"},moreButton:{color:"#ffffff"}}))(AppHeader_AppHeader));class AppShell_AppShell extends o.Component{constructor(e,t){super(e);var a=window.localStorage.getItem("AppShell.isOpen");a||(a=void 0===e.open||e.open),this.state={isMounted:!0,isOpen:Boolean(a)},this.handleOpenCloseToggle=this.handleOpenCloseToggle.bind(this),this.handleOpenMoreMenu=this.handleOpenMoreMenu.bind(this)}shouldComponentUpdate(e,t){return e.open!==this.props.open||e.user!==this.props.user||e.children!==this.props.children||t.isOpen!==this.state.isOpen||t.primaryApps!==this.state.primaryApps||t.secondaryApps!==this.state.secondaryApps}componentWillMount(){this.setState({isMounted:!0}),j.navigateTo.takeWhile(()=>this.state.isMounted).subscribe(function(e){"://"!==e&&"://"===e.substring(0,3)?window.location.href=e.substring(2):this.props.history&&this.props.history.push(e)}.bind(this)),j.loadClientApps.sink.subscribe(e=>{e&&this.setState({primaryApps:e.primaryApps,secondaryApps:e.secondaryApps})}),j.loadClientApps.source.next(!0)}componentWillUnmount(){this.setState({isMounted:!1})}handleOpenMoreMenu(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}handleOpenCloseToggle(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}handleLogout(){window.localStorage.clear(),j.logout.source.next(!0),j.navigateTo.next("://")}render(){var e=this.props.classes;return this.props.user?n.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},n.a.createElement("header",{className:e.header},n.a.createElement(te,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:e=>j.navigateTo.next(e)})),n.a.createElement(V,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:e=>j.navigateTo.next(e)}),n.a.createElement("div",{className:e.main},this.props.children)):n.a.createElement("div",null)}}var ae=Object(l.c)(Object(w.f)(Object(x.a)(e=>({dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{fontSize:".5rem",background:"#eee"}}))(AppShell_AppShell)));var se=class ListPhotosService_ListPhotosService{constructor(e,t){this.sink=void 0,this.sink=t,e.subscribe(this.listPhotos.bind(this))}listPhotos(e){const t=e.path,a=e.groupBy||"date:day";var s=N.baseHost.getValue()+"/search",o=new FormData;o.append("path",t),o.append("type","dam:image"),o.append("limit",1e3),o.append("offset",0),o.append("group",a),o.append("order.field","dam:date.created"),o.append("order.direction","desc"),fetch(s,{method:"post",body:o}).then(e=>(console.log("Image Search Success handler"),console.dir(e),e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e)).then(e=>e.json()).then(e=>{var t,a=Object(k.a)(e);try{for(a.s();!(t=a.n()).done;){const e=t.value;e.src=e._links.self,e.isSelected=!1,e.thumbnail=e._links.thumb,e.thumbnailWidth=e.width,e.thumbnailHeight=e.height}}catch(s){a.e(s)}finally{a.f()}this.sink.next(e)}).catch(e=>{if(console.warn(e),401===e.status)j.navigateTo.next("/");else if(409===e.status)j.alert.next("User already exists");else if(403===e.status)j.alert.next("You do not have permission to add a new user");else{var t={code:e.status,status:e.statusText,message:e.responseText};this.sink.error(t)}})}};var oe=class ListFoldersService_ListFoldersService{constructor(e,t){this.sink=void 0,this.sink=t,e.subscribe(this.listResults.bind(this))}listResults(e){const t=e.path,a=e.groupBy||"path";var s=N.baseHost.getValue()+"/search",o=new FormData;o.append("path",t),o.append("type","nt:folder"),o.append("limit",1e4),o.append("offset",0),o.append("group",a),o.append("order.field","name"),o.append("order.direction","asc"),fetch(s,{method:"post",body:o}).then(e=>(console.log("Folder Search Success handler"),console.dir(e),e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e)).then(e=>e.json()).then(e=>{var a={};a[t]={},a[t].children=[],a[t].name="Family",a[t].path=t;var s,o=Object(k.a)(e);try{for(o.s();!(s=o.n()).done;){const e=s.value,t=e.path.substr(0,e.path.lastIndexOf("/"));a[e.path]=e,a[e.path].parent=t,a[t]&&(a[t].children||(a[t].children=[]),a[t].children.push(a[e.path]))}}catch(n){o.e(n)}finally{o.f()}a[t].children=a[t].children.sort((function(e,t){return e.name>t.name?1:e.name<t.name?-1:0})),this.sink.next([a[t]])}).catch(e=>{if(console.warn(e),401===e.status)j.navigateTo.next("/");else if(409===e.status)j.alert.next("User already exists");else if(403===e.status)j.alert.next("You do not have permission to add a new user");else{var t={code:e.status,status:e.statusText,message:e.responseText};this.sink.error(t)}})}};var ne=new class PhotoActions_PhotoActions{constructor(){this.listFolders={source:new T.Subject,sink:new T.Subject},this.listPhotos={source:new T.Subject,sink:new T.Subject},this.listFoldersService=new oe(this.listFolders.source,this.listFolders.sink),this.listPhotosService=new se(this.listPhotos.source,this.listPhotos.sink)}},ie=a(7),re=a.n(ie),le=a(230),ce=a.n(le),pe=a(638),he=a(632),de=a(233),ue=a.n(de),me=a(231),ge=a.n(me),be=a(232),fe=a.n(be),ve=a(234),we=a.n(ve);class PhotoGroup_PhotoGroup extends o.Component{constructor(e,t){super(e,t),this.state={images:this.props.photos.children,showInfoModel:!1,showEditModel:!1,showDeleteModel:!1,selectedImage:null},this.onSelectImage=this.onSelectImage.bind(this),this.handleInfoClose=this.handleInfoClose.bind(this),this.handleEditClose=this.handleEditClose.bind(this),this.handleDeleteClose=this.handleDeleteClose.bind(this)}componentDidMount(){this.setState({isMounted:!0})}componentWillUnmount(){this.setState({isMounted:!1})}componentWillReceiveProps(e){this.props=e}onSelectImage(e,t){var a=this.state.images.slice(),s=a[e];s.hasOwnProperty("isSelected")&&(s.isSelected=!s.isSelected),this.setState({images:a}),this.props.onImageSelect(s)}handleInfo(e,t){this.setState({showInfoModel:!0,selectedImage:e})}handleInfoClose(){this.setState({showInfoModel:!1})}handleEdit(e,t){this.setState({showEditModel:!0,selectedImage:e})}handleEditClose(){this.setState({showEditModel:!1})}handleDelete(e,t){this.setState({showDeleteModel:!0,selectedImage:e})}handleDeleteClose(){this.setState({showDeleteModel:!1})}handleDownload(e,t){console.dir("Download: "+e+"="+t);var a=document.createElement("a");return document.body.appendChild(a),a.href=t,a.download=e,a.click(),!1}render(){const e=this.props.classes;var t=this.state.images.map(t=>(t.thumbnailCaption=n.a.createElement("div",null,n.a.createElement(J.a,{"aria-label":"info",className:e.margin,onClick:e=>{this.handleInfo(t.name,t.path)}},n.a.createElement(ge.a,{fontSize:"small"})),n.a.createElement(J.a,{"aria-label":"edit",className:e.margin,onClick:e=>{this.handleEdit(t.name,t.path)}},n.a.createElement(fe.a,{fontSize:"small"})),n.a.createElement(J.a,{"aria-label":"delete",className:e.margin,onClick:e=>{this.handleDelete(t.name,t.path)}},n.a.createElement(ue.a,{fontSize:"small"})),n.a.createElement(J.a,{"data-name":t.name,"data-image":t.path,"aria-label":"delete",className:e.margin,style:{float:"right"},onClick:e=>{this.handleDownload(t.name,t.path)}},n.a.createElement(we.a,{fontSize:"small"}))),t));return n.a.createElement("div",{className:e.imgGroup},n.a.createElement(D.a,null,this.props.photos.label),n.a.createElement(ce.a,{onSelectImage:this.onSelectImage,images:t,showLightboxThumbnails:!0,thumbnailWidth:"190px",margin:"4px"}),this.state.showInfoModel&&n.a.createElement(pe.a,{onClose:this.handleInfoClose,"aria-labelledby":"simple-dialog-title",open:!0},n.a.createElement(he.a,{id:"simple-dialog-title"},"Image Info: ",this.state.selectedImage)),this.state.showEditModel&&n.a.createElement(pe.a,{onClose:this.handleEditClose,"aria-labelledby":"simple-dialog-title",open:!0},n.a.createElement(he.a,{id:"simple-dialog-title"},"Image Edit: ",this.state.selectedImage)),this.state.showDeleteModel&&n.a.createElement(pe.a,{onClose:this.handleDeleteClose,"aria-labelledby":"simple-dialog-title",open:!0},n.a.createElement(he.a,{id:"simple-dialog-title"},"Image Delete: ",this.state.selectedImage)))}}FileList.propTypes={photos:re.a.object.isRequired};var xe=Object(w.f)(Object(x.a)(e=>({margin:{margin:"8px",padding:"0px"},imgGroup:{display:"block",minHeight:"1px",width:"100%",border:"1px solid rgb(221, 221, 221)",overflow:"auto",padding:"24px"},captionStyle:{backgroundColor:"rgba(0, 0, 0, 0.8)",maxHeight:"240px",overflow:"hidden",position:"absolute",bottom:"0",width:"100%",color:"white",padding:"2px",fontSize:"90%"},thumbnailSmall:{border:"5px solid red"}}))(PhotoGroup_PhotoGroup)),Ce=a(243),Se=a(235),Ee=a(633),ke=a(639),ye=a(236),Te=a.n(ye),Me=a(237),Ie=a.n(Me),Ae=a(238),Ne=a.n(Ae);const Oe=function LocalTreeItem(e){const t=Object(Se.a)(e.onClick);return n.a.createElement(StyledTreeItem,{onClick:()=>t.execute(e.node),nodeId:e.node.path,labelText:e.node.name,labelIcon:e.level<2?Te.a:G.a,classes:e.classes},e.node.children&&e.node.children.map(a=>n.a.createElement(LocalTreeItem,{onClick:t.execute,level:e.level+1,node:a,classes:e.classes})))};function StyledTreeItem(e){const t=e.classes,a=e.labelText,s=e.labelIcon,o=e.labelInfo,i=e.color,r=e.bgColor,l=Object(Ce.a)(e,["labelText","labelIcon","labelInfo","color","bgColor"]);return n.a.createElement(ke.a,Object.assign({label:n.a.createElement("div",{className:t.labelRoot},n.a.createElement(s,{color:"inherit",className:t.labelIcon}),n.a.createElement(D.a,{variant:"body2",className:t.labelText},a),n.a.createElement(D.a,{variant:"caption",color:"inherit"},o)),style:{"--tree-view-color":i,"--tree-view-bg-color":r},classes:{root:t.root,content:t.content,expanded:t.expanded,group:t.group,label:t.label}},l))}class FolderTree_FolderTree extends o.Component{constructor(e,t){super(e,t),this.state={},this.handleTreeItemClick=this.handleTreeItemClick.bind(this)}componentDidMount(){this.setState({isMounted:!0})}componentWillUnmount(){this.setState({isMounted:!1})}componentWillReceiveProps(e){this.props=e}handleTreeItemClick(e){console.log(e),this.props.onTreeClick(e)}render(){var e=this;const t=this.props.classes;return n.a.createElement("div",null,n.a.createElement(Ee.a,{className:t.root,defaultExpanded:[this.props.root],defaultCollapseIcon:n.a.createElement(Ie.a,null),defaultExpandIcon:n.a.createElement(Ne.a,null),defaultEndIcon:n.a.createElement("div",{style:{width:24}})},this.props.folders.map(a=>n.a.createElement(Oe,{onClick:function(){var t=Object(E.a)(S.a.mark((function _callee(t){return S.a.wrap((function _callee$(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,e.handleTreeItemClick(t);case 2:case"end":return a.stop()}}),_callee)})));return function(e){return t.apply(this,arguments)}}(),level:0,node:a,classes:t}))))}}FileList.propTypes={photos:re.a.object.isRequired};var je=Object(w.f)(Object(x.a)(e=>({root:{width:"100%",height:"auto",maxWidth:400,flexGrow:1},stylizedRoot:{color:e.palette.text.secondary,"&:focus > $content":{backgroundColor:"var(--tree-view-bg-color, ".concat(e.palette.grey[400],")"),color:"var(--tree-view-color)"}},content:{width:"auto",color:e.palette.text.secondary,borderTopRightRadius:e.spacing(2),borderBottomRightRadius:e.spacing(2),paddingRight:e.spacing(1),fontWeight:e.typography.fontWeightMedium,"$expanded > &":{fontWeight:e.typography.fontWeightRegular}},group:{marginLeft:"8px","& $content":{paddingLeft:e.spacing(2)}},expanded:{},label:{fontWeight:"inherit",color:"inherit"},labelRoot:{display:"flex",alignItems:"center",padding:e.spacing(.5,0)},labelIcon:{marginRight:e.spacing(1)},labelText:{fontWeight:"inherit",flexGrow:1}}))(FolderTree_FolderTree));class Breadcrumb_Breadcrumb extends o.Component{constructor(e,t){super(e),this.state={paths:[]}}componentDidMount(){this.parsePath(this.props.path)}componentWillUnmount(){this.currentPathSubscription&&this.currentPathSubscription.dispose()}componentWillReceiveProps(e){e.path&&this.parsePath(e.path)}shouldComponentUpdate(e,t){return e.path!==this.props.path}parsePath(e){for(var t=e.split("/"),a="",s=[],o=[],n=0;n<t.length;n++){var i=t[n];i.trim().length>0&&(a=a+"/"+i,o[n]=i,s.push({label:i,level:n,path:a,style:{color:n>2?"blue":"black",cursor:n>2?"pointer":"default"}}))}this.setState({paths:s})}render(){var e=this.props.classes;return n.a.createElement("div",null,n.a.createElement("ol",{className:e.breadcrumb},this.state.paths.map((function(t){return t.path?n.a.createElement("li",{className:e.li,key:t.path,style:t.style,onClick:()=>j.navigateTo.next(t.path)},t.label):n.a.createElement("li",{className:e.li,key:t.label},t.label)}))))}}var Le=Object(x.a)(e=>({breadcrumb:{backgroundColor:"transparent",listStyle:"none",padding:"0px"},li:{float:"left",margin:"0 0 10px 5px",color:"blue",cursor:"pointer","&:before":{content:'"/ "',color:"black"},"&:after":{content:'" "',color:"black"}}}))(Breadcrumb_Breadcrumb),Pe=a(239),Re=a.n(Pe);class HomePage_HomePage extends o.Component{constructor(e,t){super(e),this.state={isMounted:!0,isLoading:!0,root:"/content/files",path:"/content/files",photos:[],folders:[],selectedImages:[]},this.handleTreeClick=this.handleTreeClick.bind(this),this.handleSelectedImages=this.handleSelectedImages.bind(this)}componentWillMount(){this.setState({isLoading:!0,isMounted:!0}),ne.listFolders.sink.subscribe(e=>{this.setState({folders:e})}),ne.listPhotos.source.subscribe(e=>{this.setState({photos:[]})}),ne.listPhotos.sink.subscribe(e=>{let t={},a=e;var s,o=Object(k.a)(a);try{for(o.s();!(s=o.n()).done;){const e=s.value;if(e["dam:date.created"])try{var n=e["dam:date.created"];if(!t[n=(n=new Date(Date.parse(n))).getYear()+1900+"-"+n.getMonth()+"-"+n.getDate()]){var i={};i.label=n,i.children=[],t[n]=i}t[n].children.push(e)}catch(l){}}}catch(l){o.e(l)}finally{o.f()}let r=[];for(const c in t)r.push(t[c]);r.sort((e,t)=>e.label-t.label),this.setState({isLoading:!1,photos:r})}),ne.listFolders.source.next({path:this.state.root}),this.validatePath()}componentWillUnmount(){this.setState({isMounted:!1})}componentWillReceiveProps(e){this.props=e,this.validatePath()}validatePath(){let e=this.state.path;this.props.location.pathname&&this.props.location.pathname.startsWith(this.state.root)?(e=this.props.location.pathname,ne.listPhotos.source.next({path:e})):ne.listPhotos.source.next({path:this.state.root}),this.setState({path:e})}handleTreeClick(e){this.setState({path:e.path}),j.navigateTo.next(e.path)}handleSelectedImages(e){if(e.isSelected){(a=this.state.selectedImages).push(e),this.setState({selectedImage:a})}else{var t,a=[],s=Object(k.a)(this.state.selectedImages);try{for(s.s();!(t=s.n()).done;){const s=t.value;s!==e&&a.push(s)}}catch(o){s.e(o)}finally{s.f()}this.setState({selectedImages:a})}}render(){var e=this,t=this.props.classes;return this.state.isLoading?n.a.createElement(ae,{user:this.props.user||{},open:!1},n.a.createElement(y.a,{className:t.progress,size:50})):n.a.createElement(ae,{user:this.props.user||{},open:!1},n.a.createElement(Re.a,{color:"default",position:"static",elevation:0,className:t.fileGridAppBar,style:{colorDefault:"#eeeeee"}},n.a.createElement($.a,{className:t.toolbarContainer},n.a.createElement(J.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"menu"},n.a.createElement(G.a,null)),n.a.createElement(D.a,{variant:"h6",className:t.title},n.a.createElement(Le,{root:this.state.root,path:this.state.path})),n.a.createElement("div",null,n.a.createElement(L.a,{color:"inherit"},"Download"),n.a.createElement(L.a,{color:"inherit"},"Delete")))),n.a.createElement("div",{className:t.photoGrid},n.a.createElement("div",{className:t.photoSideBar},n.a.createElement(je,{root:this.state.root,folders:this.state.folders,onTreeClick:function(){var t=Object(E.a)(S.a.mark((function _callee(t){return S.a.wrap((function _callee$(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,e.handleTreeClick(t);case 2:case"end":return a.stop()}}),_callee)})));return function(e){return t.apply(this,arguments)}}()})),n.a.createElement("div",{className:t.photoGroups},this.state.photos.map(e=>n.a.createElement(xe,{onImageSelect:this.handleSelectedImages,key:e.value,photos:e})))))}}var Ue=Object(l.c)(Object(w.f)(Object(x.a)(e=>({progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},photoGrid:{display:"grid",gridTemplateColumns:"minmax(200px, 1fr) 4fr",gridTemplateRows:"auto"},photoSideBar:{backgroundColor:"#ffffff",gridColumn:"1/2",gridRows:"1/2",borderLeft:"1px solid #CCCCCC",margin:"16px"},photoGroups:{gridColumn:"2/3",gridRows:"1/2"},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}}))(HomePage_HomePage)));var _e=class GetUserService_GetUsersService{constructor(e,t){this.sink=void 0,this.sink=t,e.subscribe(this.getUser.bind(this))}getUser(e){const t=N.baseHost.getValue();fetch(t+"/api/v1/auth/user/me",{method:"GET"}).then(e=>(e.redirected&&(console.log("redirect to: "+e.url),window.location=e.url),e)).then(e=>e.json()).then(e=>{e.firstName||(e.firstName=e.username),this.sink.next(e)}).catch(e=>{if(401===e.status||403===e.status)window.location="/";else{var t={code:e.status,status:e.statusText,message:e.responseText||e.message};this.sink.error(t)}})}};var We=class GetAllUsersService_GetAllUsersService{constructor(e,t,a){this.sink=void 0,this.sink=t,e.subscribe(this.getUsers.bind(this))}getUsers(){var e=this;return Object(E.a)(S.a.mark((function _callee2(){var t,a,s,o;return S.a.wrap((function _callee2$(n){for(;;)switch(n.prev=n.next){case 0:return t=N.baseHost.getValue(),a=t+"/api/v1/auth/users",(s=new Headers).append("pragma","no-cache"),s.append("cache-control","no-cache"),n.next=7,fetch(a,{method:"GET",cache:"no-cache",headers:s}).then(function(){var e=Object(E.a)(S.a.mark((function _callee(e){return S.a.wrap((function _callee$(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.json());case 1:case"end":return t.stop()}}),_callee)})));return function(t){return e.apply(this,arguments)}}()).then(e=>{for(var t=[],a=0;a<e.length;a++){var s=e[a];void 0===s.firstName&&(s.firstName=s.username),t.push(s)}return t.sort((function(e,t){return e.username>t.username?1:e.username<t.username?-1:0}))}).catch(e=>{if(401===e.status||403===e.status)window.location="/";else{var t={code:e.status,status:e.statusText,message:e.responseText||e.message};console.warn(t),setTimeout(()=>{De.getAllUsers.source.next(!0)},500)}});case 7:(o=n.sent)&&e.sink.next(o);case 9:case"end":return n.stop()}}),_callee2)})))()}};var De=new class UserActions_UserActions{constructor(){this.getUser={source:new T.Subject,sink:new T.Subject},this.getAllUsers={source:new T.Subject,sink:new T.Subject},this.getUserService=new _e(this.getUser.source,this.getUser.sink),this.getAllUsersService=new We(this.getAllUsers.source,this.getAllUsers.sink)}};class App_App extends o.Component{constructor(e,t){super(e,t),this.state={context:t,locale:"en-EN",isAuthenticated:!1,isLoading:!1,isMounted:!0}}componentWillMount(){this.setState({isMounted:!0}),De.getUser.sink.takeWhile(()=>this.state.isMounted).subscribe(e=>{e?this.setState({user:e}):window.location="/index.html"}),De.getUser.source.next(null)}componentWillUnmount(){this.setState({isMounted:!1})}render(){return n.a.createElement(l.a,{locale:"en-EN",key:"en-EN",messages:this.props.i18nMessages["en-EN"]},n.a.createElement(v.a,null,n.a.createElement(w.c,null,n.a.createElement(w.a,{path:"/",component:()=>n.a.createElement(Ue,{user:this.state.user})}))))}}var Be=Object(x.a)(e=>({progress:{margin:"0 ".concat(e.spacing(2),"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}))(App_App);Object(l.b)(a(593));const Ge={"en-EN":a(594)},Fe=Object(p.a)({palette:{type:"light",primary:u.a,secondary:Object(s.a)({},g.a),error:f.a}});!function renderApp(){r.a.render(n.a.createElement(h.a,{theme:Fe},n.a.createElement(Be,{i18nMessages:Ge})),document.getElementById("root"))}(),function register(){if("serviceWorker"in navigator){if(new URL("/photos",window.location).origin!==window.location.origin)return;window.addEventListener("load",()=>{const e="".concat("/photos","/service-worker.js");c?function checkValidServiceWorker(e){fetch(e).then(t=>{404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(e=>{e.unregister().then(()=>{window.location.reload()})}):registerValidSW(e)}).catch(()=>{console.log("No internet connection found. App is running in offline mode.")})}(e):registerValidSW(e)})}}()}},[[252,1,2]]]);
//# sourceMappingURL=main.7f37d0fc.chunk.js.map