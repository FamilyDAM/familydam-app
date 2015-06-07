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

var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var serverManager = require('./ServerManager');
var configurationManager = require('./ConfigurationManager');
var fileManager = require('./FileManager');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();




// Parse command line options.
var argv = process.argv.slice(1);
var option = { file: null, help: null, version: null, webdriver: null };
for (var i in argv) {
    if (argv[i] == '--version' || argv[i] == '-v') {
        option.version = true;
        break;
    } else if (argv[i] == '--help' || argv[i] == '-h') {
        option.help = true;
        break;
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


