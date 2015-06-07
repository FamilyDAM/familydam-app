/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var splashWindow = null;
var configWindow = null;
var mainWindow = null;


// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Create the browser window.
    app.setupWindows();
    // Show splash screen, while starting embedded server
    app.loadSplashApplication();

});



/******************************
 * App level functions
 */


app.setupWindows = function(){
    splashWindow = new BrowserWindow({width:600, height:400, center:true, frame:false, show:true});
    configWindow = new BrowserWindow({width:600, height:400, center:true, frame:false, show:false});
    mainWindow = new BrowserWindow({
        width:1024,
        height:800,
        center:true,
        frame:true,
        show:false,
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

}


app.loadSplashApplication = function(){


    // and load the index.html of the app.
    splashWindow.loadUrl('file://' + __dirname + '/apps/splash/index.html');
    splashWindow.focus();

    // Check the settings configuration before opening up the main app.
    var _this = this;
    var timer = setInterval(function(){
        clearTimeout(timer);
        _this.splashWindow = null;
        configurationManager.initializeServer(app, configWindow);
    }, 2000);


}


app.loadDashboardApplication = function(port){

    console.log("{loadDashboardApplication} " +"http://localhost:" +port +"/index.html");

    splashWindow.hide();
    configWindow.hide();
    mainWindow.show();
    mainWindow.maximize();

    // Open the devtools.
    mainWindow.openDevTools();

    //mainWindow.loadUrl('file://' + __dirname  +'/apps/dashboard/index.html');
    mainWindow.loadUrl("http://localhost:" +port +"/index.html");

}




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
