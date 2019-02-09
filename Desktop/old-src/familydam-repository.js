import {app, BrowserWindow, autoUpdater} from 'electron';  // Module to control application life.
import {version} from './package.json';
import {platform} from 'os';
import { join } from 'path';
import { format } from 'url';


class FamilyDAMRepository {

    constructor()
    {
        debugger;
        console.log("FamilyDAMRepository Constructor");

        var splashWindow = new BrowserWindow({width:600, height:400, center:true, frame:true, show:false,'web-preferences': {'web-security': false}});//, type:"splash"});
       
        var _url = format({
            pathname: join(__dirname, 'splash/index.html'),
            protocol: 'file:',
            slashes: true
        });

        splashWindow.show();
        splashWindow.openDevTools();
        splashWindow.loadURL(_url);


    }
}

export default FamilyDAMRepository;