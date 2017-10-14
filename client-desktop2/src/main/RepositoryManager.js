import {screen, app, BrowserWindow, dialog} from 'electron';
import {totalmem, freemem, platform} from 'os';
import {spawn, exec} from 'child_process';
import { join } from 'path';
import http from 'http';

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

class RepositoryManager {


    constructor(settings_, logger_) {
        console.log("{RepositoryManager} constructor");

        this.settings = settings_;
        this.logger = logger_;
    }

    getMaxMemArg()
    {
        var totalMB = totalmem() / 1024 / 1024 / 1024;
        var partialMB = totalMB / 4;

        if( partialMB > 1 )
        {
            return "-Xmx" +(partialMB*1024) +"M";
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
            http.get(_url, function (res, data) {
                console.log("checking server | " +_url);
                console.log(res.statusCode);
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

    startServer() //, app_, configWindow_, splashWindow_, mainWindow_)
    {
        console.log(platform);
        console.log(this.settings);
        console.log("{RepositoryManager} Start Server: TotalMem: " +totalmem() +" - FreeMem:" +freemem());


        var _storageLocation = this.settings.storageLocation;
        var _host  = this.settings.host;
        var _port = this.settings.port;
        var _version = this.settings.version;
        var _profile = this.settings.profile;

        //app_.sendClientMessage('info', "Starting FamilyDAM Repository", false);

        // setup logs
        var outLogFile = _storageLocation +'/familydam-out.log';
        var outLogErrFile = _storageLocation +'/familydam-err.log';
        var repoPath = _storageLocation;
        var jarPath = _storageLocation +"/FamilyDAM-" +_version +".jar";
        var javaPath = join(__static, "../../resources/java/jre1.8.0_144.jre/Contents/Home/bin/java");
        //var javaPath = "java";
        var javaArgs = ['-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005', '-jar',  jarPath, '-p',  _port, '-c', _storageLocation, '-Dspring.profiles.active='+_profile ];

        console.log("{RepositoryManager} Java: " +jarPath);
        console.log("{RepositoryManager} Repository: " +repoPath);
        console.log("{RepositoryManager} Repository Log File: " +outLogFile);
        console.log("{RepositoryManager} Repository Log Error File: " +outLogErrFile);
        console.log("{RepositoryManager} Starting Server: " +jarPath +" | host=" +_host +" | port=" +_port +" | location=" +_storageLocation, true);
        //console.logger(`stdout: ${stdout}`);
        //console.logger(`stderr: ${stderr}`);


        var isStartupComplete = false;
        this.prc = spawn(javaPath, javaArgs);
        this.prc.unref();
        this.prc.stdout.setEncoding("utf8");
        this.prc.stdout.on('data', function (data_) {
            //logger.debug("[data] " + data);
            //processStdOut(data, outLogFile);
            console.log("[stdout] " +data_);

            if( data_.indexOf("Startup completed") > -1 ){
                console.log("{RepositoryManager} startupComplete");
                isStartupComplete = true;
            }
        });
        this.prc.stderr.on('data', function (data_) {
            //logger.debug("[ERR] " + data);
            console.log("[stderr] " +data_);
        });
        this.prc.on('exit', function (data_) {
            //logger.debug("[exit] " + data + ":" + a2 + ":" + a3);
            console.log("[exit] " + data_ );
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
        console.log("{RepositoryManager} this.openConfigWindow() - " +_url);

        var window = new BrowserWindow({
            width:width,
            height:height,
            center:true,
            frame:true,
            show:false,
            'web-preferences': {'web-security': false},
            title:'FamilyDAM - The Digital Asset Manager for Families'});

        window.openDevTools();
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