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

'use strict';
var Rx = require('rx');

module.exports = {

    /**
     * TODO, figure out how to subscribe to this subject from inside the store, pull instead of push
     */
    // called when a user wants to queue up a file for upload
    addFileAction: new Rx.Subject(),
    
    // called when file from the queue
    removeFileAction: new Rx.Subject(),

    // called when a user wants to remove all queued files
    removeAllFilesAction: new Rx.Subject(),

    // called for each file that users want to upload
    uploadFileAction: {'source':new Rx.Subject(), 'sink':new Rx.Subject()},

    // called when a user wants to start uploading all files in the queue
    uploadAllFilesAction: new Rx.Subject(),

    //
    uploadCompleteFileAction: new Rx.Subject(),

    // while a file is uploading it will throw multiple status messages during the process
    fileStatusAction: new Rx.Subject()

};

