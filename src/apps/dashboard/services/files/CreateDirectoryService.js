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
var DirectoryActions = require('../../actions/DirectoryActions');
var FileActions = require('../../actions/FileActions');



/**
 * @SEE http://docs.spring.io/spring-xd/docs/1.2.0.M1/reference/html/#processors
 * @type {{subscribe: Function, onNext: Function}}
 */

module.exports = {

    sink:undefined,

    subscribe : function(action_){
        console.log("{GetFiles Service} subscribe");
        this.sink = action_.sink;
        action_.source.distinctUntilChanged().subscribe(this.createDirectory.bind(this));
    },

    /**
     * Return all of the files in a given directory
     * @param val_
     * @returns {*}
     */
    createDirectory: function(data_)
    {
        debugger;
        var _this = this;
        var _name = data_.name;
        var _dir = data_.parent.path;
        var _url = PreferenceStore.getBaseUrl() +"/api/directory/";

        return $.ajax({
                    method: "post",
                    url: _url,
                    data: {'path':_dir, 'name':_name},
                    headers: {
                        "X-Auth-Token":  UserStore.token.value
                    }
                }).then(function(data_, status_, xhr_){

            debugger;
                    _this.sink.onNext(data_);
                    // refresh the overall directories list
                    DirectoryActions.refreshDirectories.onNext(true);
                    FileActions.refreshFiles.onNext(true);

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

