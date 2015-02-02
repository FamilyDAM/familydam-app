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

// Logged in user



module.exports = {

    _user : {"token" : "Basic YWRtaW46YWRtaW4="},
    _basicAuthToken : "Basic YWRtaW46YWRtaW4=",

    getUser: function () {
        return this._user;
    },

    setUser: function (user_) {
        this._user = user_;
    },



    getBasicAuthToken: function () {
        return this._basicAuthToken;
    },

    setBasicAuthToken: function (token_) {
        this._basicAuthToken = token_;
    }

};

//di.annotate(AuthActions, new di.Inject());


