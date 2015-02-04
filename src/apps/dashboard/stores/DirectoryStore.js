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
var UserStore = require('./UserStore');
var SearchStore = require('./SearchStore');
var PreferenceStore = require('./PreferenceStore');
//di              = require('di');

module.exports = {


    /**
     * List all directories visible to a user
     * @returns {*}
     */
    listDirectories: function(rootPath_)
    {
        return Rx.Observable.defer(function () {
            return $.ajax({
                method: "get",
                url: PreferenceStore.getBaseUrl() +"/api/directory/tree",
                data: {'path':rootPath_},
                headers: {
                    "Authorization":  UserStore.getUser().token
                }
            });
        });
    },


    listFilesInDirectory: function(path_)
    {

        return Rx.Observable.defer(function () {
            return $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() +"/api/directory/",
                data: {'path':path_},
                headers: {
                    "Authorization":  UserStore.getUser().token
                }
            });
        }).map(function(results_){
            SearchStore.setResults(results_);
            return results_;
        });
    }


};

//di.annotate(AuthActions, new di.Inject());


