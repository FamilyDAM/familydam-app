(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{205:function(e,t){},221:function(e,t,a){e.exports=a(624)},233:function(e,t){},239:function(e,t){},244:function(e,t,a){},623:function(e){e.exports={}},624:function(e,t,a){"use strict";a.r(t);var n=a(219),s=a(0),i=a.n(s),r=a(57),o=a.n(r),l=a(39),c=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function u(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}var d=a(29),p=a(218),h=a.n(p),m=a(165),g=a.n(m),f=a(166),b=a.n(f),v=(a(244),a(14)),w=a(18),y=a(30),k=a(28),C=a(31),E=a(627),O=a(629),j=a(626),x=a(75),S=a.n(x),N=a(16),A=a(206),T=a.n(A),L=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={timestamp:(new Date).getTime()},n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentDidMount",value:function(){this.timer=setInterval(this.tick,1e3)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timer)}},{key:"tick",value:function(){}},{key:"render",value:function(){var e=this.props.classes;return i.a.createElement("div",null,i.a.createElement("div",{className:e.timestamp},T()().format("h:mm:ss a")))}}]),t}(s.Component),M=Object(d.withStyles)(function(e){return{timestamp:{position:"absolute",bottom:"15px",left:"20px",fontSize:"48px",color:"#fff",opacity:".7"}}})(L),U=a(59),R=a.n(U),P=a(80),I=a.n(P),W=a(91),F=a.n(W),V=a(77),B=a.n(V),z=a(55),G=a.n(z),_=a(113),H=a.n(_),q=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).handleClick=n.handleClick.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"handleClick",value:function(e){console.log("loading button click"),this.props.onClick?this.props.onClick(e):console.dir(this.props)}},{key:"render",value:function(){var e=this.props.classes,t={minWidth:"40px",color:"#fff"};return this.props.isLoading&&(t.paddingLeft="16px"),i.a.createElement(I.a,{variant:"contained",color:"primary",style:{height:"25px",padding:"0px 16px"},onClick:this.handleClick},this.props.isLoading&&i.a.createElement(S.a,{className:e.progress,color:"#fff",size:25}),i.a.createElement(G.a,{style:t},this.props.label))}}]),t}(s.Component),D=Object(l.d)(Object(d.withStyles)(function(e){return{progress:{}}})(q)),J=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={user:{firstName:"",lastName:"",email:""},password:"",mode:"minimal",isLoading:!1},n.handleSelect=n.handleSelect.bind(Object(N.a)(Object(N.a)(n))),n.handleCancel=n.handleCancel.bind(Object(N.a)(Object(N.a)(n))),n.handleLogin=n.handleLogin.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentWillMount",value:function(){this.setState({isLoading:!1})}},{key:"componentDidMount",value:function(){this.refs.pwdField&&this.refs.pwdField.focus()}},{key:"handleCancel",value:function(){this.setState({mode:"minimal",isLoading:!1}),this.props.onCancel&&this.props.onCancel()}},{key:"handleLogin",value:function(){this.setState({isLoading:!0}),this.props.onLogin&&this.props.onLogin(this.props.user.username,this.state.password)}},{key:"handleSelect",value:function(){this.setState({mode:"extended"}),this.props.onSelect&&this.props.onSelect(this.props.user)}},{key:"render",value:function(){var e=this,t=this.props.classes;return"minimal"===this.state.mode?i.a.createElement(R.a,{style:{width:"150px",height:"176px"}},i.a.createElement(F.a,{focusRipple:!0,onClick:this.handleSelect,style:{width:"100%",backgroundColor:"#fff"}},i.a.createElement(H.a,{style:{width:120,height:120}})),i.a.createElement(F.a,{focusRipple:!0,onClick:this.handleSelect,style:{width:"100%",backgroundColor:"#fff"}},i.a.createElement("h2",{style:{textAlign:"center"}},this.props.user.firstName))):i.a.createElement(R.a,{style:{width:"450px",height:"200px"}},i.a.createElement("div",{className:t.extendedContainer},i.a.createElement("div",{style:{gridRow:"2/5",gridColumn:"1",textAlign:"center"}},i.a.createElement(H.a,{style:{width:120,height:120}})),i.a.createElement("div",{style:{gridRow:"2",gridColumn:"2"}},i.a.createElement(G.a,{type:"title",style:{textAlign:"left"}},this.props.user.firstName)),i.a.createElement("div",{style:{gridRow:"3",gridColumn:"2"}},i.a.createElement(B.a,{type:"password",label:"Password",required:!0,style:{width:"100%"},value:this.state.password,onChange:function(t){e.setState({password:t.target.value})}})),i.a.createElement("div",{style:{gridRow:"4",gridColumn:"2"}},i.a.createElement(I.a,{color:"primary",onClick:this.handleCancel},"Cancel"),i.a.createElement(D,{isLoading:this.state.isLoading,label:"Login",onClick:this.handleLogin}))))}}]),t}(s.Component),Y=Object(d.withStyles)(function(e){return{personalCard:{border:"1px solid"},extendedContainer:{display:"grid",gridGap:"16px",gridTemplateColumn:"125px auto auto auto",gridTemplateRows:"16px auto auto auto auto 16px"}}})(J),$=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={selectedUser:null},n.handleLogin=n.handleLogin.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentDidMount",value:function(){this.refs.pwdField&&this.refs.pwdField.focus()}},{key:"handleLogin",value:function(e,t){this.props.onLogin&&this.props.onLogin(e,t)}},{key:"handleSelect",value:function(e){this.props.onSelect(this.props.user)}},{key:"render",value:function(){var e=this,t=this.props.classes,a=[];return this.props.users&&(a=this.props.users,null!==this.state.selectedUser&&(a=a.filter(function(t){return t.username===e.state.selectedUser.username}))),i.a.createElement("div",{className:t.outerContainer},i.a.createElement("div",{style:{gridColumn:"2/3",gridRow:"2/3"}},i.a.createElement("div",{className:t.loginGrids},a.map(function(a){return i.a.createElement("div",{key:a.username,className:t.loginCardItem},i.a.createElement(Y,{user:a,onLogin:e.handleLogin,onCancel:function(t){return e.setState({selectedUser:null})},onSelect:function(t){return e.setState({selectedUser:t})}}))}))))}}]),t}(s.Component),K=Object(d.withStyles)(function(e){return{outerContainer:{display:"grid",gridGap:"24px",gridTemplateRows:"1fr auto 1fr",gridTemplateColumns:"1fr auto 1fr"},loginGrids:{display:"grid",gridGap:"32px",gridAutoFlow:"column",gridTemplateRows:"repeat(2, 1fr)"},loginCardItem:{}}})($),Q=a(40),X=a(65),Z=a.n(X),ee=function(){function e(t,a){Object(v.a)(this,e),this.sink=void 0,this.sink=a,t.subscribe(this.loadApps.bind(this))}return Object(w.a)(e,[{key:"loadApps",value:function(e){var t=this,a=window.localStorage.getItem("u"),n=window.localStorage.getItem("p");Z.a.get("/api/v1/core/clientapps").withCredentials().set("Accept","application/json").set("Authorization","user "+a+":"+n).end(function(e,a){if(e)if(401===e.status)te.navigateTo.next("/");else if(403===e.status){var n={code:e.status,message:"Invalid Login (todo: show toast)"};t.sink.error(n)}else{console.dir(e);var s={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(s)}else t.sink.next({primaryApps:a.body.apps.primary,secondaryApps:a.body.apps.secondary})})}}]),e}(),te=new function e(){Object(v.a)(this,e),this.logout={source:new Q.Subject,sink:new Q.Subject},this.navigateTo=new Q.Subject,this.loadClientApps={source:new Q.BehaviorSubject,sink:new Q.BehaviorSubject},this.loadClientAppsService=new ee(this.loadClientApps.source,this.loadClientApps.sink)},ae=new function e(){Object(v.a)(this,e),this.baseHost=new Q.BehaviorSubject(""),this.basicUser=new Q.BehaviorSubject(window.localStorage.getItem("u")),this.basicPwd=new Q.BehaviorSubject(window.localStorage.getItem("p"))},ne=function(){function e(t,a,n){Object(v.a)(this,e),this.sink=void 0,this.sink=a,this.getUserSource=n,t.subscribe(this.login.bind(this))}return Object(w.a)(e,[{key:"login",value:function(e){var t=this,a=ae.baseHost.getValue()+"/j_security_check?";Z.a.post(a).type("form").send("j_username="+e.username).send("j_password="+e.password).send("j_validate=true").send("form.auth.timeout:120").send("form.onexpire.login:true").end(function(a,n){if(a)if(401===a.status)te.navigateTo.next("/");else if(403===a.status){var s={code:a.status,message:"Invalid Login (todo: show toast)"};t.sink.error(s)}else{console.dir(a);var i={code:a.status,status:a.statusText,message:a.responseText};t.sink.error(i)}else console.log("LoginService Security Check: SUCCESS"),window.localStorage.setItem("user",JSON.stringify(e)),oe.getUser.source.next(e.username),ae.basicUser.next(e.username),ae.basicPwd.next(e.password),window.localStorage.setItem("u",e.username),window.localStorage.setItem("p",e.password)})}}]),e}(),se=function(){function e(t,a){Object(v.a)(this,e),this.sink=void 0,this.sink=a,t.subscribe(function(e){this.createUser(e)}.bind(this))}return Object(w.a)(e,[{key:"createUser",value:function(e){var t=this;e.username||(e.username=e.userProps.firstName.toLowerCase()),e.username;var a={":name":e.username,pwd:e.password,pwdConfirm:e.password,firstName:e.userProps.firstName,lastName:e.userProps.lastName,email:e.userProps.email,isFamilyAdmin:e.isFamilyAdmin},n=ae.baseHost.getValue(),s=ae.basicUser.getValue(),i=ae.basicPwd.getValue();Z.a.post(n+"/api/familydam/v1/dashboard/user/create").send(a).withCredentials().set("Accept","application/json").set("Authorization","user "+s+":"+i).end(function(e,a){if(e)if(401===e.status)te.navigateTo.next("/");else if(409===e.status)te.alert.next("User already exists");else if(403===e.status)te.alert.next("You do not have permission to add a new user");else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}else t.sink.next(!0)})}}]),e}(),ie=function(){function e(t,a){Object(v.a)(this,e),this.sink=void 0,this.sink=a,t.subscribe(this.getUsers.bind(this))}return Object(w.a)(e,[{key:"getUsers",value:function(e){var t=this,a=ae.baseHost.getValue(),n=ae.basicUser.getValue(),s=ae.basicPwd.getValue();Z.a.get(a+"/api/v1/core/user/"+e).withCredentials().set("Accept","application/json").set("Authorization","user "+n+":"+s).end(function(e,a){if(e)if(console.log("getUserService: ERROR"),console.dir(e),401===e.status)te.navigateTo.next("/");else{var n={code:e.status,status:e.statusText,message:e.responseText};t.sink.error(n)}else{console.log("getUserService: SUCCESS"),console.dir(a);var s=a.body;void 0===s.firstName&&(s.firstName=s.username),window.localStorage.setItem("user",JSON.stringify(s)),t.sink.next(s)}})}}]),e}(),re=function(){function e(t,a,n){Object(v.a)(this,e),this.sink=void 0,this.sink=a,t.subscribe(this.getUsers.bind(this))}return Object(w.a)(e,[{key:"getUsers",value:function(){var e=this,t=ae.baseHost.getValue(),a=ae.basicUser.getValue(),n=ae.basicPwd.getValue();Z.a.get(t+"/api/v1/core/users").withCredentials().set("Accept","application/json").set("Authorization","user "+a+":"+n).end(function(t,a){if(t)if(401===t.status)te.navigateTo.next("/");else{var n={code:t.status,status:t.statusText,message:t.responseText};e.sink.error(n)}else{for(var s=[],i=0;i<a.body.length;i++){var r=a.body[i];void 0===r.firstName&&(r.firstName=r.username),s.push(r)}var o=s.sort(function(e,t){return e.username>t.username?1:e.username<t.username?-1:0});e.sink.next(o)}})}}]),e}(),oe=new function e(){Object(v.a)(this,e),this.login={source:new Q.Subject,sink:new Q.Subject},this.createUser={source:new Q.Subject,sink:new Q.Subject},this.getUser={source:new Q.Subject,sink:new Q.BehaviorSubject(JSON.parse(window.localStorage.getItem("user")))},this.getAllUsers={source:new Q.Subject,sink:new Q.BehaviorSubject},this.loginService=new ne(this.login.source,this.login.sink,this.getUser.source),this.createUserService=new se(this.createUser.source,this.createUser.sink),this.getUserService=new ie(this.getUser.source,this.getUser.sink),this.getAllUsersService=new re(this.getAllUsers.source,this.getAllUsers.sink)},le=function(e){function t(){return Object(v.a)(this,t),Object(y.a)(this,Object(k.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(w.a)(t,[{key:"render",value:function(){var e={};return this.props.style&&(e=this.props.style),e.display="grid",e.width,e.height,e.gridGap||(e.gridGap=this.props.gap),e.gridTemplateRows||(e.gridTemplateRows=this.props.rowTemplate),e.gridTemplateColumns||(e.gridTemplateColumns=this.props.columnTemplate),i.a.createElement("div",Object.assign({style:e},this.props),this.props.children)}}]),t}(s.Component),ce=function(e){function t(){return Object(v.a)(this,t),Object(y.a)(this,Object(k.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(w.a)(t,[{key:"render",value:function(){var e={};return this.props.style&&(e=this.props.style),e.gridGap||(e.gridGap=this.props.gap),e.gridTemplateRows||(e.gridRow=this.props.rows),e.gridTemplateColumns||(e.gridColumn=this.props.columns),i.a.createElement("div",{style:e},this.props.children)}}]),t}(s.Component),ue=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={isLoading:!1,firstNameError:"",lastNameError:"",emailError:"",passwordError:"",confirmPasswordError:"",user:{firstName:"",lastName:"",email:"",password:"",confirmPassword:""}},n.handleSubmit=n.handleSubmit.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentWillUnMount",value:function(){this.createUserSubscription}},{key:"componentDidMount",value:function(){}},{key:"clearValidationErrors",value:function(){this.setState({firstNameError:"",lastNameError:"",emailError:"",passwordError:"",confirmPasswordError:""})}},{key:"isValidForm",value:function(){this.clearValidationErrors();var e=!0;return this.state.firstName||(e=!1,this.setState({firstNameError:"First name is required"})),this.state.email||(e=!1,this.setState({emailError:"Email is required"})),this.state.password||(e=!1,this.setState({passwordError:"A password is required"})),e}},{key:"handleSubmit",value:function(e){var t=this;if(console.log("handleSubmit - create user"),!this.state.isLoading){var a=this.isValidForm();if(this.state.password!==this.state.confirmPassword&&(a=!1,this.setState({confirmPasswordError:"The passwords must match"})),a){this.setState({isLoading:!0});var n={};n.username=this.state.firstName.toLowerCase(),n.password=this.state.password,n.isFamilyAdmin=!0,n.userProps={},n.userProps.firstName=this.state.firstName,n.userProps.lastName=this.state.lastName,n.userProps.email=this.state.email,this.createUserSubscription=oe.createUser.sink.subscribe(function(e){console.log("UserActions.createUser.sink: "),console.dir(e),t.setState({isLoading:!1}),oe.getAllUsers.source.next(!0)},function(e){alert(e)}),oe.createUser.source.next(n)}}}},{key:"render",value:function(){var e=this,t=this.props.classes;return i.a.createElement(R.a,{style:{maxWidth:"800px"}},i.a.createElement(le,{gap:"16px",rowTemplate:"48px auto",columnTemplate:"1fr 1fr",style:{margin:"16px"}},i.a.createElement(ce,{rows:"1",columns:"1 / 3",style:{borderBottom:"1px solid #ccc"}},i.a.createElement("h2",null,i.a.createElement(l.a,{id:"SignupCard.label",defaultMessage:"Create First User"}))),i.a.createElement(ce,{rows:"2",columns:"1/2"},i.a.createElement(B.a,{label:"First Name",required:!0,className:t.textField,value:this.state.firstName,onChange:function(t){e.setState({firstName:t.target.value}),e.clearValidationErrors()},error:this.state.firstNameError.length>0,helperText:this.state.firstNameError})),i.a.createElement(ce,{rows:"2",columns:"2/3"},i.a.createElement(B.a,{label:"Last Name",className:t.textField,value:this.state.lastName,onChange:function(t){e.setState({lastName:t.target.value}),e.clearValidationErrors()},error:this.state.lastNameError.length>0,helperText:this.state.lastNameError})),i.a.createElement(ce,{rows:"3",columns:"1/3"},i.a.createElement(B.a,{label:"Email",required:!0,className:t.textField,value:this.state.email,onChange:function(t){e.setState({email:t.target.value}),e.clearValidationErrors()},error:this.state.emailError.length>0,helperText:this.state.emailError})),i.a.createElement(ce,{rows:"4",columns:"1/3"},i.a.createElement(B.a,{type:"password",label:"Password",required:!0,className:t.textField,value:this.state.password,onChange:function(t){e.setState({password:t.target.value}),e.clearValidationErrors()},error:this.state.passwordError.length>0,helperText:this.state.passwordError})),i.a.createElement(ce,{rows:"5",columns:"1/3"},i.a.createElement(B.a,{type:"password",required:!0,label:"Confirm Password",className:t.textField,value:this.state.confirmPassword,onChange:function(t){e.setState({confirmPassword:t.target.value}),e.clearValidationErrors()},error:this.state.confirmPasswordError.length>0,helperText:this.state.confirmPasswordError})),i.a.createElement(ce,{rows:"6",columns:"1/3"},'The first thing we need to do is create an login for you that will be registered as the "Administrator" of this system.'),i.a.createElement(ce,{rows:"7",columns:"1/3"},"After you login, you will be able to create accounts for each member of your family, in the User Manager."),i.a.createElement(ce,{rows:"8",columns:"1/3",style:{textAlign:"right"}},i.a.createElement(D,{isLoading:this.state.isLoading,label:"Create User",onClick:this.handleSubmit}))))}}]),t}(s.Component),de=Object(l.d)(Object(d.withStyles)(function(e){return{loginCardForm:{padding:"20px",width:"100%",backgroundColor:"#ffffff"},textField:{width:"100%"}}})(ue)),pe=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={isMounted:!0,users:void 0,activeUser:void 0,backgrounds:["http://res.cloudinary.com/1158-labs/image/upload/c_scale,w_1024/v1453933080/graphicstock/AS6_9771-180__.jpg"]},n.handleLogin=n.handleLogin.bind(Object(N.a)(Object(N.a)(n))),n.handleCancelCardSelection=n.handleCancelCardSelection.bind(Object(N.a)(Object(N.a)(n))),n.handleCardSelection=n.handleCardSelection.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0,isLoading:!0}),oe.getAllUsers.sink.takeWhile(function(){return e.state.isMounted}).subscribe(function(t){t&&e.setState({isLoading:!1,users:t})}),te.logout.source.next(!0),oe.getAllUsers.source.next(!0)}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"handleCardSelection",value:function(e){this.setState({activeUser:e})}},{key:"handleCancelCardSelection",value:function(e){this.setState({activeUser:void 0})}},{key:"handleLogin",value:function(e,t){oe.login.source.next({username:e,password:t}),oe.login.sink.subscribe(function(e){console.log("UserActions.login.sink: SUCCESS"),console.dir(e)},function(e){console.log("UserActions.login.sink: ERROR"),console.dir(e),window.alert(e.message)})}},{key:"render",value:function(){var e=this.props.classes,t=this.state.backgrounds[0];return this.state.isLoading?i.a.createElement("div",null,i.a.createElement(S.a,{className:e.progress,size:50})):i.a.createElement("div",{className:e.loginView,style:{background:"url('"+t+"') no-repeat"}},this.state.users&&0!==this.state.users.length?i.a.createElement(K,{users:this.state.users,onLogin:this.handleLogin}):i.a.createElement(de,null),i.a.createElement("div",{className:e.timeClock},i.a.createElement(M,null)))}}]),t}(s.Component),he=Object(l.d)(Object(d.withStyles)(function(e){return{loginView:{position:"absolute",top:0,right:0,left:0,bottom:0,display:"flex",flexGrow:1,flexWrap:"wrap",alignItems:"center",justifyContent:"center",height:"100vh",backgroundSize:"cover !important",backgroundRepeat:"no-repeat !important"},timeClock:{position:"absolute",bottom:"20px",left:"40px",width:"100%"},progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})(pe)),me=a(628),ge=a(216),fe=a.n(ge),be=a(167),ve=a.n(be),we=a(149),ye=a.n(we),ke=a(150),Ce=a.n(ke),Ee=a(209),Oe=a.n(Ee),je=a(208),xe=a.n(je),Se=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).handleNavClick=n.handleNavClick.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),te.logout.source.next(!0),te.navigateTo.next("://")}},{key:"findApp",value:function(e,t){if(t){var a=!0,n=!1,s=void 0;try{for(var i,r=t[Symbol.iterator]();!(a=(i=r.next()).done);a=!0){var o=i.value;if(o.slug===e)return o}}catch(l){n=!0,s=l}finally{try{a||null==r.return||r.return()}finally{if(n)throw s}}}return null}},{key:"render",value:function(){var e=this,t=this.props.classes,a=this.findApp("user_manager",this.props.secondaryApps);return i.a.createElement(R.a,{className:this.props.open?t.sidebarOpen:t.sidebarClosed},i.a.createElement(R.a,{className:this.props.open?t.sidebarUserInfo:t.sidebarUserInfoClosed},i.a.createElement("div",{className:t.sidebarProfileIcon},i.a.createElement(H.a,{style:{width:60,height:60}})),i.a.createElement("div",{className:t.sidebarProfileName},i.a.createElement(G.a,{component:"div",type:"title"},this.props.user.firstName," ",this.props.user.lastName)),i.a.createElement("div",{className:t.sidebarButtons},i.a.createElement(I.a,{onClick:this.handleLogout},"Logout"),a&&i.a.createElement(I.a,{onClick:function(){return te.navigateTo.next(a.path)}},"Profile"))),i.a.createElement("div",{className:this.props.open?t.appListsOpen:t.appListsClosed},i.a.createElement("div",{style:{gridColumn:"1",gridRow:"1"}},i.a.createElement(G.a,{type:"title",className:this.props.open?t.openLabel:t.closedLabel,style:{paddingLeft:"16px",paddingTop:"16px",gridColumn:"1",gridRow:"1"}},"Apps")),i.a.createElement(ye.a,{style:{gridColumn:"1",gridRow:"2"}},this.props.apps&&this.props.apps.map(function(a){return i.a.createElement(Ce.a,{key:a.path,button:!0,onClick:function(){return e.handleNavClick(a.path)}},i.a.createElement(ve.a,null,i.a.createElement(xe.a,null)),i.a.createElement(Oe.a,{primary:a.label,secondary:"",className:e.props.open?t.openLabel:t.closedLabel}))})),i.a.createElement(ye.a,{style:{gridColumn:"1",gridRow:"3"},className:this.props.open?t.closedLabel:t.openLabel},i.a.createElement(Ce.a,{button:!0,onClick:function(){return e.handleNavClick("://app-usermanager/index.html")}},i.a.createElement(ve.a,null,i.a.createElement(H.a,{style:{width:48,height:48}}))))))}}]),t}(s.Component),Ne=Object(l.d)(Object(d.withStyles)(function(e){return{sidebarOpen:{width:"240px",height:"100vh",background:"#fff"},sidebarClosed:{width:"72px",height:"100vh",background:"#fff"},sidebarUserInfo:{width:"100%",padding:"8px",display:"grid",gridGap:"8px",gridTemplateRows:"auto",gridTemplateColumns:"60px auto"},sidebarUserInfoClosed:{display:"none"},sidebarProfileIcon:{gridColumn:"1",gridRow:"1"},sidebarProfileName:{gridColumn:"2",gridRow:"1",alignSelf:"center"},sidebarButtons:{gridColumn:"1/3",gridRow:"2",justifySelf:"center"},appListsOpen:{display:"grid",gridGap:"0px",gridTemplateRows:"24px auto",gridTemplateColumns:"auto",marginTop:"16px"},appListsClosed:{height:"90%",display:"grid",gridGap:"0px",gridTemplateRows:"0px auto 72px",gridTemplateColumns:"auto"},openLabel:{display:"inline"},closedLabel:{display:"none"}}})(Se)),Ae=a(210),Te=a.n(Ae),Le=a(211),Me=a.n(Le),Ue=a(168),Re=a.n(Ue),Pe=a(215),Ie=a.n(Pe),We=a(214),Fe=a.n(We),Ve=a(169),Be=a.n(Ve),ze=a(213),Ge=a.n(ze),_e=a(212),He=a.n(_e),qe=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={openMoreMenu:!1},n.handleToggle=n.handleToggle.bind(Object(N.a)(Object(N.a)(n))),n.handleOpenMoreMenu=n.handleOpenMoreMenu.bind(Object(N.a)(Object(N.a)(n))),n.handleLogout=n.handleLogout.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleToggle",value:function(){this.props.onToggle&&this.props.onToggle()}},{key:"handleNavClick",value:function(e){this.props.onNavClick&&this.props.onNavClick(e)}},{key:"handleMenuClose",value:function(){this.setState({openMoreMenu:!1})}},{key:"handleLogout",value:function(){window.localStorage.clear(),te.logout.source.next(!0),te.navigateTo.next("://")}},{key:"render",value:function(){var e=this,t=this.props.classes;return i.a.createElement(Te.a,{className:t.root,position:"static"},i.a.createElement(Me.a,null,i.a.createElement(Re.a,{onClick:this.handleToggle,className:t.menuButton,"aria-label":"Menu"},i.a.createElement(He.a,{style:{color:"white"}})),i.a.createElement(G.a,{type:"title",color:"inherit",className:t.flex,onClick:function(){return e.handleNavClick("://dashboard/index.html")}},"Family ",i.a.createElement("i",null,"D.A.M")),i.a.createElement(Re.a,{"aria-label":"More","aria-owns":this.state.open?"long-menu":null,"aria-haspopup":"true",onClick:this.handleOpenMoreMenu,className:t.moreButton},i.a.createElement(Ge.a,null)),i.a.createElement(Fe.a,{id:"long-menu",anchorEl:this.state.openMoreMenuAnchorEl,open:this.state.openMoreMenu},i.a.createElement(Be.a,{color:"contrast",onClick:function(){e.handleLogout(),e.handleMenuClose()}},"Logout"),i.a.createElement(Ie.a,null),this.props.apps&&this.props.apps.map(function(t){return i.a.createElement(Be.a,{key:t.path,color:"contrast",onClick:function(){e.handleNavClick(t.path),e.handleMenuClose()}},t.label)}))))}}]),t}(s.Component),De=Object(l.d)(Object(d.withStyles)(function(e){return{root:{width:"100%",height:"64px"},headerContainer:{display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"48px auto 48px"},hamburgerMenu:{display:"block",gridRow:"1",gridColumn:"1"},mainSection:{gridRow:"1",gridColumn:"2"},rightSection:{gridRow:"2",gridColumn:"3",textAlign:"right"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20},moreButton:{color:"#fff"}}})(qe)),Je=function(e){function t(e,a){var n;Object(v.a)(this,t),n=Object(y.a)(this,Object(k.a)(t).call(this,e));var s=window.localStorage.getItem("AppShell.isOpen");return n.state={isMounted:!0,isOpen:s||!0},n.handleOpenCloseToggle=n.handleOpenCloseToggle.bind(Object(N.a)(Object(N.a)(n))),n.handleOpenMoreMenu=n.handleOpenMoreMenu.bind(Object(N.a)(Object(N.a)(n))),n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),te.navigateTo.takeWhile(function(){return e.state.isMounted}).subscribe(function(e){if("://"===e.substring(0,3)){var t=window.location.href.indexOf("#");-1===t&&window.location.href!==e.substring(2)?window.location.href=e.substring(2):window.location.href.substr(t+1)!==e.substring(2)&&(window.location.href=e.substring(2))}else this.props.history.push(e)}.bind(this)),te.loadClientApps.sink.subscribe(function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})}),te.loadClientApps.source.next(!0)}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"handleOpenMoreMenu",value:function(e){this.setState({openMoreMenu:!0,openMoreMenuAnchorEl:e.currentTarget})}},{key:"handleOpenCloseToggle",value:function(){var e=!this.state.isOpen;this.setState({isOpen:e}),window.localStorage.setItem("AppShell.isOpen",e)}},{key:"handleLogout",value:function(){window.localStorage.clear(),te.logout.source.next(!0),te.navigateTo.next("://")}},{key:"render",value:function(){var e=this.props.classes;if(this.props.user)return i.a.createElement("div",{className:this.state.isOpen?e.dashboardShellContainerOpen:e.dashboardShellContainerClosed},i.a.createElement("header",{className:e.header},i.a.createElement(De,{apps:this.state.secondaryApps,onToggle:this.handleOpenCloseToggle,onNavClick:function(e){return te.navigateTo.next(e)}})),i.a.createElement(Ne,{user:this.props.user,apps:this.state.primaryApps,secondaryApps:this.state.secondaryApps,open:this.state.isOpen,onNavClick:function(e){return te.navigateTo.next(e)}}),i.a.createElement("div",{className:e.main},this.props.children));this.handleLogout()}}]),t}(s.Component),Ye=Object(l.d)(Object(d.withStyles)(function(e){return{dashboardShellContainerOpen:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"240px auto"},dashboardShellContainerClosed:{display:"grid",gridTemplateRows:"64px auto",gridTemplateColumns:"72px auto"},header:{gridColumn:"1/3",gridRow:"1",position:"inherit",height:"64px"},main:{background:"#eee"}}})(Je)),$e=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e))).state={isMounted:!0},n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({isMounted:!0}),te.loadClientApps.sink.takeWhile(function(){return e.state.isMounted}).subscribe(function(t){t&&e.setState({primaryApps:t.primaryApps,secondaryApps:t.secondaryApps})})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"componentWillReceiveProps",value:function(e,t){}},{key:"render",value:function(){var e=this.props.classes;return this.state.isLoading?i.a.createElement("div",null,i.a.createElement(S.a,{className:e.progress,size:50})):i.a.createElement(Ye,{user:this.props.user,history:this.props.history},i.a.createElement("div",{className:e.contentContainer},i.a.createElement("div",{className:e.contentHeader},i.a.createElement(G.a,{style:{fontSize:"24px",lineHeight:"24px"}},"Where would you like to start?")),this.state.primaryApps&&this.state.primaryApps.filter(function(e){return"home"!==e.slug}).map(function(t,a){return i.a.createElement(R.a,{key:t.path,"data-indx":a,className:e["contentAppCard"+a],onClick:function(){return te.navigateTo.next(t.path)}},i.a.createElement(fe.a,{style:{width:"48px",height:"48px"}}),i.a.createElement(G.a,{style:{fontSize:"24px"}},t.label))})))}}]),t}(s.Component),Ke=Object(l.d)(Object(me.a)(Object(d.withStyles)(function(e){return{progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},contentContainer:{height:"100%",margin:"auto",display:"grid",gridGap:"24px",gridTemplateRows:"auto 125px 150px 150px auto",gridTemplateColumns:"auto 300px 300px auto",gridAutoFlow:"column"},contentHeader:{gridColumn:"2/4",gridRow:2,marginTop:"auto"},contentHeaderLabel:{fontSize:"96px",color:e.accentColor,lineHeight:"104px",textTransform:"capitalize"},contentAppCard0:{gridColumn:"2/3",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard1:{gridColumn:"3/4",gridRow:3,textAlign:"center",padding:"32px"},contentAppCard2:{gridColumn:"2/3",gridRow:4,textAlign:"center",padding:"32px"},contentAppCard3:{gridColumn:"3/4",gridRow:4,textAlign:"center",padding:"32px"}}})($e))),Qe=function(e){function t(e,a){var n;return Object(v.a)(this,t),(n=Object(y.a)(this,Object(k.a)(t).call(this,e,a))).state={context:a,locale:"en-EN",isLoading:!1,isMounted:!0,isAuthenticated:!1},n}return Object(C.a)(t,e),Object(w.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({isMounted:!0,user:{firstName:"mike"}}),oe.getUser.sink.takeWhile(function(){return e.state.isMounted}).subscribe(function(t){t?e.setState({isAuthenticated:!0,user:t}):e.setState({isAuthenticated:!1,user:void 0}),te.navigateTo.next("/")})}},{key:"componentWillUnmount",value:function(){this.setState({isMounted:!1})}},{key:"render",value:function(){var e=this,t=this.props.classes;return this.state.isLoading?i.a.createElement("div",null,i.a.createElement(S.a,{className:t.progress,size:50})):i.a.createElement(l.b,{locale:"en-EN",key:"en-EN",messages:this.props.i18nMessages["en-EN"]},i.a.createElement(E.a,null,i.a.createElement(O.a,null,i.a.createElement(j.a,{path:"/login",component:function(){return i.a.createElement(he,{mode:"login"})}}),i.a.createElement(j.a,{path:"/",component:function(){return e.state.isAuthenticated?i.a.createElement(Ke,{user:e.state.user}):i.a.createElement(he,{mode:"login"})}}))))}}]),t}(s.Component),Xe=Object(d.withStyles)(function(e){return{progress:{margin:"0 ".concat(2*e.spacing.unit,"px"),width:"100px",height:"100px",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})(Qe);Object(l.c)(a(622));var Ze={"en-EN":a(623)},et=Object(d.createMuiTheme)({palette:{type:"light",primary:h.a,secondary:Object(n.a)({},g.a),error:b.a}});o.a.render(i.a.createElement(d.MuiThemeProvider,{theme:et},i.a.createElement(Xe,{i18nMessages:Ze})),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("","/service-worker.js");c?function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):u(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e):u(e)})}}()}},[[221,2,1]]]);
//# sourceMappingURL=main.bdf38f55.chunk.js.map