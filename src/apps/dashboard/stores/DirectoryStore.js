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
var DirectoryActions = require('./../actions/DirectoryActions');

module.exports = {

    root: "/dam:files/",

    /**
     * List of directories
     */
    directories: new Rx.BehaviorSubject([]),

    /**
     * the last folder selected by a user in the sidebar folder tree.
     * A simple property, stored in a behavior subject.
     * Note: the value is pushed from the DirectoryAction
     */
    currentFolder: new Rx.BehaviorSubject( {'path':"/dam:files/"} ),


    subscribe: function() {
        console.log("{DirectoryStore}.init()");

        DirectoryActions.selectFolder.subscribe( this.setCurrentFolder.bind(this) );
        DirectoryActions.getDirectories.sink.subscribe( this.setDirectories.bind(this) );
    },


    setCurrentFolder: function(data_){
        this.currentFolder.onNext(data_);
    },

    setDirectories: function(data_){
        this.directories.onNext(data_);
    }


};


