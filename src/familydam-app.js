/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

const {app} = require('electron');  // Module to control application life.
const {BrowserWindow} = require('electron');  // Module to create native browser window.
var http = require('http');
var fs = require('fs');
var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');
//logger
var logger = require('electron-log');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var splashWindow = null;
var configWindow = null;
var mainWindow = null;
var isServerReady = false;

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Log level
    logger.transports.console.level = 'debug';
    logger.transports.file.level = 'debug';
    /**
     * Set output format template. Available variables:
     * Main: {level}, {text}
     * Date: {y},{m},{d},{h},{i},{s},{ms}
     */
    logger.transports.console.format = '{h}:{i}:{s}:{ms} {text}';



    // Create the browser window.
    app.setupWindows();

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


        logger.debug("Load Splash Screen");
        app.loadSplashApplication();


        logger.debug("Start Repository");
        configurationManager.initializeStorageLocation(_settings);
        app.startServerApplication(_settings);


        /***
         // Show splash screen, while starting embedded server
         app.loadSplashApplication();


         // setup check status
         var timer = setInterval(function(){
            //check if server is ready, before closing. Otherwise wait 2secs and try again.
            if( _this.isServerReady )
            {
                clearTimeout(timer);
                _this.splashWindow = null;
                _this.loadDashboardApplication(_settings.port);
            }else{
                _this.checkServer(_settings.port);
            }
        }, 2000);

         // start embedded java server
         app.startServerApplication(_settings);
         ***/
    }
});




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
app.setupWindows = function(){
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



app.startServerApplication = function(_settings){

    logger.info("Start Embedded Repository");
    logger.debug(_settings);
    serverManager.startServer(_settings, app, this.splashWindow, this.configWindow, this.mainWindow );

};


app.loadSplashApplication = function(){

    configWindow.hide();

    // and load the index.html of the app.
    splashWindow.loadURL('file://' + __dirname + '/apps/splash/index.html');
    splashWindow.show();
    splashWindow.focus();
    //splashWindow.openDevTools();


    /** useful snippet of code, saving it for future reference
     splashWindow.webContents.on('did-finish-load', function() {
        splashWindow.webContents.executeJavaScript("alert('start splash page');");
    });
     **/


};


app.loadDashboardApplication = function(host, port){

    console.log("{loadDashboardApplication} " +"http://" +host +":" +port +"/index.html");

    splashWindow.hide();
    configWindow.hide();
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
    serverManager.kill();
});


// Quit when all windows are closed.
app.on('will-quit', function() {
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
    console.log("Open-URL: " +path);

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
    console.log("TODO Open-FILE: " +url);
});




/*****************************
 * Messaging
 */

app.sendClientMessage = function(_type, _message, _logToConsole)
{
    if( _logToConsole )
    {
        console.log("{sendClientMessage}");
        console.dir(_type);
        console.dir(_message);
    }
    if (splashWindow !== undefined && splashWindow.webContents != null) splashWindow.webContents.send(_type, _message);
    if (mainWindow !== undefined && mainWindow.webContents != null) mainWindow.webContents.send(_type, _message);
};

