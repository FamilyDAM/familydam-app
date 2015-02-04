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

var PreferenceStore = require("./PreferenceStore");

module.exports = {

    _results : [],


    getResults : function() {
        return this._results;
    },
    setResults : function(val_) {
        this._results = val_;
    },


    /**
     * Search all files with limit/offset paging support, used by the grid view.
     * @param path
     * @param successCallback
     * @param errorCallback
     * @returns {*|Array|Object|Mixed|promise|HTMLElement}
     */
    searchImages : function(limit, offset, filterPath, filterTags, filterDateFrom, filterDateTo )
    {
        //todo: add support for these
        console.log(filterPath);
        console.log(filterTags);
        console.log(filterDateFrom);
        console.log(filterDateTo);

        return Rx.Observable.defer(function () {
            $.ajax({
                method: "post",
                url: PreferenceStore.getBaseUrl() +"/api/search/images",
                data: {
                    "limit":limit,
                    "offset":offset,
                    "orderBy": "jcr:lastModified"
                },
                headers: {
                    "Authorization":  UserStore.getUser().token
                }
            });
        });
    }

};

//di.annotate(AuthActions, new di.Inject());


