/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var http = require('http');
var fs = require('fs');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var splashWindow = null;
var configWindow = null;
var mainWindow = null;
var isServerReady = false;

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Create the browser window.
    app.setupWindows();

    var isReady = configurationManager.initializeServer(app, configWindow, splashWindow, mainWindow);


    if( isReady )
    {
        var _this = this;
        var _settings = configurationManager.getSettings();

        console.log("Start app with these settings:");
        console.dir(_settings);

        console.log("** Start Server");
        app.startServerApplication(_settings);
        console.log("** load splash");
        app.loadSplashApplication();


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

    http.get("http://localhost:" +port +"/index.html", function(res) {
        if( res.statusCode == 200 ){
            _this.isServerReady = true;
        }
    }).on('error', function(e) {
        _this.isServerReady = false;
        console.log("check status: " +e.message);
    });
};

/**
 * Setup all of the primary windows here, so we will also have a reference to close them.
 */
app.setupWindows = function(){
    splashWindow = new BrowserWindow({width:600, height:400, center:true, frame:false, show:false, type:"splash"});
    configWindow = new BrowserWindow({width:750, height:440, center:false, frame:true, show:false, type:"desktop",});
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
            app.quit();
        }
    });

};


app.startServerApplication = function(_settings){

    console.log("Start Embedded Server");
    console.dir(_settings);
    serverManager.startServer(_settings, app, this.splashWindow, this.configWindow, this.mainWindow );

};

app.loadSplashApplication = function(){

    configWindow.hide();

    // and load the index.html of the app.
    splashWindow.loadUrl('file://' + __dirname + '/apps/splash/index.html');
    splashWindow.show();
    splashWindow.focus();


    /** useful snippet of code, saving it for future reference
     splashWindow.webContents.on('did-finish-load', function() {
        splashWindow.webContents.executeJavaScript("alert('start splash page');");
    });
     **/


};


app.loadDashboardApplication = function(port){

    console.log("{loadDashboardApplication} " +"http://localhost:" +port +"/index.html");

    splashWindow.hide();
    configWindow.hide();
    mainWindow.maximize();
    mainWindow.show();

    // Open the devtools.
    mainWindow.openDevTools();


    //mainWindow.loadUrl('file://' + __dirname  +'/apps/dashboard/index.html');
    mainWindow.loadUrl("http://localhost:" +port +"/index.html");


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
    childWindow.loadUrl(path);

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

