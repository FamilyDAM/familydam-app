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
var UserStore = require('../../stores/UserStore');
var AuthActions = require('../../actions/AuthActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(action_){
        console.log("{GetFiles Service} subscribe");
        this.sink = action_.sink;
        action_.source.distinctUntilChanged().subscribe(this.getDirectories.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    getDirectories: function(path_)
    {
        console.log("{GetDirectoryService} getDirectories()" );

        var _this = this;
        var _url = PreferenceStore.getBaseUrl() +"/api/directory/";

        console.dir(UserStore.token.value);

        return $.ajax({
            method: "get",
            url: PreferenceStore.getBaseUrl() +"/api/directory/",
            data: {'path':path_},
            headers: {
                "X-Auth-Token":  UserStore.token.value
            }
        }).then(function(data_, status_, xhr_){

            console.log("{GetDirectoriesService} getDirectories() success" );

            _this.sink.onNext(data_);

            var _token = xhr_.getResponseHeader("X-Auth-Token");
            if( _token != null && _token !== undefined ){
                AuthActions.saveToken.onNext(_token);
            }

        }, function(xhr_, textStatus_, errorThrown) {

            console.log("{GetFiles Service} getFiles() error" );
            _this.sink.setError(xhr_);
        });


    }

};

