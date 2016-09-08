
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

(function() {
    var app = require('electron').app;
    var ipc = require('electron').ipcMain;
    var fs = require('fs');
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
                    //console.logger("******");
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
            path: '/content/dam-files/mnimer',
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