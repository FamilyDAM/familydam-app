
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

(function() {
    const {app, dialog} = require('electron');
    var os = require('os');
    var fs = require('fs');
    var http = require('http');

    // child process
    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;

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
    var settings;
    var logger = require('electron-log');


    var link = function(_settings, _appRoot, _splashWindow, _configWindow, _mainWindow)
    {
        //logger.debug("{serverManager} link");
        //logger.debug(_settings);

        settings = _settings;
        appRoot = _appRoot;
        splashWindow = _splashWindow;
        configWindow = _configWindow;
        mainWindow = _mainWindow;
    };



    var checkLoadingStatus = function(host, port, callback_)
    {
        logger.debug("Check Loading Status | host=" +host +" | port=" +port);

        checkServerInterval = setInterval(function ()
        {
            var _url = "http://admin:admin@" +host +":" +port +"/bin/familydam/api/v1/health";
            logger.debug("checking server | " +_url);

            http.get(_url, function (res, data)
            {

                if (res.statusCode == 200 || res.statusCode == 302)
                {
                    logger.debug("Health Check Cleared");
                    var body = '';
                    res.on('data', function(d) {
                        body += d;
                    });
                    res.on('end', function() {
                        logger.debug("[end]" +body);
                        // Data reception is done, do whatever with it!
                        var parsed = JSON.parse(body);

                        if( parsed.status == "OK")
                        {
                            callback_();
                            clearInterval(checkServerInterval);
                        }else{
                            //console.dir(parsed);
                        }
                    });

                }else{
                    logger.debug("Check Interval Status :" +res.statusCode)
                }
            }).on('error', function (e)
            {
                logger.error("error: " + e.message);
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
                logger.debug( "[STARTED]" +_data );
            }
            else if (_data.indexOf("ERROR") > -1)
            {
                logger.debug( "[ERROR] " +_data );
            }
            else if (_data.indexOf("WARN") > -1)
            {
                logger.debug( "[WARN] " + _data );
            }
            else{
                logger.debug( "--" +_data );
            }

            //fs.appendFile(logFile_, _data);
        }
        catch (err)
        {
            logger.debug("[ERROR] ** " +err);
        }
    }



    module.exports = {


        startServer : function(settings_, app_, configWindow_, splashWindow_, mainWindow_)
        {
            logger.debug("Startup System Check");
            logger.debug("TotalMem: " +os.totalmem() +" - FreeMem:" +os.freemem());

            link(settings_, app_, splashWindow_, configWindow_, mainWindow_);

            // setup logs
            var outLogFile = settings_['storageLocation'] +'/familydam-out.log';
            var outLogErrFile = settings_['storageLocation'] +'/familydam-err.log';

            logger.debug("Repository Log File: " +outLogFile);
            logger.debug("Repository Log Error File: " +outLogErrFile);



            var jarPath = settings_['storageLocation'] +"/FamilyDAM-" +settings_['version'] +".jar";
            var jarHost = settings_['host'];
            var jarPort = settings_['port'];



            logger.debug("Starting Server!: " +jarPath +" | port=" +jarPort +" | location=" +settings_['storageLocation'], true);
            app_.sendClientMessage('info', "Starting FamilyDAM Repository", false);
            logger.debug("Resource Path=" +process.resourcesPath);




            var cmd = "java";
            var _repo = settings_['storageLocation'];
            //var args = ['-jar',  jarPath, '-p', jarPort, '-Dspring.profiles.active='+settings_['profile'], '-Dapp-root', settings_['storageLocation'] ];
            var args = ['-jar',  jarPath, '-p',  jarPort, '-c', settings_['storageLocation'], '-Dspring.profiles.active='+settings_['profile'] ];


            logger.debug("check java version");
            version_prc = exec("java -version", {encoding: 'utf8'}, (error, stdout, stderr) => {
                console.log("err=" +error);
                if (error) {
                    dialog.showErrorBox("Startup Error", "Unknown error.\nMake sure you have the latest version of Java installed\nhttps://java.com\n\n" +error);
                    return;
                }else{

                    //console.logger(`stdout: ${stdout}`);
                    //console.logger(`stderr: ${stderr}`);

                    // support anything greater then version 8  (pattern matches 8-29)
                    if( stderr.match(/1\.[1,2,8,9][0-9]?.[0-9_]+/) )
                    {
                        logger.debug("Version Check OK - Starting Repository");
                        this.startRepository(cmd, args, spawn, _repo);

                        //Start checks
                        var isReady = false;
                        checkLoadingStatus(jarHost, jarPort, function(){
                            appRoot.loadDashboardApplication(jarHost, jarPort);
                        });

                    }else{
                        //alert("Startup Error", "Invalid version of java | " +stderr);
                        dialog.showErrorBox("Startup Error", "Invalid version of JAVA.Make sure you have the latest version of Java installed\nhttps://java.com\n\n" +stderr);
                    }
                }

            });

        },

        startRepository:function(cmd, args, spawn) {
            logger.info("start repo | " + cmd + " | " + args);
            prc = spawn(cmd, args);
            prc.unref();
            prc.stdout.setEncoding("utf8");
            prc.stdout.on('data', function (data) {
                logger.debug("[data] " + data);
                //processStdOut(data, outLogFile);
            });
            prc.stderr.on('data', function (data) {
                logger.debug("[ERR] " + data);
            });
            prc.on('exit', function (data, a2, a3) {
                logger.debug("[exit] " + data + ":" + a2 + ":" + a3);
            });
        },

        kill : function()
        {
            logger.info("Kill Repository");
            if( prc !== undefined ) prc.kill();
            if( checkServerInterval !== undefined ) clearInterval(checkServerInterval);
        }
    };


}).call(this);