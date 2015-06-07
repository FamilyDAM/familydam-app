
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');

// Report crashes to our server.
require('crash-reporter').start();




// Parse command line options.
var argv = process.argv.slice(1);
var option = { version: null, help: null, debug: false };
for (var i in argv) {
    if (argv[i] == '--version' || argv[i] == '-v') {
        option.version = true;
        break;
    } else if (argv[i] == '--help' || argv[i] == '-h') {
        option.help = true;
        break;
    } else if (argv[i] == '--debug' || argv[i] == '-d') {
        option.debug = true;
        continue;
    } else if (argv[i][0] == '-') {
        continue;
    } else {
        option.file = argv[i];
        break;
    }
}


if (option.version) {
    console.log('v' + process.versions.electron);
    process.exit(0);
} else if (option.help) {
    var helpMessage = "FamilyD.A.M v" + process.versions.electron + " - Digital Asset Manager for the whole family\n";
    helpMessage    += "Options:\n";
    helpMessage    += "  -h, --help            Print this usage message.\n";
    helpMessage    += "  -v, --version         Print the version.";
    console.log(helpMessage);
    process.exit(0);
} else {
    require('./familydam-app.js');
}


