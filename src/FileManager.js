
/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    var app = require('app');
    var fs = require('fs');
    var ipc = require('ipc');
    var http = require('http');
    var dialog = require('dialog');
    var File = require('File');

    /******************************
     * RECEIVED Messages
     */
    ipc.on('openFileDialog', function(event) {
        console.log("selectFileDialog:" +event);
        //console.dir(event);
        dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}, function(files){
            //console.dir(files);
            var fileInfo = [];
            for (var i = 0; i < files.length; i++)
            {
                var file = files[i];
                try {
                    // Query the entry
                    var stats = fs.statSync(file);
                    //console.log("******");
                    //console.dir(file);
                    //console.dir(stats);


                    var fObj = {};
                    fObj.path = file;
                    fObj.extension = "";
                    if( file.substr(file.lastIndexOf('.') > 0)){
                        fObj.extension = file.substr(file.lastIndexOf('.')+1).toLowerCase();
                    }
                    fObj.size = stats.size;
                    fObj.isDirectory = false;
                    if (stats.isDirectory()) {
                        // Is it a directory?
                        fObj.isDirectory = true;
                    }
                    fileInfo.push(fObj);
                }
                catch (e) {
                    // ...
                }
            }

            console.dir(fileInfo);
            //event.returnValue = files;
            event.sender.send('openFileDialogReply', fileInfo);
        });
    });

    var multipart = require("multipart");


    ipc.on('uploadFile', function(event, path) {
        console.log("{node} upload file:" +path);
        //console.dir(event);
        //console.dir(path);

        var _file = new File(path);
        // request.get(href || pathname, query, body, options).when(callback)
        request.post("http://localhost:8080/~/photos/mnimer", null, {
            message: 'Hello World',
            attachment: _file
        }).when(function (err, ahr, data) {
            console.log('\n\nGot Response\n');
            console.log(data.toString());
        });

    });



    // put public properties & methods here.
    module.exports = {};
    console.log("FileManager INIT()");
}).call(this);