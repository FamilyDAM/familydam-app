
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


        //fs.readFile( __dirname +'/resources/systemprops.json',  {'encoding':'utf8'}, function (err, data)
        fs.exists( __dirname +'/resources/systemprops.json',  function (exists_)
        {
            if( !exists_ ){
                loadConfigApplication();
                return false;
            }else{
                //todo read settings file
                

                initializeStorageLocation(_this.settings);
                return true;
            }
        });
    };


    /**
     * Move the server and any external dependencies to the selected storage location.
     * @returns {boolean}
     */
    function initializeStorageLocation(settings_) {

        console.log("[InitializeStorageLocation] " +settings_.storageLocation);

        try{

            fs.mkdirSync(settings_.storageLocation);

            if( fs.existsSync(settings_.storageLocation) )
            {
                var _root = __dirname +"/resources";
                copyResourceDir(_root, "/");

                return true;
            }

        }catch(err){
            return false;
        }
        return false;
    };


    /**
     * Copy all of the files in a directory
     * @param path_
     */
    var copyResourceDir = function(root_, path_)
    {
        var path = root_ +path_;
        fs.readdir(path, function(err, files_){

            var source = files_

            for (var i = 0; i < files_.length; i++)
            {
                var _file = files_[i];
                var source = path +_file;
                var target = settings_.storageLocation +"/" +_file;

                var stats =  fs.stat();
                if( stats.isFile() && !stats.existsSync(target) ){
                    console.log('info', "Copying '" +file +"' to "+settings_.storageLocation, false);
                    fs.writeFileSync(target, fs.readFileSync(source));
                }else if( stats.isDirectory() ){
                    //todo
                }

            }
        });
    };





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
        app.dock.bounce("informational");

        //configWindow.openDevTools();

        // Call back handler which invoked from the webpage when all of the fields have been filled out.
        ipc.on('saveConfig', function(event, _settings)
        {
            //  console.log("save settings : " +_settings );

            //deserialize
            settings = JSON.parse(_settings);

            //update settings
            settings.state = "READY";
            settings.storageLocation = "/Users/mnimer/Development/temp/familydam";
            console.dir(settings);

            //serialize
            var encodedSettings = JSON.stringify(settings);

            // write back to file in package
            fs.writeFile( __dirname +'/resources/systemprops.json',  encodedSettings, {'encoding':'utf8'}, function (err, data)
            {
                if( initializeStorageLocation() )
                {
                    app.loadServerApplication();
                    app.loadSplashApplication();
                    return true;
                }else{
                    configWindow.webContents.on('did-finish-load', function() {
                        configWindow.webContents.executeJavaScript("alert('Error Saving Settings & Moving Resources, Please restart your application and try again.  Also, please double the permissions of the storage location folder.');");
                    });

                    return false;
                }
            });
        });


    };



    module.exports = {

        initializeServer : function(app_, configWindow_, splashWindow_, mainWindow_)
        {
            link(app_, configWindow_, splashWindow_, mainWindow_);

            validateConfiguration();
        },

        getSettings: function(){
            return settings;
        }

    };


}).call(this);