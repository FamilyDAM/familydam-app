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

var Rx = require('rx');
var PreferenceStore = require('../../stores/PreferenceStore');
var UserActions = require('../../actions/UserActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(){
        console.log("{GetUsers Service} subscribe");
        this.sink = UserActions.getUsers.sink;
        UserActions.getUsers.source.distinctUntilChanged().subscribe(this.getUsers.bind(this));
    },

    /**
     * Return all of the users
     * @param val_
     * @returns {*}
     */
    getUsers: function()
    {
        var _this = this;
        return $.ajax({
                    'method':'get'
                    ,'url': PreferenceStore.getBaseUrl() +'/api/users'
                    , cache: false
                }).then(function(results){
                    var list = [];

                    results.map(function(item) {

                        if( item.firstName === undefined )
                        {
                            item.firstName = item.username;
                        }
                        list.push(item);
                    });

                    var _sortedUsers = list.sort(function (a, b) { return b.username - a.username; });
            console.dir(_this.sink);
                    _this.sink.onNext(_sortedUsers);
                });

    }

};

