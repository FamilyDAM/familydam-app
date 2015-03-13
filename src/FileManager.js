
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
    var request = require('request');
    var path = require('path');

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


    /**
     * Deprecated, now we send the path to the server and let it grab the file.
     */
    ipc.on('uploadFile', function(event, dir, path) {
        console.log("{node} upload file:" +path);
        //console.dir(event);
        //console.dir(path);
        //var name = path.basename(path);
        var data = fs.readFileSync(path);



        /* As per http://www.w3.org/Protocols/rfc1341/7_2_Multipart.html */
        var crlf = "\r\n";
        var boundary = "---------------------------10102754414578508781458777923"; // Boundary: "--" + up to 70 ASCII chars + "\r\n"
        var delimiter = crlf + "--" + boundary;
        var preamble = ""; // ignored. a good place for non-standard mime info
        var epilogue = ""; // ignored. a good place to place a checksum, etc
        var headers = [
                "Content-Disposition: form-data; name=\"fileToUpload\"; filename=\"testname.jpg\"" + crlf
            ];
        var bodyPart = headers.join('') + crlf + data.toString();
        var encapsulation = delimiter + crlf + bodyPart;
        var closeDelimiter = delimiter + "--";
        var multipartBody; // = preamble + encapsulation + closeDelimiter + epilogue + crlf /* node doesn't add this */;


        multipartBody = Buffer.concat([
            new Buffer(preamble + delimiter + crlf + headers.join('') + crlf),
            data,
            new Buffer(closeDelimiter + epilogue)
        ]);
        console.log("multipart len=" +multipartBody.length);


        var request = http.request({
            hostname: 'localhost',
            port: 8080,
            path: '/dam:files/documents/mnimer',
            method: 'POST',
            auth: 'admin:admin',
            headers: {
                "Content-Disposition": "form-data; name='fileToUpload'; filename='testname.jpg'",
                "User-Agent": "FamilyDAM",
                "Accept-Encoding": "gzip,deflate",
                "Content-Type": "multipart/form-data; boundary=" + boundary,
                "Content-Length": multipartBody.length
            }

        });

        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        // write data to request body
        request.write(multipartBody);
        request.end();
    });



    // put public properties & methods here.
    module.exports = {};
    console.log("FileManager INIT()");
}).call(this);