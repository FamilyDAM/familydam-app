
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var app = require('electron').app;  // Module to control application life.
var logger = require('electron-log');
import FamilyDamRepository from './familydam-repository.js';


// Report crashes to our server.
const {crashReporter} = require('electron');


crashReporter.start({
    productName: 'FamilyDAM',
    companyName: '11:58 Labs',
    submitURL: 'https://www.familydam.com/api/v1/crashreporter',
    autoSubmit: true
});



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
    console.log("Starting Application");
    app.on('ready', function() {
        console.log("App Is Ready, launching repository");
        this.familyDamRepository = new FamilyDamRepository();
    });
}


