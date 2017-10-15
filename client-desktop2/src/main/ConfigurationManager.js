import {BrowserWindow, ipcMain} from 'electron';  // Module to control application life.
import { join } from 'path';
import fs from 'fs';
import os from 'os';
import path from 'path';
//import targz from 'tar.gz';
import tar from 'tar';

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

class ConfigurationManager{


    constructor(splashWindow) {
        console.log("{ConfigurationManager} constructor");

        this.isValid = false;
        this.settingsFile = "../../resources/settings.json";
        this.settings = {};
        this.splashWindow = splashWindow;

        this.subscribeToConfigWizard();
    }

    getSettings(){
        return this.settings;
    }

    subscribeToConfigWizard(){

        /**
         * Call back handler which invoked from the webpage when all of the fields have been filled out.
         */
        ipcMain.on('saveConfig', (event, _settings)=>
        {
            console.log("save settings from config wizard: " +_settings );
            console.log("settings file" +this.settingsFile );
            console.log("static" +__static );

            // write back to file in package
            var _filePath = join( __static, this.settingsFile);
            console.log("settings file: " +_filePath);

            fs.writeFile( _filePath,  _settings, {'encoding':'utf8'},  (err, data)=>
            {
                console.log("settings saved");
                this.validateSettings();
            });

            event.returnValue = "save complete";
            //event.sender.send('saveConfigComplete', 'save complete');
        });

    }

    validateConfig(){
        this.isValid = this.validateSettings();
        //console.log("{ConfigurationManager} isValid=" +this.isValid);
        return this.isValid;
    }


    validateSettings() {

        console.log("{ConfigurationManager} validateSettings");
        var _filePath = join( __static, this.settingsFile);

        if( !fs.existsSync(_filePath) )
        {
            //console.warn("{ConfigurationManager} Settings file does not exists, loading App Config wizard. " +_filePath);
            return false;
        }else{

            var _settings = fs.readFileSync(_filePath, {'encoding': 'utf8'});
            this.settings = JSON.parse(_settings);

            console.log(this.settings);
            if (this.settings.state != "READY"){
                if (this.window){
                    this.window.close()
                }
                return true;
            } else {
                try {
                    if (this.window){
                        this.window.close()
                    }
                    this.splashWindow.webContents.send("splashMessage", {"code":"initialize-storage", "message":"Initialize Storage", "progress":"0%"});

                    //console.warn("{ConfigurationManager} Initialize Storage Locations. ");
                    this.initializeStorageLocation(this.settings);
                    //console.warn("{ConfigurationManager} Initialize JRE. ");
                    this.initializeJre();
                    return true;
                }catch(err){
                    console.error(err);
                    return false;
                }
            }
        }
    }


    initializeStorageLocation(settings_){
        console.log("{ConfigurationManager} Initialize Storage");
        console.log(settings_);

        if( !fs.existsSync(settings_.storageLocation) )
        {
            fs.mkdirSync(settings_.storageLocation);
        }

        var _root = join(__static, "../../resources");
        this.copyResourceDir(settings_.storageLocation, _root, "/");
    }



    initializeJre(){
        console.log("Unzip JRE | os=" +os.platform());

        var _jreDir = join(__static, "../../resources/java/");
        var _jreUnzipDir = join(__static, "../../resources/java/jre1.8.0_144.jre");

        console.log("jre=" +_jreDir);

        if (!fs.existsSync(_jreUnzipDir)){


            var _files = fs.readdirSync(_jreDir);
            for (var i = 0; i < _files.length; i++) {
                var file = _files[i];

                var _file = path.resolve(_jreDir, file);
                //console.log(_file);
                var _stat = fs.statSync(_file);
                //console.log(_stat);
                if( !_stat.isDirectory() && _file.endsWith(".gz") ) {
                    console.log("extracting: " +_file);
                    //fs.createReadStream(_file).pipe(unzip.Extract({path: _jreUnzipDir}));
                    tar.x(
                        {
                            file: _file,
                            cwd: _jreDir,
                            sync: true
                        });
                }
            }
        }

    }

    /**
     * Copy all of the files in a directory
     * @param path_
     */
    copyResourceDir(storageDir_, root_, path_)
    {
        console.log("{ConfigurationManager} copy resource dir - source=" +root_ +"  |  dest=" +path_);
        var path = root_ +path_;
        var _dirList = fs.readdirSync(path);

        for (var i = 0; i < _dirList.length; i++)
        {
            var _file = _dirList[i];
            var source = path +_file;
            var target = storageDir_ +"/" +_file;

            console.log("{ConfigurationManager} checking file - source=" +source +"  |  target=" +target);

            var stats =  fs.statSync(source);
            if( stats.isFile()  ){
                console.log("{ConfigurationManager} Copying '" +source +"' to "+storageDir_, false);
                fs.writeFileSync(target, fs.readFileSync(source));
            }else if( stats.isDirectory() ){
                //todo
            }
        }

    }


    openConfigWindow() {
        var _url = join(__static, '/config/index.html');
        //console.log("{ConfigurationManager} this.openConfigWindow() - " +_url);

        this.window = new BrowserWindow({width:750, height:440, center:false, frame:true, show:false, title:"FamilyDAM - Configuration Wizard"});
        this.window.openDevTools();
        this.window.loadURL('file://' +_url);
        this.window.show();

        return this.window;
    }
}

export default ConfigurationManager;