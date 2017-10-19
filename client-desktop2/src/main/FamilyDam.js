import {app, BrowserWindow, autoUpdater, ipcMain} from 'electron';  // Module to control application life.
import {version} from './package.json';
import { join } from 'path';
import { format } from 'url';
import fs from 'fs';
import logger from 'electron-log';

import ConfigurationManager from './ConfigurationManager.js';
import RepositoryManager from './RepositoryManager.js';

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

class FamilyDAM {

    constructor()
    {
        console.log("{FamilyDAMRepository} Constructor");
        this.splashWindow = null;
        this.configWindow = null;
        this.splashWindow = this.openSplashWindow();


        this.configurationManager = new ConfigurationManager(logger, this.splashWindow);
        var isValidConfig = this.configurationManager.validateConfig();

        // configuration is invalid, open the config wizard
        //console.log("{FamilyDAMRepository} Constructor, is Valid config = " +isValidConfig);
        if( !isValidConfig ){
            // use a timer to let the splash screen stay open long enough to see it
            setTimeout(()=>{
                this.splashWindow.hide();
                this.configWindow = this.configurationManager.openConfigWindow();

                this.configWindow.on('closed', () => {
                    //console.log("{FamilyDAM} configWindow closed");
                    logger.info("{FamilyDAM} ConfigWindow closed, starting repository");
                    this.configWindow = null;
                    this.splashWindow.show();

                    logger.debug("Initialization is complete, starting server");
                    logger.debug(this.configurationManager.getSettings());
                    this.startRepository(this.configurationManager.getSettings());
                });
            }, 2000);

        }else{
            logger.debug("Config is OK, starting server");
            logger.debug(this.configurationManager.getSettings());
            this.startRepository(this.configurationManager.getSettings());
        }

    }


    startRepository(settings_){

        //update splash window message
        this.splashWindow.show();
        this.splashWindow.webContents.send("splashMessage", {"code":"start-repository", "message":"Starting Repository", "progress":"20%"});


        this.repositoryManager = new RepositoryManager(settings_, this.getLogger());
        this.repositoryManager.startServer();

        //wait 5 seconds then start checking the status
        setTimeout(()=> {

            this.checkTimer = setInterval(() => {

                try {
                    this.repositoryManager.checkStatus((isRunning) => {
                        if (isRunning) {
                            clearInterval(this.checkTimer);
                            if (this.splashWindow) this.splashWindow.hide();
                            if (this.configWindow) this.configWindow.hide();
                            this.repositoryWindow = this.repositoryManager.openRepoWindow(this.configurationManager.getSettings());

                            this.repositoryWindow.on('closed', function () {
                                app.quit();
                            });
                        }
                    });
                } catch (err) {
                    console.log(err);
                }

            }, 1000);

        }, 5000);


    }

    getLogger(){
        // Log level
        logger.transports.console.level = 'debug';
        logger.transports.file.level = 'info';
        /**
         * Set output format template. Available variables:
         * Main: {level}, {text}
         * Date: {y},{m},{d},{h},{i},{s},{ms}
         */
        logger.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

        /**
         * https://www.npmjs.com/package/electron-log
        var format = require('util');
        log.transports.console = function(msg) {
            var text = util.format.apply(util, msg.data);
            console.log(`[${msg.date.toLocaleTimeString()} ${msg.level}] ${text}`);
        };**/
        return logger;
    }


    openSplashWindow() {
        var window = new BrowserWindow({width: 600, height: 400, center: true, frame: true, show: true, type: "splash"});//, type:"splash"});

        var _url = format({
            pathname: join(__static, '/splash/index.html'),
            protocol: 'file:',
            slashes: true
        });

        //window.loadURL(join(__static, '/splash/index.html'));
        window.loadURL(_url);
        window.show();
        //window.openDevTools();


        window.on('ready', ()=>{
            this.splashWindow.webContents.send("splashMessage", {"code":"checking-config", "message":"Checking Configuration", "progress":"20%"});
        });

        // Emitted when the window is closed.
        window.on('closed', function() {
            logger.debug("{FamilyDAMRepository} window closed");
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.window = null;
        });

        return window;
    }
}

export default FamilyDAM;