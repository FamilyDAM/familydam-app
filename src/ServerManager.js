
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

(function() {
    var app = require('app');
    var os = require('os');
    var fs = require('fs');
    var ipc = require('ipc');
    var http = require('http');

    //reference back to main window
    var appRoot;
    var splashWindow;
    var configWindow;
    var mainWindow;

    // local properties
    var checkServerInterval;
    var serverLoaded = false;
    var serverStarted = false;
    var userServletStarted = false;
    var prc;
    var tail;
    var tailErr;
    var settings;

    var link = function(_settings, _appRoot, _splashWindow, _configWindow, _mainWindow)
    {
        //console.log("{serverManager} link");
        console.log("Settings:");
        console.dir(_settings);
        settings = _settings;
        appRoot = _appRoot;
        splashWindow = _splashWindow;
        configWindow = _configWindow;
        mainWindow = _mainWindow;
    };



    var checkLoadingStatus = function(callback_)
    {
        //console.log("Check Loading Status");

        checkServerInterval = setInterval(function ()
        {
            //console.log("checking server");

            http.get("http://localhost:9000/health", function (res, data)
            {
                if (res.statusCode == 200 || res.statusCode == 302)
                {
                    var body = '';
                    res.on('data', function(d) {
                        body += d;
                    });
                    res.on('end', function() {
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);

                        if( parsed.status == "UP")
                        {
                            callback_();
                            clearInterval(checkServerInterval);
                        }else{
                            console.dir(parsed);
                        }
                    });

                }
            }).on('error', function (e)
            {
                //console.log("error: " + e.message);
                return false;
            });

        }, 500);



    };


    var getMaxMemArg = function ()
    {
        var totalMB = os.totalmem() / 1024 / 1024 / 1024;
        var partialMB = totalMB / 4;

        if( partialMB > 1 )
        {
            return "-Xmx" +(partialMB*1024) +"M";
        }else{
            return "-Xmx512M";
        }
    };


    var isStarted = false;
    function processStdOut(_data, logFile_)
    {
        fs.appendFile(logFile_, _data);
        //console.log( _data );
        try
        {
            if (_data.indexOf("Tomcat started") != -1)
            {
                //console.log( _data );
            }
            else if (_data.indexOf("Started FamilyDAM") > -1)
            {
                isStarted = true;
                console.log( _data.toString() );
            }
            else if (_data.indexOf("ERROR") > -1)
            {
                console.log( _data.toString() );
            }
            else if (_data.indexOf("WARN") > -1)
            {
                console.log( _data.toString() );
            }
            else if( isStarted ){
                console.dir( _data.toString() );
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    module.exports = {

        startServer : function(settings_, app_, configWindow_, splashWindow_, mainWindow_)
        {
            var _this = this;
            //console.log("Starting Server");
            console.log("Startup System Check | TotalMem: " +os.totalmem() +" - FreeMem:" +os.freemem(), true);

            link(settings_, app_, splashWindow_, configWindow_, mainWindow_);

            // setup logs
            var outLogFile = settings_['storageLocation'] +'/familydam-out.log';
            var outLogErrFile = settings_['storageLocation'] +'/familydam-err.log';

            var spawn = require('child_process').spawn;

            var jarPath = "FamilyDAM.jar";
            var jarPort = settings_['port'];

            var cmd = "java";
            var args = ['-jar',  jarPath, '-p', jarPort, '-Dapp-root', settings_['storageLocation'] ];


            app_.sendClientMessage('info', "Starting FamilyDAM Server", false);
            //console.log("Starting Server: " +jarPath +":" +jarPort, true);
            ///console.log("resourcePath=" +process.resourcesPath);

            var _cwd = settings_['storageLocation'];
            //console.log(cmd);
            console.log(args);
            //console.dir(_cwd);
            //console.dir(prc);
            prc = spawn(cmd,  args, {
                cwd: _cwd
            });
            prc.unref();
            prc.stdout.setEncoding("utf8");
            prc.stdout.on('data', function (data)
            {
                processStdOut(data, outLogFile);
            });



            var isReady = false;
            checkLoadingStatus(function(){
                appRoot.loadDashboardApplication(jarPort);
            })



            if (process.platform == 'darwin' || process.platform == 'linux')
            {
                try
                {
                    //console.log("kill existing java processes");
                    //var killExistingJavaProc = spawn('pkill', ['-f', 'java.*FamilyDAM']);
                }catch (err){ /* swallow */ }
            }

        },

        kill : function()
        {
            if( prc !== undefined ) prc.kill();
            if( tail !== undefined ) tail.kill();
            if( tailErr !== undefined ) tailErr.kill();
            if( checkServerInterval !== undefined ) clearInterval(checkServerInterval);
        }
    };


}).call(this);