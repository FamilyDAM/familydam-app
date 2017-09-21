/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

(function () {
    const {app,ipcMain,BrowserWindow} = require('electron');
    var FB = require('fb');
    var logger = require('electron-log');

    var subscribeToClient = function(){
        logger.info("SocialManger - SubscribeToClient");


        ipcMain.on('social-auth', (event, arg) => {

            logger.info("Social-Auth Event");
            logger.debug(arg);

            if( arg == "facebook")
            {
                authorizeFacebook(event);
                event.sender.send('social-auth-start', 'facebook');
            }

        });
    };


    var authorizeFacebook = function (event)
    {
        logger.info("Authorize Facebook");

        var options = {
            client_id: '1459016164310867',
            scopes: "public_profile,user_about_me",
            redirect_uri: "http://localhost/social/fb"//"https://www.facebook.com/connect/login_success.html"
        };


        var authWindow = new BrowserWindow({
            width: 450,
            height: 300,
            show: false,
            webPreferences: {nodeIntegration: false, 'web-security': false}
        });

        var facebookAuthURL = "https://www.facebook.com/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";

        logger.debug(facebookAuthURL);
        authWindow.loadURL(facebookAuthURL);
        authWindow.show();


        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {

            logger.debug('did-get-redirect-request');

            var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
            access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            error = /\?error=(.+)$/.exec(newUrl);
            if (access_token) {

                event.sender.send('social-auth-token', 'facebook', 'access_token');

                FB.setAccessToken(access_token);
                FB.api('/me', {fields: ['id', 'name', 'picture.width(800).height(800)']}, function (res) {
                    console.log('/me');
                    console.dir(res);
                });
                authWindow.close();
            }
        });

    };

    module.exports = {

        subscribe : function()
        {
            return subscribeToClient();
        }

    };


}).call(this);
