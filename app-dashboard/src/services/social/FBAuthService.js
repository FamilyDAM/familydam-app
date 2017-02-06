/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserStore = require('../../stores/UserStore');
var SocialActions = require('../../actions/SocialActions');
/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */
module.exports = {

    sink:undefined,

    subscribe : function(){
        //console.log("{PhotoSearch Service} subscribe");
        this.sink = SocialActions.authFacebook.sink;
        SocialActions.authFacebook.source.subscribe(this.execute.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    execute: function(args_)
    {
        var user = UserStore.getCurrentUser();

        var _url = "http://localhost:8080/api/v1/social/fb/auth?token=" +user.jwtToken;

        if( electronRequire ) {
            electronRequire("electron").shell.openExternal(_url);// +UserStore.getCurrentUser().getId());
        }else{
            window.open(_url, "_blank");
        }

        /**
        var _redirect_uri = "https://www.facebook.com/connect/login_success.html";
        var _url = "https://www.facebook.com/v2.8/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&response_type=token&scope=public_profile,user_about_me&state={state}";


        if( electronRequire ) {

            //electronRequire("electron").shell.openExternal(_url.replace("{app-id}", "1459016164310867").replace("{redirect-uri}", _redirect_uri));
            electronRequire("electron").ipcRenderer.send('social-auth','facebook');

            electronRequire("electron").ipcRenderer.on('social-auth-start', (service_)=>{
                debugger;
                logger.debug('social-auth-start - ' +service);
                console.log(service_);
            });

            electronRequire("electron").ipcRenderer.on('social-auth-token', (service_, token_)=>{
                debugger;
                logger.debug('social-auth-token - ' +service);
                console.log(service_);
                console.log(token_);
            });

        }else{
            //window.open
        }
         **/

        /**
        var options = {
            client_id: '1633225286959017',
            scopes: "public_profile",
            redirect_uri: "https://www.facebook.com/connect/login_success.html"
        };
        var authWindow = new BrowserWindow({ width: 450, height: 300, show: false, 'node-integration': false });
        var facebookAuthURL = "https://www.facebook.com/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
        authWindow.loadUrl(facebookAuthURL);
        authWindow.show();
        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
            access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            error = /\?error=(.+)$/.exec(newUrl);
            if(access_token) {
                FB.setAccessToken(access_token);
                FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (res) {
                    mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-name\").innerHTML = \" Name: " + res.name + "\"");
                    mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-id\").innerHTML = \" ID: " + res.id + "\"");
                    mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-dp\").src = \"" + res.picture.data.url + "\"");
                });
                authWindow.close();
            }
        });
         **/
    }

};

