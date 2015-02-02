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
var PreferenceStore = require('../stores/PreferenceStore');

//di              = require('di');

module.exports = {

    listUsers: function () {

        try
        {
            var listUserObservable = Rx.Observable.defer(function () {
                return $.get(PreferenceStore.getBaseUrl() +'/api/users', {cache: false});
            }).map(function(results){
                var list = [];
                results.map(function(item){
                    item.firstName = item.username;
                    list.push(item);
                });
                return list.sort(function (a, b) { return b.username - a.username; });
            });
            return listUserObservable;

        }catch(err){
            console.log(err);
        }

    },


    login: function (_username, _password) {

        try
        {
            console.log(_username);
            console.log(_password);

            return Rx.Observable.defer(function ()
            {
                var _salt = new Date().getTime();
                return $.post(PreferenceStore.getBaseUrl() +'/api/users/login',
                    {'username':_username, 'password':_password, 'salt':_salt});
            });

        }catch(err){
            console.log(err);
        }

    }

};

//di.annotate(AuthActions, new di.Inject());


