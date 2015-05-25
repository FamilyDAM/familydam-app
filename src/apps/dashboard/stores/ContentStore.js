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
//di              = require('di');
var PreferenceStore = require('./PreferenceStore');
var UserStore = require('./UserStore');
var NodeActions = require('./../actions/NodeActions');

// Logged in user



module.exports = {

    currentNode:new Rx.BehaviorSubject({}),


    subscribe: function()
    {
        console.log("{ContentStore}.init()");

        NodeActions.getNode.sink.subscribe(this.setCurrentNode.bind(this));
    },

    setCurrentNode: function(data_){
        this.currentNode.onNext( data_ );
    }


};

//di.annotate(AuthActions, new di.Inject());


