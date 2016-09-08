
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
    const {app} = require('electron');
    const {ipcMain} = require('electron');

    var os = require('os');
    var fs = require('fs');
    var http = require('http');
    var serverManager = require('./ServerManager');

    var settings = {};
    var settingsFile = "resources/systemprops.json";

    var appRoot;
    var configWindow;
    var splashWindow;
    var mainWindow;
    var repoVersion = "0.1.0";

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
        console.log("[ValidateConfiguration] " +__dirname);
        if( !fs.existsSync( __dirname +"/"  +settingsFile) )
        {
            //todo: create default file
            console.warn("settings file does not exists, loading App Config wizard.");
            loadConfigApplication();
            return false;
        }
        else
        {

            var _settings = fs.readFileSync(__dirname + "/" + settingsFile, {'encoding': 'utf8'});
            settings = JSON.parse(_settings);

            if (settings.state != "READY")
            {
                loadConfigApplication();
                return false;
            }
            else
            {
                console.log("** Initialize Storage");
                initializeStorageLocation(settings);

                return true;

            }
        }
    };



    /**
     * Move the server and any external dependencies to the selected storage location.
     * @returns {boolean}
     */
    function initializeStorageLocation(settings_) {

        console.log("{initializeStorageLocation}" +settings_);
        try{

            if( !fs.existsSync(settings_.storageLocation) )
            {
                fs.mkdirSync(settings_.storageLocation);
            }

            var _root = __dirname +"/resources";
            copyResourceDir(settings_, _root, "/");

            return true;

        }catch(err){
            console.dir(err);
            return false;
        }
        return false;
    };


    /**
     * Copy all of the files in a directory
     * @param path_
     */
    var copyResourceDir = function(settings_, root_, path_)
    {
        console.log("{copy resource dir} source=" +root_ +"  |  dest=" +path_);
        var path = root_ +path_;
        var _dirList = fs.readdirSync(path);

        for (var i = 0; i < _dirList.length; i++)
        {
            var _file = _dirList[i];
            var source = path +_file;
            var target = settings_.storageLocation +"/" +_file;

            console.log("{checking file} source=" +source +"  |  target=" +target);

            var stats =  fs.statSync(source);
            if( stats.isFile()  ){
                console.log('info', "Copying '" +source +"' to "+settings_.storageLocation, false);
                fs.writeFileSync(target, fs.readFileSync(source));
            }else if( stats.isDirectory() ){
                //todo
            }

        }

    };





    /**
     * Once the embedded java server is running load the application from the server.
     */
    var loadConfigApplication = function()
    {

        console.log("DIR:" + __dirname );
        console.log("Load configuration window (" +new Date() +")  file://" + __dirname + "/apps/config/index.html");

        configWindow.openDevTools();
        configWindow.loadURL('file://' + __dirname + '/apps/config/index.html');
        configWindow.webContents.on('did-finish-load', function()
            {
                //console.logger("{did-finish-load} empty!");
                configWindow.webContents.send('settingConfig', settings);
            });


        splashWindow.hide();
        mainWindow.hide();
        configWindow.show();
        configWindow.focus();

        //Bouce the dock to get the users attention
        app.dock.bounce("informational");

        //configWindow.openDevTools();

        /**
         * Call back handler which invoked from the webpage when all of the fields have been filled out.
         */
        ipcMain.on('saveConfig', function(event, _settings)
        {
            console.log("save settings : " +_settings );

            //deserialize
            settings = JSON.parse(_settings);

            //update settings
            settings.state = "READY";

            //fix version of the repository
            //settings.version = "0.1.0";

            //serialize
            var encodedSettings = JSON.stringify(settings);


            // write back to file in package
            fs.writeFile( __dirname +'/resources/systemprops.json',  encodedSettings, {'encoding':'utf8'}, function (err, data)
            {
                console.dir(settings);
                console.log("** Initialize Storage");
                initializeStorageLocation(settings);
                console.log("** Start JCR Server");
                app.startServerApplication(settings);
                console.log("** load splash screen");
                app.loadSplashApplication();

            });

            event.returnValue = "save complete";
            event.sender.send('saveConfigComplete', 'save complete')
        });


    };



    module.exports = {

        initializeServer : function(app_, configWindow_, splashWindow_, mainWindow_)
        {
            link(app_, configWindow_, splashWindow_, mainWindow_);

            return validateConfiguration();
        },

        getSettings: function(){
            return settings;
        }

    };


}).call(this);