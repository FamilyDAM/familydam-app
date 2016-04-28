
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



    var checkLoadingStatus = function(host, port, callback_)
    {
        console.log("Check Loading Status | host=" +host +" | port=" +port);

        checkServerInterval = setInterval(function ()
        {
            //console.log("checking server");

            http.get("http://" +host +":" +port +"/bin/familydam/api/v1/health", function (res, data)
            {
                if (res.statusCode == 200 || res.statusCode == 302)
                {
                    console.log("Health Check Cleared");
                    var body = '';
                    res.on('data', function(d) {
                        body += d;
                    });
                    res.on('end', function() {
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);

                        if( parsed.status == "OK")
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
        try
        {
            if (_data.indexOf("Started FamilyDAM") > -1)
            {
                isStarted = true;
                console.log( "[STARTED]" +_data );
            }
            else if (_data.indexOf("ERROR") > -1)
            {
                console.log( "[ERROR] " +_data );
            }
            else if (_data.indexOf("WARN") > -1)
            {
                console.log( "[WARN] " + _data );
            }
            else{
                console.log( "--" +_data );
            }

            //fs.appendFile(logFile_, _data);
        }
        catch (err)
        {
            console.log("[ERROR] ** " +err);
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

            console.log("Log File: " +outLogFile);
            console.log("Log Error File: " +outLogErrFile);



            var jarPath = "repository-" +settings_['version'] +".jar";
            var jarHost = settings_['host'];
            var jarPort = settings_['port'];



            console.log("Starting Server!: " +jarPath +" | port=" +jarPort +" | location=" +settings_['storageLocation'], true);
            app_.sendClientMessage('info', "Starting FamilyDAM Repository", false);
            console.log("Resource Path=" +process.resourcesPath);


            var _cwd = settings_['storageLocation'];
            //console.log(cmd);
            //console.log(args);
            console.dir(_cwd);


            var spawn = require('child_process').spawn;



            var cmd = "java";
            //var args = ['-jar',  jarPath, '-p', jarPort, '-Dspring.profiles.active='+settings_['profile'], '-Dapp-root', settings_['storageLocation'] ];
            var args = ['-jar',  jarPath, '-p',  jarPort, '-c', settings_['storageLocation'], '-Dspring.profiles.active='+settings_['profile'] ];

            console.log("checking java version");
            version_prc = spawn("java",["-version"], {
                cwd: _cwd
            });
            version_prc.stdout.on('data', function (data)
            {
                console.log("" +data);
                //processStdOut(data, outLogFile);
            });




            console.log("start repo");
            prc = spawn(cmd,  args, {
                cwd: _cwd
            });
            prc.unref();
            //prc.stdout.setEncoding("utf8");
            prc.stdout.on('data', function (data)
            {
                //console.log("" +data);
                processStdOut(data, outLogFile);
            });
            prc.stderr.on('data', function (data)
            {
                console.log("" +data);
            });
            prc.on('exit', function (data)
            {
                console.dir("exit:" +data);
            });




            var isReady = false;
            checkLoadingStatus(jarHost, jarPort, function(){
                appRoot.loadDashboardApplication(jarHost, jarPort);
            });




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