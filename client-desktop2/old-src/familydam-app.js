/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

const {app, BrowserWindow, autoUpdater} = require('electron');  // Module to control application life.
const appVersion = require('./package.json').version;
const os = require('os').platform();

//var autoUpdater = require('auto-updater');
var http = require('http');
var fs = require('fs');
var logger = require('electron-log');

var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');
var socialManager = require('./SocialManager');



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var splashWindow = null;
var configWindow = null;
var mainWindow = null;
var socialAuthWindow = null;
var isServerReady = false;

// Version checking URL
var updateFeed = 'http://www.familydam.com/api/v1/version';

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Log level
    logger.transports.console.level = 'info';
    logger.transports.file.level = 'info';
    /**
     * Set output format template. Available variables:
     * Main: {level}, {text}
     * Date: {y},{m},{d},{h},{i},{s},{ms}
     */
    logger.transports.console.format = '{h}:{i}:{s}:{ms} {text}';


    // Report crashes to our server.
    //app.crashReporter.start();

    app.configureAutoUpdator();


    // Create the browser window.
    app.configureWindows();



    //setup IPC Subscriptions
    socialManager.subscribe();


    var isReady = configurationManager.initializeServer(app, configWindow, splashWindow, mainWindow);

    if( isReady )
    {
        var _this = this;
        var _settings = configurationManager.getSettings();

        //set logger folder location to the be a sub folder of repo
        if( _settings['storageLocation'] )
        {
            logger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
            //set logger file size
            logger.transports.file.maxSize = 5 * 1024 * 1024;
            // Write to this file, must be set before first logging
            logger.transports.file.file = _settings['storageLocation'] +"/desktop.log";// fs.createWriteStream options, must be set before first logging
            logger.transports.file.streamConfig = { flags: 'w' };
            // set existed file stream
            logger.transports.file.stream = fs.createWriteStream(_settings['storageLocation'] +"/desktop.log");

        }

        configurationManager.setSettings(_settings);

        logger.debug("Load Splash Screen");
        app.loadSplashApplication(true);

    }
});



/******************************
 * App level functions
 *
 * @see https://medium.com/@svilen/auto-updating-apps-for-windows-and-osx-using-electron-the-complete-guide-4aa7a50b904c#.6s9bal46q
 */
app.configureAutoUpdator = function(port){

    if (process.env.NODE_ENV !== 'development')
    {
        updateFeed = os === 'darwin' ?
            updateFeed +'/mac' :
            updateFeed +'/win32';
    }

    //autoUpdater.setFeedURL(updateFeed + '?v=' + appVersion);

    autoUpdater.on('error', function(err){
        logger.error(err)

        // error connecting to update server, so we start
        app.sendClientMessage("start-status", {"code":"starting-repository", "message":"Starting Repository...", "progress":"0%"}, true);
        app.startServerApplication();
    });
    autoUpdater.on('checking-for-update', function(){
        logger.info("checking for update");
        app.sendClientMessage("start-status", {"code":"check-updates", "message":"Checking for updates...", "progress":"0%"}, true);
    });

    autoUpdater.on('update-not-available', function(){
        logger.debug("update not available, Start Repository");

        // up to date, start the repo
        app.sendClientMessage("start-status", {"code":"starting-repository", "message":"Starting Repository...", "progress":"0%"}, true);
        app.startServerApplication();
    });

    autoUpdater.on('update-available', function(){
        logger.info("update-available");
        app.sendClientMessage("start-status", {"code":"update-available", "message":"Update Available, downloading...", "progress":"0%"}, true);
    });

    autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl){
        logger.info("update-downloaded");
        //console.dir(event);
        //logger.info("releaseNotes: " +releaseNotes);
        //logger.info("releaseName: " +releaseName);
        //logger.info("releaseDate: " +releaseDate);
        //logger.info("updateUrl: " +updateUrl);

        app.sendClientMessage("start-status", {"code":"update-available", "message":"Update Download, restarting...", "progress":"0%"}, true);

        autoUpdater.quitAndInstall();
        app.quit();

    });


};






/******************************
 * App level functions
 */
app.checkServer = function(port){
    var _this = this;

    http.get("http://" +host +":" +port +"/index.html", function(res) {
        if( res.statusCode == 200 ){
            _this.isServerReady = true;
        }
    }).on('error', function(e) {
        _this.isServerReady = false;
        logger.error("check status: " +e.message);
    });
};

/**
 * Setup all of the primary windows here, so we will also have a reference to close them.
 */
app.configureWindows = function(){
    splashWindow = new BrowserWindow({width:600, height:400, center:true, frame:true, show:false});//, type:"splash"});
    configWindow = new BrowserWindow({width:750, height:440, center:false, frame:true, show:false});//, type:"desktop"});

    mainWindow = new BrowserWindow({
        width:1024,
        height:800,
        center:true,
        frame:true,
        show:false,
        'web-preferences': {'web-security': false},
        title:'FamilyDAM - The Digital Asset Manager for Families'});

    // Emitted when the window is closed.
    splashWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        splashWindow = null;
    });

    configWindow.on('closed', function() {
        configWindow = null;
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        splashWindow = null;
        configWindow = null;
        mainWindow = null;
        serverManager.kill();
        if (process.platform != 'darwin')
        {
            logger.warn("Unsupported Platform = " +process.platform);
            app.quit();
        }
    });
};



app.startServerApplication = function(){

    logger.info("Start Embedded Repository");

    var _settings = configurationManager.getSettings();
    logger.debug(_settings);

    configurationManager.initializeStorageLocation(_settings);
    serverManager.startServer(_settings, app, this.splashWindow, this.configWindow, this.mainWindow );
};


app.loadSplashApplication = function(checkupdate_){

    if( !checkupdate_ )  checkupdate_=true;
    if( configWindow )  configWindow.hide();

    // and load the index.html of the app.
    //splashWindow.openDevTools();
    if( splashWindow ) {
        splashWindow.loadURL('file://' + __dirname + '/apps/splash/index.html');
        splashWindow.show();
        splashWindow.focus();


        splashWindow.webContents.on('did-finish-load', function() {
            //useful snippet of code, saving it for future reference
            //splashWindow.webContents.executeJavaScript("alert('start splash page');");
            logger.info("splash screen loaded, checking for updates");

            app.startServerApplication()
            /**
            if( checkupdate_ ) {
                autoUpdater.checkForUpdates();
            }else{
                app.startServerApplication()
            }**/

        });
    }

};


app.loadDashboardApplication = function(host, port){

    logger.info("{loadDashboardApplication} " +"http://" +host +":" +port +"/index.html");

    if( splashWindow ) splashWindow.destroy();
    if( configWindow ) configWindow.destroy();

    mainWindow.maximize();
    mainWindow.show();
    // Open the devtools.
    mainWindow.openDevTools();

    //mainWindow.loadUrl('file://' + __dirname  +'/apps/dashboard/index.html');
    mainWindow.loadURL("http://" +host +":" +port +"/index.html");

};




/******************************
 * Event Handlers
 */
process.on('exit', function () {
    logger.info("exit");
    serverManager.kill();
});


// Quit when all windows are closed.
app.on('will-quit', function() {
    logger.info("will-quit");
    serverManager.kill();
});

// Quit after auto update
app.on('before-quit', function(event_) {
    logger.info("before-quit");
    console.dir(event_);

    serverManager.kill();

});


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    serverManager.kill();

    if (process.platform != 'darwin')
        app.quit();
});


// Called when user tries to open a new url to leave the application
app.on('open-url', function(event, path) {
    logger.info("Open-URL: " +path);

    // Create the browser window.
    var childWindow = new BrowserWindow({width:1024, height:800, frame:true});

    // and load the index.html of the app.
    childWindow.loadURL(path);

    // Emitted when the window is closed.
    childWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        childWindow = null;
    });
});

//todo: Called when user tries to open a new url to leave the application.
app.on('open-file', function(event, url) {
    logger.info("TODO Open-FILE: " +url);
});




/*****************************
 * Messaging
 */

app.sendClientMessage = function(_type, _message, _logToConsole)
{
    if( _logToConsole )
    {
        logger.info("{sendClientMessage}");
        console.dir(_type);
        console.dir(_message);
    }

    if( _type && _message ) {
        if (splashWindow && splashWindow.webContents ) splashWindow.webContents.send(_type, _message);
        if (mainWindow  && mainWindow.webContents ) mainWindow.webContents.send(_type, _message);
    }
};

