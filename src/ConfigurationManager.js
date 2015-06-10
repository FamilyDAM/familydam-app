
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 *--
 */

(function() {
    var app = require('app');
    var os = require('os');
    var fs = require('fs');
    var ipc = require('ipc');
    var http = require('http');
    var BrowserWindow = require('browser-window');
    var serverManager = require('./ServerManager');

    var settings = {};
    var settingsFile = "resources/systemprops.json";

    var appRoot;
    var configWindow;
    var splashWindow;
    var mainWindow;

    var link = function (app_, configWindow_, splashWindow_, mainWindow_)
    {
        appRoot = app_;
        configWindow = configWindow_;
        splashWindow = splashWindow_;
        mainWindow = mainWindow_;
    };


    var validateConfiguration = function()
    {
        var _this = this;
        console.log("[ValidateConfiguration]")
        if( !fs.existsSync( __dirname +"/"  +settingsFile) )
        {
            //todo: create default file
            console.warn("settings file does not exists");
        }


        fs.readFile( __dirname +'/resources/systemprops.json',  {'encoding':'utf8'}, function (err, data)
        {
            //console.log(data);
            if (err) {
                console.log("Error: " +err);
                throw err;
            }

            settings = JSON.parse(data);

            initializeStorageLocation();

            if( true || settings.state == "READY" && _this.initializeStorageLocation() )
            {
                serverManager.startServer(settings, appRoot, configWindow, splashWindow, mainWindow);
            }else{
                console.log("START CONFIG WIZARD");
                //loadConfigApplication();
            }

        });
    };


    /**
     * Move the server and any external dependencies to the selected storage location.
     * @returns {boolean}
     */
    function initializeStorageLocation() {

        console.log("[InitializeStorageLocation] " +settings.storageLocation);

        try{
            fs.mkdirSync(settings.storageLocation);
        }catch(err){
            //swallow
        }


        if( fs.existsSync(settings.storageLocation) )
        {
            for(var indx in settings.resources)
            {
                var file = settings.resources[indx];
                //console.log("checking file:" +settings.storageLocation +"/" +file);
                if( !fs.existsSync( settings.storageLocation +"/" +file  ) )
                {
                    console.log("moving file:" +source +" to:" +target);
                    //copy jar to new dir
                    var source = __dirname +"/resources/" +file;
                    var target = settings.storageLocation +"/" +file;
                    //copy
                    appRoot.sendClientMessage('info', "Copying '" +file +"' to "+settings.storageLocation, false);
                    //console.log( "{ConfigurationManager} copy: dest=" +source);
                    //console.log( "{ConfigurationManager} copy: target=" +target);
                    fs.writeFileSync(target, fs.readFileSync(source));
                }
            }

            return true;
        }

        return false;
    }




    /**
     * Once the embedded java server is running load the application from the server.
     */
    var loadConfigApplication = function()
    {
        console.log("Load configuration window (" +new Date() +")");
        //this.configWindow = new BrowserWindow({width:900, height:600, center:true, frame:true, show:false, title:'FamilyDAM Configuration Wizard'});

        configWindow.loadUrl('file://' + __dirname + '/apps/config/index.html');
        configWindow.webContents.on('did-finish-load', function()
            {
                configWindow.webContents.send('settingConfig', settings);
            });


        splashWindow.hide();
        mainWindow.hide();
        configWindow.show();
        configWindow.focus();

        //Bouce the dock to get the users attention
        this.app.dock.bounce("informational");


        // Call back handler which invoked from the webpage when all of the fields have been filled out.
        ipc.on('saveConfig', function(event, _settings)
        {
            console.log("save settings : " +_settings );

            settings = JSON.parse(_settings);
            settings.state = "READY";

            var encodedSettings = JSON.stringify(settings);

            fs.writeFile( __dirname +'/resources/systemprops.json',  encodedSettings, {'encoding':'utf8'}, function (err, data)
            {
                if( initializeStorageLocation() )
                {
                    settings.state = "INSTALLED";
                    serverManager.startServer(settings, this.app, this.splashWindow, this.configWindow, this.mainWindow );
                }else{
                    alert("Error Saving Settings & Moving Resources, Please restart your application and try again.  Also, please double the permissions of the storage location folder.");
                }
            });
        });
    };



    module.exports = {

        initializeServer : function(app_, configWindow_, splashWindow_, mainWindow_)
        {
            link(app_, configWindow_, splashWindow_, mainWindow_);

            validateConfiguration();
        }

    };


}).call(this);