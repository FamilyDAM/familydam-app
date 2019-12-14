import {screen, app, BrowserWindow, dialog} from 'electron';
import {totalmem, freemem, platform} from 'os';
import {spawn, exec} from 'child_process';
import { join } from 'path';
import http from 'http';
import {version} from './package.json';

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
});

class RepositoryManager {


    constructor(settings_, logger_) {
        this.settings = settings_;
        this.logger = logger_;
        this.logger.debug("{RepositoryManager} constructor");
    }

    getMaxMemArg()
    {
        var totalMB = totalmem() / 1024 / 1024 / 1024;
        var partialMB = totalMB / 4;

        if( partialMB > 1 )
        {
            return "-Xmx" +(Math.floor(partialMB*1024)) +"M";
        }else{
            return "-Xmx512M";
        }
    }


    kill()
    {
        this.logger.info("{RepositoryManager} Kill Repository");
        if( this.prc ) this.prc.kill();
        //if( this.checkServerInterval ) clearInterval(this.checkServerInterval);
    }


    checkStatus(callback){
        var _url = "http://" +this.settings.host +":" +this.settings.port +"/index.html";// +"/bin/familydam/api/v1/health";

        try {
            http.get(_url,  (res, data) => {
                if( !res.statusCode ) res.statusCode = -1;
                this.logger.debug("checking server | [" +res.statusCode +"] " +_url);
                if (res.statusCode == 200) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }catch(err){
            callback(false);
        }

    }

    startServer(callback_) //, app_, configWindow_, splashWindow_, mainWindow_)
    {
        this.logger.debug(platform);
        this.logger.debug(this.settings);
        this.logger.debug("{RepositoryManager} Start Server: TotalMem: " +totalmem() +" - FreeMem:" +freemem());


        var _storageLocation = this.settings.storageLocation;
        var _host  = this.settings.host;
        var _port = this.settings.port;
        var _version = this.settings.version;
        var _profile = this.settings.profile;

        //app_.sendClientMessage('info', "Starting FamilyDAM Repository", false);

        // setup logs
        var repoPath = _storageLocation;
        var outLogFile = join(_storageLocation, '/familydam-out.log');
        var outLogErrFile = join(_storageLocation, '/familydam-err.log');
        var jarPath = join(_storageLocation, "/FamilyDAM-" +_version +".jar");

        var javaPath = join(_storageLocation, "/jre/jre1.8.0_144/bin/java");
        if( platform() === "darwin" ) {
            javaPath = join(_storageLocation, "/jre/jre1.8.0_144.jre/Contents/Home/bin/java");
        }
        //var javaPath = "java";
        //var javaArgs = ['-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005', '-jar',  jarPath, '-p',  _port, '-c', _storageLocation, '-Dspring.profiles.active='+_profile ];
        var javaArgs = [this.getMaxMemArg(), '-jar',  jarPath, '-p',  _port, '-c', _storageLocation, '-Dspring.profiles.active='+_profile ];

        this.logger.info("{RepositoryManager} Java: " +javaPath);
        this.logger.info("{RepositoryManager} JavaOpts: " +javaArgs);
        this.logger.info("{RepositoryManager} Repository: " +repoPath);
        this.logger.info("{RepositoryManager} Repository Log File: " +outLogFile);
        this.logger.info("{RepositoryManager} Repository Log Error File: " +outLogErrFile);
        this.logger.info("{RepositoryManager} Starting Server: " +jarPath +" | host=" +_host +" | port=" +_port +" | location=" +_storageLocation);


        var isStartupComplete = false;
        this.prc = spawn(javaPath, javaArgs);
        this.prc.unref();
        this.prc.stdout.setEncoding("utf8");
        this.prc.stdout.on('data',  (data_) => {
            //logger.debug("[data] " + data);
            //processStdOut(data, outLogFile);
            this.logger.debug("[stdout] " +data_);

            if( data_.indexOf("Startup completed") > -1 ){
                this.logger.debug("{RepositoryManager} startupComplete");
                isStartupComplete = true;
                callback_(true);
            }
        });
        this.prc.stderr.on('data', (data_) => {
            //logger.debug("[ERR] " + data);
            this.logger.debug("[stderr] " +data_);
        });
        this.prc.on('exit',  (data_) => {
            //logger.debug("[exit] " + data + ":" + a2 + ":" + a3);
            this.logger.debug("[exit] " + data_ );
        });


        //Start checks
        /**
        var isReady = false;
        this.checkLoadingStatus(jarHost, jarPort, function(){
            appRoot.loadDashboardApplication(jarHost, jarPort);
        });
         **/

    }




    openRepoWindow(settings_) {

        const {width, height} = screen.getPrimaryDisplay().workAreaSize
        var _url = 'http://' +settings_.host +":" +settings_.port;
        this.logger.debug("{RepositoryManager} this.openConfigWindow() - " +_url);

        var window = new BrowserWindow({
            width:width,
            height:height,
            center:true,
            frame:true,
            show:false,
            'web-preferences': {'web-security': false},
            title:'FamilyDAM - The Digital Asset Manager for Families'});

        //window.openDevTools();
        window.loadURL(_url);
        window.show();

        // Emitted when the window is closed.
        window.on('closed', ()=>{
            this.kill();
        });

        return window;

    }
}

export default RepositoryManager;